export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { revokeRefreshToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refresh_token')?.value

    // 1. Criar resposta e deletar cookies IMEDIATAMENTE
    const response = NextResponse.json({ success: true, message: 'Logout realizado com sucesso' })
    response.cookies.delete('access_token')
    response.cookies.delete('refresh_token')

    // 2. Tentar revogar no banco sem travar a resposta se possível (ou apenas após deletar cookies)
    if (refreshToken) {
      // Nota: No Vercel/Serverless, processos "background" podem ser encerrados
      // Mas para o usuário local, é melhor disparar e não esperar se o driver permitir
      try {
        await revokeRefreshToken(refreshToken)
      } catch (err) {
        console.error('Falha ao revogar token, mas cookies foram limpos:', err)
      }
    }

    return response
  } catch (error) {
    console.error('[LOGOUT]', error)
    return NextResponse.json({ success: false, error: 'Erro ao fazer logout' }, { status: 500 })
  }
}
