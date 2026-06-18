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

const patchTherapySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  price: z.number().min(0).optional(),
  durationMinutes: z.number().int().min(15).max(480).optional(),
  modality: z.nativeEnum(Modality).optional(),
  active: z.boolean().optional(),
  packages: z.array(z.object({
    id: z.string().optional(),
    name: z.string().min(1),
    sessionCount: z.number().int().min(1),
    price: z.number().min(0),
    expirationDays: z.number().int().min(0).optional().nullable(),
    isMultiTherapy: z.boolean().optional(),
    allowedServices: z.array(z.string()).optional(),
    active: z.boolean().optional(),
  })).optional(),
})

async function getOwnedService(therapyId: string, profileId: string) {
  return prisma.therapistService.findFirst({
    where: { id: therapyId, therapistId: profileId },
    include: { packages: true },
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request)
    const gate = await requireTherapistProfileForApi(session)
    if (!gate.ok) return gate.response

    const existing = await getOwnedService(params.id, gate.profileId)
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Terapia não encontrada' }, { status: 404 })
    }

    const body = await request.json()
    const validated = patchTherapySchema.safeParse(body)
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0]?.message || 'Dados inválidos' },
        { status: 400 }
      )
    }

    const nextName = validated.data.name !== undefined ? validated.data.name.trim() : existing.name
    if (validated.data.name !== undefined && nextName.length === 0) {
      return NextResponse.json({ success: false, error: 'Nome é obrigatório' }, { status: 400 })
    }

    if (nextName !== existing.name) {
      const duplicate = await prisma.therapistService.findFirst({
        where: {
          therapistId: gate.profileId,
          id: { not: params.id },
          name: { equals: nextName, mode: 'insensitive' },
        },
      })
      if (duplicate) {
        return NextResponse.json(
          { success: false, error: 'Já existe outra terapia com este nome.' },
          { status: 409 }
        )
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      // 1. Atualizar dados básicos
      const s = await tx.therapistService.update({
        where: { id: params.id },
        data: {
          ...(validated.data.name !== undefined ? { name: nextName } : {}),
          ...(validated.data.price !== undefined ? { price: validated.data.price } : {}),
          ...(validated.data.durationMinutes !== undefined ? { durationMinutes: validated.data.durationMinutes } : {}),
          ...(validated.data.modality !== undefined ? { modality: validated.data.modality } : {}),
          ...(validated.data.active !== undefined ? { active: validated.data.active } : {}),
        },
      })

      // 2. Sincronizar pacotes se enviados
      if (validated.data.packages !== undefined) {
        const incoming = validated.data.packages
        const existingPkgIds = existing.packages.map((p) => p.id)
        const incomingPkgIds = incoming.map((p) => p.id).filter(Boolean) as string[]

        // Deletar os que não vieram
        await tx.therapyPackage.deleteMany({
          where: {
            serviceId: params.id,
            id: { notIn: incomingPkgIds },
          },
        })

        // Atualizar/Criar os que vieram
        for (const pkg of incoming) {
          if (pkg.id && existingPkgIds.includes(pkg.id)) {
            await tx.therapyPackage.update({
              where: { id: pkg.id },
              data: {
                name: pkg.name,
                sessionCount: pkg.sessionCount,
                price: pkg.price,
                expirationDays: pkg.expirationDays,
                isMultiTherapy: pkg.isMultiTherapy ?? false,
                allowedServices: pkg.allowedServices ?? [],
                active: pkg.active ?? true,
              },
            })
          } else {
            await tx.therapyPackage.create({
              data: {
                serviceId: params.id,
                name: pkg.name,
                sessionCount: pkg.sessionCount,
                price: pkg.price,
                expirationDays: pkg.expirationDays,
                isMultiTherapy: pkg.isMultiTherapy ?? false,
                allowedServices: pkg.allowedServices ?? [],
                active: pkg.active ?? true,
              },
            })
          }
        }
      }

      return tx.therapistService.findUnique({
        where: { id: params.id },
        include: { packages: true },
      })
    })

    if (!updated) {
       return NextResponse.json({ success: false, error: 'Erro ao persistir dados' }, { status: 500 })
    }

    await syncTherapistTherapiesFromActiveServices(gate.profileId)
    await syncTherapistListingPriceFromActiveServices(gate.profileId)

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        name: updated.name,
        price: Number(updated.price),
        durationMinutes: updated.durationMinutes,
        currency: updated.currency,
        modality: updated.modality,
        active: updated.active,
        createdAt: updated.createdAt.toISOString(),
        packages: updated.packages.map(p => ({
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
    console.error('[PATCH /api/therapies/:id]', e)
    return NextResponse.json({ success: false, error: 'Erro ao atualizar terapia' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request)
    const gate = await requireTherapistProfileForApi(session)
    if (!gate.ok) return gate.response

    const existing = await getOwnedService(params.id, gate.profileId)
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Terapia não encontrada' }, { status: 404 })
    }

    await prisma.therapistService.delete({ where: { id: params.id } })

    await syncTherapistTherapiesFromActiveServices(gate.profileId)
    await syncTherapistListingPriceFromActiveServices(gate.profileId)

    return NextResponse.json({ success: true, message: 'Terapia removida' })
  } catch (e) {
    console.error('[DELETE /api/therapies/:id]', e)
    return NextResponse.json({ success: false, error: 'Erro ao remover terapia' }, { status: 500 })
  }
}
