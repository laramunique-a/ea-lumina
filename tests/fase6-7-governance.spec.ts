import { test, expect } from '@playwright/test'
import { getWelcomePatientEmail, getWelcomeTherapistEmail, getIncompleteProfileEmail } from '../src/lib/email-templates'

test.describe('Fase 6 & 7 — Governança, Termos, Privacidade e E-mails', () => {

  test('Template de e-mail de paciente possui formato responsivo e sem promessas falsas', () => {
    const tpl = getWelcomePatientEmail('Maria Silva')
    expect(tpl.subject).toContain('Boas-vindas')
    expect(tpl.html).toContain('Maria Silva')
    expect(tpl.html).toContain('/privacidade')
    expect(tpl.html).toContain('/termos')
    expect(tpl.html).not.toContain('Cura garantida')
    expect(tpl.html).not.toContain('Milhares de pacientes aguardam')
  })

  test('Template de e-mail de terapeuta reforça responsabilidade e manifesto', () => {
    const tpl = getWelcomeTherapistEmail('Dr. João')
    expect(tpl.subject).toContain('Rede Lumina')
    expect(tpl.html).toContain('Dr. João')
    expect(tpl.html).toContain('Manifesto')
    expect(tpl.html).not.toContain('Cura garantida')
  })

  test('Template de e-mail de perfil incompleto é personalizado por papel', () => {
    const tplPatient = getIncompleteProfileEmail('Ana', 'PACIENTE')
    const tplTherapist = getIncompleteProfileEmail('Carlos', 'TERAPEUTA')

    expect(tplPatient.html).toContain('/dashboard/paciente/perfil')
    expect(tplTherapist.html).toContain('/dashboard/terapeuta/perfil')
  })

  test('Página pública de Privacidade é acessível e contém aviso legal LGPD', async ({ page }) => {
    await page.goto('/privacidade')
    await expect(page.getByRole('heading', { name: 'Política de Privacidade' })).toBeVisible()
    await expect(page.getByText('Tratamento de Dados Pessoais Sensíveis')).toBeVisible()
    await expect(page.getByText('Seus Direitos como Titular dos Dados')).toBeVisible()
    await expect(page.getByText('privacidade@ealumina.com')).toBeVisible()
  })

  test('Página pública de Termos de Uso possui avisos de emergência e ausência de garantia', async ({ page }) => {
    await page.goto('/termos')
    await expect(page.getByRole('heading', { name: 'Termos de Uso' })).toBeVisible()
    await expect(page.getByText('SAMU (192)')).toBeVisible()
    await expect(page.getByText('Ausência de Garantia de Resultados Clinicos')).toBeVisible()
    await expect(page.getByText('Natureza de Intermediação Tecnológica')).toBeVisible()
  })

  test('Página de Empresas possui avisos da Lei 14.831/2024 e formulário funcional', async ({ page }) => {
    await page.goto('/empresas')
    await expect(page.getByText('Lei nº 14.831/2024')).toBeVisible()
    await expect(page.getByRole('button', { name: /Solicitar Diagnóstico/i })).toBeVisible()
  })

  test('Página pública de Terapeutas lista os profissionais com taxonomia', async ({ page }) => {
    await page.goto('/terapeutas')
    await expect(page.getByRole('heading', { name: 'Encontre sua Conexão Terapêutica' })).toBeVisible()
    await expect(page.getByPlaceholder('Buscar por nome, técnica ou objetivo...')).toBeVisible()
  })

})
