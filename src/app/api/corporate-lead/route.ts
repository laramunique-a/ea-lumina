export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const CorporateLeadSchema = z.object({
  companyName: z.string().min(2, 'Nome da empresa é obrigatório'),
  contactName: z.string().min(2, 'Nome do contato é obrigatório'),
  email: z.string().email('E-mail corporativo inválido'),
  phone: z.string().optional(),
  employeeCount: z.string().optional(),
  industry: z.string().optional(),
  mainChallenges: z.string().optional(),
  desiredProgram: z.string().optional(),
  honeypot: z.string().optional(), // Anti-spam honeypot
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Anti-spam check (honeypot field must be empty)
    if (body.honeypot && body.honeypot.trim() !== '') {
      return NextResponse.json({ success: true, message: 'Solicitação recebida com sucesso.' })
    }

    const validation = CorporateLeadSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        error: 'Dados inválidos',
        details: validation.error.format()
      }, { status: 400 })
    }

    const data = validation.data

    const lead = await prisma.corporateLead.create({
      data: {
        companyName: data.companyName,
        contactName: data.contactName,
        email: data.email,
        phone: data.phone,
        employeeCount: data.employeeCount,
        industry: data.industry,
        mainChallenges: data.mainChallenges,
        desiredProgram: data.desiredProgram,
        status: 'NEW',
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Solicitação corporativa enviada com sucesso! Nossa equipe entrará em contato em breve.',
      leadId: lead.id
    })
  } catch (error: any) {
    console.error('[POST CORPORATE LEAD]', error)
    return NextResponse.json({ success: false, error: 'Erro ao registrar solicitação corporativa' }, { status: 500 })
  }
}
