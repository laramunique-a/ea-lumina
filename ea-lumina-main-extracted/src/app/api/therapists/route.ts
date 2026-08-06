export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Modality } from '@prisma/client'
import { listingPriceFromServices } from '@/lib/therapist-pricing'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const page = Math.max(1, Number(searchParams.get('page') || '1'))
    const perPage = Math.min(Math.max(1, Number(searchParams.get('perPage') || '12')), 50)
    const search = searchParams.get('search') || ''
    const therapy = searchParams.get('therapy') || ''
    const modality = searchParams.get('modality') as Modality | null
    const minPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined
    const maxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined
    const minRating = searchParams.get('minRating') ? Number(searchParams.get('minRating')) : undefined
    const city = searchParams.get('city') || ''
    const state = searchParams.get('state') || ''

    const skip = (page - 1) * perPage

    const where: any = {
      approved: true,
      user: { active: true },
    }

    if (search) {
      where.user = {
        ...where.user,
        name: { contains: search, mode: 'insensitive' },
      }
    }

    if (therapy) {
      where.therapies = { has: therapy }
    }

    if (modality && modality !== 'AMBOS') {
      where.OR = [{ modality }, { modality: 'AMBOS' }]
    }

    // Preço: sem serviços ativos usa profile.price; com serviços, pelo menos um serviço com price na faixa (aprox.; promo não entra no filtro SQL)
    if (minPrice !== undefined || maxPrice !== undefined) {
      const servicePriceRange: Record<string, unknown> = { active: true }
      if (minPrice !== undefined) Object.assign(servicePriceRange, { price: { gte: minPrice } })
      if (maxPrice !== undefined) {
        const prev = servicePriceRange.price as Record<string, unknown> | undefined
        servicePriceRange.price =
          prev && typeof prev === 'object'
            ? { ...prev, lte: maxPrice }
            : { lte: maxPrice }
      }
      const noServicesPrice: Record<string, unknown> = {}
      if (minPrice !== undefined) Object.assign(noServicesPrice, { gte: minPrice })
      if (maxPrice !== undefined) Object.assign(noServicesPrice, { lte: maxPrice })
      where.AND = [
        ...(Array.isArray(where.AND) ? where.AND : []),
        {
          OR: [
            {
              AND: [{ services: { none: { active: true } } }, { price: noServicesPrice }],
            },
            { services: { some: servicePriceRange } },
          ],
        },
      ]
    }
    if (minRating !== undefined) where.rating = { gte: minRating }
    if (city) where.city = { contains: city, mode: 'insensitive' }
    if (state) where.state = state

    const therapists = await prisma.therapistProfile.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, avatarUrl: true },
        },
        addresses: true,
        availability: {
          where: { active: true },
          select: { dayOfWeek: true, startTime: true, endTime: true, slotDuration: true, date: true, active: true },
        },
        services: {
          where: { active: true },
          select: {
            id: true,
            name: true,
            description: true,
            durationMinutes: true,
            price: true,
            priceUsd: true,
            priceEur: true,
            promoPrice: true,
            promoPriceUsd: true,
            promoPriceEur: true,
            currency: true,
            modality: true,
            packages: {
              where: { active: true },
              select: {
                id: true,
                name: true,
                sessionCount: true,
                price: true,
                priceUsd: true,
                priceEur: true,
                expirationDays: true,
                isMultiTherapy: true,
                allowedServices: true,
              },
            },
          },
        },
      },
    })

    // Separar os com destaque (featured) e os normais
    const featuredList = therapists.filter((t) => t.featured)
    const regularList = therapists.filter((t) => !t.featured)

    // Seeded random number generator
    const seededRandom = (seedStr: string) => {
      let h = 0
      for (let i = 0; i < seedStr.length; i++) {
        h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0
      }
      return function () {
        h = Math.imul(h ^ h >>> 16, 2246822507)
        h = Math.imul(h ^ h >>> 13, 3266489909)
        return ((h ^= h >>> 16) >>> 0) / 4294967296
      }
    }

    const shuffle = <T>(array: T[], seedStr: string): T[] => {
      const rng = seededRandom(seedStr)
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    const seed = searchParams.get('seed') || 'lumina'
    const shuffledFeatured = shuffle(featuredList, seed)
    const shuffledRegular = shuffle(regularList, seed)
    const combined = [...shuffledFeatured, ...shuffledRegular]

    const total = combined.length
    const paginated = combined.slice(skip, skip + perPage)

    const items = paginated.map((t) => {
      const profilePrice = Number(t.price)
      const listingPrice = listingPriceFromServices(
        t.services.map((s) => ({
          price: Number(s.price),
          promoPrice: s.promoPrice != null ? Number(s.promoPrice) : null,
        })),
        profilePrice
      )
      return {
        ...t,
        price: listingPrice,
        profilePrice,
        services: t.services.map((s) => ({
          ...s,
          price: Number(s.price),
          priceUsd: s.priceUsd ? Number(s.priceUsd) : null,
          priceEur: s.priceEur ? Number(s.priceEur) : null,
          promoPrice: s.promoPrice != null ? Number(s.promoPrice) : null,
          promoPriceUsd: s.promoPriceUsd != null ? Number(s.promoPriceUsd) : null,
          promoPriceEur: s.promoPriceEur != null ? Number(s.promoPriceEur) : null,
          packages: s.packages.map((p) => ({
            ...p,
            price: Number(p.price),
            priceUsd: p.priceUsd ? Number(p.priceUsd) : null,
            priceEur: p.priceEur ? Number(p.priceEur) : null,
          })),
        })),
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        items,
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    })
  } catch (error) {
    console.error('[GET THERAPISTS]', error)
    return NextResponse.json({ success: false, error: 'Erro ao buscar terapeutas' }, { status: 500 })
  }
}
