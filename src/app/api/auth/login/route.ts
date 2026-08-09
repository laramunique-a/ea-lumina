export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { generateAccessToken, generateRefreshToken, saveRefreshToken, getAuthCookieOptions } from '@/lib/auth'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'

const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
})

export async function POST(request: NextRequest) {
  // Rate limiting: máx. 10 tentativas de login por IP em 15 minutos
  const ip = getClientIp(request)
  const rl = checkRateLimit(`login:${ip}`, { limit: 10, windowSeconds: 15 * 60 })
  if (!rl.allowed) {
    const retryAfterSeconds = Math.ceil((rl.resetAt - Date.now()) / 1000)
    return NextResponse.json(
      { success: false, error: 'Muitas tentativas de login. Tente novamente em alguns minutos.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfterSeconds),
          'X-RateLimit-Limit': '10',
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(rl.resetAt / 1000)),
        },
      }
    )
  }

  try {
    const body = await request.json()
    const validated = loginSchema.safeParse(body)

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: validated.error.errors[0].message },
        { status: 400 }
      )
    }

    const { email, password } = validated.data
    const normalizedEmail = email.toLowerCase().trim()

    let user = null
    try {
      user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          active: true,
          avatarUrl: true,
          patientProfile: { select: { socialName: true } },
          therapistProfile: { select: { professionalName: true } },
        },
      })
    } catch (dbErr) {
      const err = dbErr instanceof Error ? dbErr : new Error(String(dbErr))
      console.error('[LOGIN_DB_ERROR]', err.message, err.stack)
      return NextResponse.json(
        { success: false, error: 'Erro ao conectar ao banco de dados: ' + err.message },
        { status: 500 }
      )
    }

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return NextResponse.json(
        { success: false, error: 'E-mail ou senha incorretos' },
        { status: 401 }
      )
    }

    if (!user.active) {
      return NextResponse.json(
        { success: false, error: 'Sua conta está desativada. Entre em contato com o suporte.' },
        { status: 403 }
      )
    }

    const tokenPayload = { sub: user.id, email: user.email, role: user.role, name: user.name }
    const accessToken = await generateAccessToken(tokenPayload)
    const refreshToken = await generateRefreshToken(tokenPayload)

    await saveRefreshToken(user.id, refreshToken)

    const response = NextResponse.json({
      success: true,
      data: {
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role, 
          avatarUrl: user.avatarUrl,
          socialName: user.patientProfile?.socialName ?? null,
          professionalName: user.therapistProfile?.professionalName ?? null
        },
        accessToken,
      },
    })

    const cookieOptions = getAuthCookieOptions()
    response.cookies.set('access_token', accessToken, { ...cookieOptions, maxAge: 8 * 60 * 60 })
    response.cookies.set('refresh_token', refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 })

    return response
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error('[LOGIN_FATAL_ERROR]', err.message, err.stack)
    return NextResponse.json({ success: false, error: err.message || 'Erro ao realizar login' }, { status: 500 })
  }
}
