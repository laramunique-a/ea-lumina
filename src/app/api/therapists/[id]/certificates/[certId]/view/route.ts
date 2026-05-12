export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { createSignedDocumentUrl } from '@/lib/supabase'

/**
 * GET /api/therapists/[id]/certificates/[certId]/view
 *
 * Funciona como o /signed-url, mas retorna um redirecionamento HTTP 307
 * direto para a URL assinada. Isso permite usar esse endpoint
 * diretamente no atributo 'src' de uma tag <img>.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; certId: string } }
) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) {
      return new NextResponse('Não autenticado', { status: 401 })
    }

    const cert = await prisma.therapistCertificate.findUnique({
      where: { id: params.certId },
      include: { therapist: { select: { userId: true } } },
    })

    if (!cert) {
      return new NextResponse('Certificado não encontrado', { status: 404 })
    }

    if (cert.therapist.userId !== session.sub && session.role !== 'ADMIN') {
      return new NextResponse('Sem permissão', { status: 403 })
    }

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

    if (!storagePath) {
      return new NextResponse('Caminho inválido', { status: 400 })
    }

    const { signedUrl, error } = await createSignedDocumentUrl(storagePath, 3600)

    if (error || !signedUrl) {
      console.error('[GET /view] Erro ao gerar URL:', error)
      return new NextResponse('Erro ao gerar URL', { status: 500 })
    }

    // Redireciona o navegador diretamente para a imagem na nuvem
    return NextResponse.redirect(signedUrl, 307)
  } catch (error) {
    console.error('[GET /view]', error)
    return new NextResponse('Erro interno', { status: 500 })
  }
}
