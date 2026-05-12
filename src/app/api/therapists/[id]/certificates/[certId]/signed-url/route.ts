export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/auth'
import { createSignedDocumentUrl } from '@/lib/supabase'

/**
 * GET /api/therapists/[id]/certificates/[certId]/signed-url
 *
 * Gera uma URL assinada temporária (1h) para visualizar um certificado.
 * Apenas o próprio terapeuta ou um ADMIN pode acessar.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; certId: string } }
) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) {
      return NextResponse.json({ success: false, error: 'Não autenticado' }, { status: 401 })
    }

    // Buscar o certificado e verificar ownership
    const cert = await prisma.therapistCertificate.findUnique({
      where: { id: params.certId },
      include: { therapist: { select: { userId: true } } },
    })

    if (!cert) {
      return NextResponse.json({ success: false, error: 'Certificado não encontrado' }, { status: 404 })
    }

    // Verificar se o terapeuta é dono ou se é admin
    if (cert.therapist.userId !== session.sub && session.role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Sem permissão para acessar este certificado' }, { status: 403 })
    }

    // Extrair o storagePath da fileUrl salva no banco
    // Formatos possíveis:
    // - URL pública: https://[ref].supabase.co/storage/v1/object/public/documents/certificates/...
    // - Já é o storagePath: certificates/[id]/...
    let storagePath: string | null = null
    try {
      const url = new URL(cert.fileUrl)
      // Extrai tudo depois de /public/documents/
      const match = url.pathname.match(/\/storage\/v1\/object\/public\/documents\/(.+)/)
      if (match) {
        storagePath = match[1]
      }
    } catch {
      // fileUrl pode já ser o path direto (não uma URL completa)
      storagePath = cert.fileUrl
    }

    if (!storagePath) {
      return NextResponse.json(
        { success: false, error: 'Caminho do arquivo inválido' },
        { status: 400 }
      )
    }

    const { signedUrl, error } = await createSignedDocumentUrl(storagePath, 3600)

    if (error || !signedUrl) {
      console.error('[signed-url] Erro ao gerar URL assinada:', error)
      return NextResponse.json(
        { success: false, error: error || 'Falha ao gerar URL de visualização' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        signedUrl,
        fileName: cert.name,
        expiresIn: 3600,
      },
    })
  } catch (error) {
    console.error('[GET /signed-url]', error)
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}
