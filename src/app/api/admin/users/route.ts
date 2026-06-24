export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { Role } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Acesso negado' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') as Role | null
    const page = Math.max(1, Number(searchParams.get('page') || '1'))
    const perPage = Math.min(Math.max(1, Number(searchParams.get('perPage') || '20')), 100)
    const skip = (page - 1) * perPage

    // Novos parâmetros de busca e filtros
    const search = searchParams.get('search') || ''
    const activeParam = searchParams.get('active')
    const approvedParam = searchParams.get('approved')
    const sort = searchParams.get('sort') || 'name_asc' // Padrão agora é A-Z

    const where: any = {}
    
    if (role) {
      where.role = role
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (activeParam === 'true') {
      where.active = true
    } else if (activeParam === 'false') {
      where.active = false
    }

    // Filtragem por aprovação do perfil de terapeuta
    if (approvedParam === 'true') {
      where.therapistProfile = { approved: true }
    } else if (approvedParam === 'false') {
      where.therapistProfile = { approved: false }
    }

    // Configurar ordenação
    let orderBy: any = { name: 'asc' }
    if (sort === 'name_desc') {
      orderBy = { name: 'desc' }
    } else if (sort === 'createdAt_desc') {
      orderBy = { createdAt: 'desc' }
    } else if (sort === 'createdAt_asc') {
      orderBy = { createdAt: 'asc' }
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          avatarUrl: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
          birthDate: true,
          therapistProfile: {
            select: {
              id: true,
              therapies: true,
              price: true,
              modality: true,
              location: true,
              city: true,
              state: true,
              country: true,
              rating: true,
              reviewCount: true,
              approved: true,
              yearsExp: true,
              documentUrl: true,
              documentFileName: true,
              professionalName: true,
              professionalEmail: true,
              whatsapp: true,
              bio: true,
              nationality: true,
              languages: true,
              instagram: true,
              facebook: true,
              websiteUrl: true,
              presentationVideoUrl: true,
              certificates: {
                select: {
                  id: true,
                  name: true,
                  fileUrl: true,
                },
              },
            },
          },
          patientProfile: {
            select: {
              id: true,
              birthDate: true,
              gender: true,
              socialName: true,
              maritalStatus: true,
              profession: true,
              zipCode: true,
              street: true,
              number: true,
              complement: true,
              neighborhood: true,
              city: true,
              state: true,
              anamnese: true,
            },
          },
        },
        orderBy,
        skip,
        take: perPage,
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: users,
      total,
      page,
      perPage,
      totalPages: Math.ceil(total / perPage),
    })
  } catch (error) {
    console.error('[ADMIN GET USERS]', error)
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}
