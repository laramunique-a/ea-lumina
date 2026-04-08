'use client'

import { Button } from '@/components/ui/Button'
import { FileText, Download } from 'lucide-react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface GeneratePdfButtonProps {
  patient: any
}

export function GeneratePatientPdfButton({ patient }: GeneratePdfButtonProps) {
  const [generating, setGenerating] = useState(false)

  const generatePdf = async () => {
    setGenerating(true)
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    try {
      // --- Cabeçalho ---
      doc.setFillColor(0, 144, 255) // #0090FF
      doc.rect(0, 0, pageWidth, 40, 'F')
      
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      const displayName = patient.socialName || patient.user.name
      doc.text(displayName, 20, 22)
      
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Relatório Clínico do Paciente', 20, 30)
      doc.text(`Gerado em: ${format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}`, 20, 36)

      // --- Informações Clínicas (Anamnese) ---
      let y = 55
      if (patient.anamnese) {
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('1. Informações Clínicas (Anamnese)', 20, y)
        y += 8
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        
        Object.entries(patient.anamnese).forEach(([key, val]) => {
          if (y > 270) {
            doc.addPage()
            y = 20
          }
          
          doc.setFont('helvetica', 'bold')
          // Formatar a chave para ser mais amigável (camelCase -> Human Readable)
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim()
            
          const question = formattedKey.toUpperCase() + ':'
          doc.text(question, 20, y)
          
          doc.setFont('helvetica', 'normal')
          const answer = val?.toString() || '-'
          const splitAnswer = doc.splitTextToSize(answer, pageWidth - 40)
          doc.text(splitAnswer, 20, y + 5)
          
          y += 10 + (splitAnswer.length * 5)
        })
      }

      // --- Dados Pessoais ---
      y += 10
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('2. Dados de Identificação', 20, y)
      
      y += 10
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      
      doc.text(`E-mail: ${patient.user.email}`, 20, y)
      y += 7
      if (patient.socialName) {
        doc.text(`Nome Social: ${patient.socialName}`, 20, y)
        y += 7
      }
      const birthStr = patient.birthDate ? format(new Date(patient.birthDate), 'dd/MM/yyyy') : 'Não informado'
      doc.text(`Data de Nascimento: ${birthStr}`, 20, y)
      y += 7
      doc.text(`Gênero: ${patient.gender || '-'}`, 20, y)
      y += 7
      doc.text(`Estado Civil: ${patient.maritalStatus || '-'}`, 20, y)
      y += 7
      doc.text(`Profissão: ${patient.profession || '-'}`, 20, y)
      y += 7
      doc.text(`Localização: ${patient.city || '-'}, ${patient.state || '-'}`, 20, y)

      // --- Histórico de Sessões ---
      y += 15
      if (y > 240) {
        doc.addPage()
        y = 20
      }

      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('3. Histórico de Sessões com o Profissional', 20, y)
      y += 5

      const tableData = patient.appointments.map((apt: any) => [
        format(new Date(apt.date), 'dd/MM/yyyy HH:mm'),
        apt.service?.name || 'Sessão Individual',
        apt.status
      ])

      autoTable(doc, {
        startY: y + 5,
        head: [['Data e Hora', 'Serviço', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [0, 144, 255] },
        styles: { fontSize: 9 }
      })

      // Salvar
      const fileName = `Relatorio_Paciente_${displayName.replace(/\s+/g, '_')}.pdf`
      doc.save(fileName)
      toast.success('PDF gerado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast.error('Ocorreu um erro ao gerar o PDF')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      onClick={generatePdf} 
      loading={generating}
      className="rounded-xl border-slate-200 text-slate-600 font-bold gap-2 shadow-sm hover:bg-slate-50 h-11 px-6 transition-all"
    >
      {!generating && <FileText size={18} className="text-[#0090FF]" />}
      Gerar PDF do Paciente
    </Button>
  )
}
