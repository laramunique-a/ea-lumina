export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { requireTherapistProfileForApi } from '@/lib/api-therapist-self'
import { z } from 'zod'
import { Modality } from '@prisma/client'
import {
  syncTherapistListingPriceFromActiveServices,
  syncTherapistTherapiesFromActiveServices,
} from '@/lib/sync-therapist-therapies-from-services'

/**
 * Terapias do terapeuta logado.
 * Persistência: `TherapistService` (mesma entidade usada em agenda e booking).
 */
const createTherapySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  price: z.number().min(0, 'Valor inválido'),
  durationMinutes: z
    .number()
    .int()
    .min(15, 'Duração mínima: 15 min')
    .max(480, 'Duração máxima: 480 min'),
  modality: z.nativeEnum(Modality).optional(),
  packages: z.array(z.object({
    name: z.string().min(1, 'Nome do pacote é obrigatório'),
    sessionCount: z.number().int().min(2, 'No mínimo 2 sessões'),
    price: z.number().min(0, 'Valor do pacote inválido'),
    expirationDays: z.number().int().min(0).optional().nullable(),
    isMultiTherapy: z.boolean().optional(),
    allowedServices: z.array(z.string()).optional(),
  })).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    const gate = await requireTherapistProfileForApi(session)
    if (!gate.ok) return gate.response

    const rows = await prisma.therapistService.findMany({
      where: { therapistId: gate.profileId },
      include: { packages: true },
      orderBy: { createdAt: 'desc' },
    })

    const data = rows.map((s) => ({
      id: s.id,
      name: s.name,
      price: Number(s.price),
      durationMinutes: s.durationMinutes,
      currency: s.currency,
      modality: s.modality,
      active: s.active,
      createdAt: s.createdAt.toISOString(),
      packages: s.packages.map(p => ({
        id: p.id,
        name: p.name,
        sessionCount: p.sessionCount,
        price: Number(p.price),
        expirationDays: p.expirationDays,
        isMultiTherapy: p.isMultiTherapy,
        allowedServices: p.allowedServices,
        active: p.active
      }))
    }))

    return NextResponse.json({ success: true, data })
  } catch (e) {
    console.error('[GET /api/therapies]', e)
    return NextResponse.json({ success: false, error: 'Erro ao listar terapias' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    const gate = await requireTherapistProfileForApi(session)
    if (!gate.ok) return gate.response

    const body = await request.json()
    const validated = createTherapySchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0]?.message || 'Dados inválidos' },
        { status: 400 }
      )
    }

    const { name, price, durationMinutes, modality, packages } = validated.data
    const trimmed = name.trim()

    // ... (duplicidade checks permanecem iguais)

    const service = await prisma.therapistService.create({
      data: {
        therapistId: gate.profileId,
        name: trimmed,
        description: null,
        problemsHelped: null,
        durationMinutes,
        price,
        promoPrice: null,
        currency: 'BRL',
        modality: modality ?? Modality.AMBOS,
        packages: packages ? {
          create: packages.map(p => ({
            name: p.name,
            sessionCount: p.sessionCount,
            price: p.price,
            expirationDays: p.expirationDays,
            isMultiTherapy: p.isMultiTherapy ?? false,
            allowedServices: p.allowedServices ?? [],
          }))
        } : undefined
      },
      include: { packages: true }
    })

    await syncTherapistTherapiesFromActiveServices(gate.profileId)
    await syncTherapistListingPriceFromActiveServices(gate.profileId)

    return NextResponse.json({
      success: true,
      data: {
        id: service.id,
        name: service.name,
        price: Number(service.price),
        durationMinutes: service.durationMinutes,
        currency: service.currency,
        modality: service.modality,
        active: service.active,
        createdAt: service.createdAt.toISOString(),
        packages: service.packages.map(p => ({
          id: p.id,
          name: p.name,
          sessionCount: p.sessionCount,
          price: Number(p.price),
          expirationDays: p.expirationDays,
          isMultiTherapy: p.isMultiTherapy,
          allowedServices: p.allowedServices,
          active: p.active
        }))
      },
    })
  } catch (e) {
    console.error('[POST /api/therapies]', e)
    return NextResponse.json({ success: false, error: 'Erro ao salvar terapia' }, { status: 500 })
  }
}
