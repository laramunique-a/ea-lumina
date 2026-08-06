import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { WhatsAppService } from '@/lib/whatsapp/service'
import { WA_EVENTS } from '@/lib/whatsapp/types'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  // Simple token security to protect database output
  if (token !== 'lumina_debug_987') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // 1. Get configurations (masked for security)
    const provider = process.env.WHATSAPP_PROVIDER || 'evolution'
    const configs = {
      WHATSAPP_PROVIDER: provider,
      EVOLUTION_API_URL: process.env.EVOLUTION_API_URL ? 'Configured' : 'Missing',
      EVOLUTION_API_KEY: process.env.EVOLUTION_API_KEY ? `${process.env.EVOLUTION_API_KEY.slice(0, 4)}...${process.env.EVOLUTION_API_KEY.slice(-4)}` : 'Missing',
      EVOLUTION_API_INSTANCE: process.env.EVOLUTION_API_INSTANCE || 'Missing',
      META_WA_ACCESS_TOKEN: process.env.META_WA_ACCESS_TOKEN ? 'Configured' : 'Missing',
      META_WA_PHONE_NUMBER_ID: process.env.META_WA_PHONE_NUMBER_ID || 'Missing',
      META_WA_BUSINESS_ACCOUNT_ID: process.env.META_WA_BUSINESS_ACCOUNT_ID || 'Missing',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'Missing'
    }

    // 2. Fetch Evolution API Health/Connection State directly
    let evolutionHealth: any = null
    if (provider === 'evolution') {
      try {
        const baseUrl = (process.env.EVOLUTION_API_URL || '').replace(/\/$/, '')
        const instance = process.env.EVOLUTION_API_INSTANCE || ''
        const apiKey = process.env.EVOLUTION_API_KEY || ''
        const targetUrl = `${baseUrl}/instance/connectionState/${instance}`
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 8000)
        
        const res = await fetch(targetUrl, {
          method: 'GET',
          headers: { 'apikey': apiKey },
          signal: controller.signal
        })
        clearTimeout(timeoutId)
        
        const bodyText = await res.text()
        let parsed = bodyText
        try { parsed = JSON.parse(bodyText) } catch {}
        
        evolutionHealth = {
          targetUrl,
          httpStatus: res.status,
          ok: res.ok,
          response: parsed
        }
      } catch (err: any) {
        evolutionHealth = {
          targetUrl: `${process.env.EVOLUTION_API_URL}/instance/connectionState/${process.env.EVOLUTION_API_INSTANCE}`,
          error: err.message,
          cause: err.cause ? String(err.cause) : null,
          code: err.code || err.cause?.code || null
        }
      }
    }

    // 3. Fetch last 15 WhatsApp logs
    const logs = await prisma.whatsAppNotification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 15,
    })

    // 4. Optional: Trigger a test message if phone is provided
    const testPhone = searchParams.get('testPhone')
    let testResult = null
    if (testPhone) {
      const someAppointment = await prisma.appointment.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
          therapist: { include: { user: true } },
          patient: { include: { user: true } }
        }
      })

      if (someAppointment) {
        // Delete any existing log for this test to force fresh execution
        await prisma.whatsAppNotification.deleteMany({
          where: {
            appointmentId: someAppointment.id,
            event: WA_EVENTS.BOOKING_REQUESTED_THERAPIST,
            recipientType: 'THERAPIST'
          }
        })

        testResult = await WhatsAppService.notify(
          someAppointment.id,
          WA_EVENTS.BOOKING_REQUESTED_THERAPIST,
          'THERAPIST',
          testPhone,
          {
            patientName: 'Teste Paciente',
            therapistName: 'Teste Terapeuta',
            date: '2026-07-21',
            time: '09:30',
            dashboardUrl: 'https://ealumina.com'
          }
        )
      } else {
        testResult = 'No appointment found to use for test payload'
      }
    }

    return NextResponse.json({
      success: true,
      configs,
      evolutionHealth,
      testResult,
      logs
    })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
