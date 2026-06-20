export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { effectiveServiceCharge, listingPriceFromServices } from '@/lib/therapist-pricing'
import { createSignedDocumentUrl } from '@/lib/supabase'
import { getSessionFromRequest } from '@/lib/auth'

/**
 * GET /api/therapists/[id]/public
 * Perfil público do terapeuta (para página de apresentação do paciente).
 * Só retorna se approved e user ativo (ou se for ADMIN acessando).
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSessionFromRequest(request)
    const isAdmin = session?.role === 'ADMIN'

    const profile = await prisma.therapistProfile.findUnique({
      where: {
        id: params.id,
        ...(isAdmin ? {} : { approved: true }),
        user: { active: true },
      },
      include: {
        user: {
          select: { id: true, name: true, avatarUrl: true, phone: true },
        },
        availability: {
          select: { dayOfWeek: true, startTime: true, endTime: true, slotDuration: true, date: true, active: true },
        },
        services: {
          where: { active: true },
          select: {
            id: true,
            name: true,
            description: true,
            problemsHelped: true,
            durationMinutes: true,
            price: true,
            promoPrice: true,
            currency: true,
            modality: true,
            packages: {
              where: { active: true },
              select: {
                id: true,
                name: true,
                sessionCount: true,
                price: true,
                expirationDays: true,
                isMultiTherapy: true,
                allowedServices: true,
              },
            },
          },
        },
        targetAudience: {
          select: { specialNeeds: true },
        },
        certificates: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, name: true, fileUrl: true },
        },
        reviews: {
          orderBy: { createdAt: 'desc' },
          take: 3,
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true,
            author: { select: { name: true, avatarUrl: true, patientProfile: { select: { socialName: true } } } },
            appointment: { 
              select: { 
                service: { select: { name: true } } 
              } 
            }
          }
        },
        appointments: {
          where: {
            status: { in: ['PENDENTE', 'CONFIRMADO'] },
            date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
          },
          select: {
            id: true,
            date: true,
            durationMinutes: true,
          },
        }
      },
    })

    if (!profile) {
      return NextResponse.json({ success: false, error: 'Perfil não encontrado' }, { status: 404 })
    }

    const profilePrice = Number(profile.price)
    const servicesPayload = profile.services.map((s) => ({
      id: s.id,
      name: s.name,
      description: s.description,
      problemsHelped: s.problemsHelped,
      durationMinutes: s.durationMinutes,
      price: Number(s.price),
      promoPrice: s.promoPrice ? Number(s.promoPrice) : null,
      displayPrice: effectiveServiceCharge({
        price: Number(s.price),
        promoPrice: s.promoPrice != null ? Number(s.promoPrice) : null,
      }),
      currency: s.currency,
      modality: s.modality,
      packages: s.packages.map((p) => ({
        id: p.id,
        name: p.name,
        sessionCount: p.sessionCount,
        price: Number(p.price),
        expirationDays: p.expirationDays,
        isMultiTherapy: p.isMultiTherapy,
        allowedServices: p.allowedServices,
      })),
    }))
    const listingPrice = listingPriceFromServices(
      profile.services.map((s) => ({
        price: Number(s.price),
        promoPrice: s.promoPrice != null ? Number(s.promoPrice) : null,
      })),
      profilePrice
    )

    const certificatesWithSignedUrls = await Promise.all(
      profile.certificates.map(async (cert) => {
        let storagePath: string | null = null
        try {
          const url = new URL(cert.fileUrl)
          const match = url.pathname.match(/\/storage\/v1\/object\/public\/documents\/(.+)/)
          if (match) {
            storagePath = match[1]
          }
        } catch {
          storagePath = cert.fileUrl
        }

        if (storagePath) {
          const { signedUrl } = await createSignedDocumentUrl(storagePath, 3600)
          if (signedUrl) {
            return {
              ...cert,
              fileUrl: signedUrl,
            }
          }
        }
        return cert
      })
    )

    const data = {
      id: profile.id,
      bio: profile.bio,
      therapies: profile.therapies,
      price: listingPrice,
      profilePrice,
      modality: profile.modality,
      location: profile.location,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      nationality: profile.nationality,
      professionalName: profile.professionalName,
      languages: profile.languages,
      whatsapp: profile.whatsapp,
      professionalEmail: profile.professionalEmail,
      instagram: profile.instagram,
      facebook: profile.facebook,
      websiteUrl: profile.websiteUrl,
      rating: profile.rating,
      reviewCount: profile.reviewCount,
      yearsExp: profile.yearsExp,
      certifications: profile.certifications,
      user: profile.user,
      availability: profile.availability,
      services: servicesPayload,
      certificates: certificatesWithSignedUrls,
      reviews: profile.reviews,
      presentationVideoUrl: profile.presentationVideoUrl,
      appointments: profile.appointments.map((apt) => ({
        id: apt.id,
        date: apt.date.toISOString(),
        durationMinutes: apt.durationMinutes,
      })),
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('[GET THERAPIST PUBLIC]', error)
    return NextResponse.json({ success: false, error: 'Erro ao carregar perfil' }, { status: 500 })
  }
}
