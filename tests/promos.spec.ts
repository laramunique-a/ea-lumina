import { test, expect } from '@playwright/test'
import {
  loginAsTherapist,
  loginAsPatient,
  logout,
  ROUTES,
  TEST_THERAPIST,
} from './helpers/auth'
import { attachPageMonitoring } from './helpers/monitor'

test('Therapist package creation with multi-therapy allowedServices and Patient booking usage', async ({ page }) => {
  test.setTimeout(120_000)
  const monitor = attachPageMonitoring(page)
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()))
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.message))
  const packageName = 'E2E Test Package ' + Date.now()

  // 1. Log in as therapist
  await loginAsTherapist(page)

  // Go to therapies page
  await page.goto(ROUTES.therapistTerapias)

  // Click on "Pacotes Promocionais" tab
  await page.getByRole('button', { name: /Pacotes Promocionais/i }).click()

  // Click 'Criar Pacote'
  await page.getByRole('button', { name: /Criar Pacote/i }).first().click()

  // In the modal, check elements
  await expect(page.getByText('Sessão / Terapia Base associada')).toBeVisible()
  
  // Fill Name
  await page.getByLabel('Nome do Pacote Promocional').fill(packageName)

  // Label check: "Total de Sessões" should be present, not "Qtd total de Sessões"
  await expect(page.getByLabel('Total de Sessões')).toBeVisible()
  await page.getByLabel('Total de Sessões').fill('3')

  // Fill Price
  await page.getByLabel('Valor Total (R$)').fill('150')
  await page.getByLabel('Valor Total (R$)').blur() // triggers BRL formatting check

  // Locate "Flexível (Multi-Terapias)" checkbox and toggle it
  const multiTherapyCheckbox = page.locator('input[type="checkbox"]').first()
  await multiTherapyCheckbox.check()

  // Dynamically displayed section checks
  await expect(page.getByText('Terapias Permitidas no Pacote')).toBeVisible()
  
  const allTherapiesCheckbox = page.locator('input[type="checkbox"]').nth(1) // "Todas as terapias"
  await expect(allTherapiesCheckbox).toBeChecked()

  // Save Package
  await page.getByRole('button', { name: /Criar Pacote/i }).last().click()

  // Wait for package list to refresh and verify it's there
  const therapistCard = page.locator('li').filter({ hasText: packageName })
  await expect(therapistCard).toBeVisible({ timeout: 15_000 })
  await expect(therapistCard.getByText('Terapias: Todas')).toBeVisible()

  await logout(page)

  // 2. Log in as patient and book a session
  await loginAsPatient(page)
  await page.goto(ROUTES.patientSearch + '?mockPayment=true')

  await page.getByPlaceholder('Busque pelo nome do profissional...').fill('Lara Almeida')
  await expect(page.getByText('Lara Almeida').first()).toBeVisible({ timeout: 15_000 })

  await page.getByRole('button', { name: 'Agendar' }).first().click()

  // Modal checks
  const modal = page.locator('.fixed.inset-0.z-50')
  await expect(modal).toBeVisible()

  // Choose the promo package option
  await modal.getByText(packageName).click()

  // Select Date
  const segButton = modal.locator('div.grid.grid-cols-7 button:not([disabled])').first()
  await segButton.click()
  await modal.getByRole('button', { name: 'Continuar' }).click()

  // Select Time
  const timeButton = modal.locator('div.grid.grid-cols-4 button').first()
  await timeButton.click()
  await modal.getByRole('button', { name: 'Finalizar Reserva' }).click()

  // Pay and Confirm (Mock mode is active on local since no STRIPE key is set)
  await modal.getByRole('button', { name: /Simular Pagamento e Agendar/i }).click()

  // Verify completion
  await expect(modal.getByText(/Solicitação enviada/i)).toBeVisible({ timeout: 20_000 })
  await modal.getByRole('button', { name: 'Fechar' }).click()

  // Navigate to Dashboard and verify the active package is listed and details are correct
  await page.goto('/dashboard/paciente')
  await expect(page.getByText('Meus Pacotes Ativos')).toBeVisible()
  await expect(page.getByText(packageName)).toBeVisible()
  await expect(page.getByText('Pacote válido para: Todas as terapias')).toBeVisible()

  // Cleanup: log back in as therapist and delete the package
  await logout(page)
  await loginAsTherapist(page)
  await page.goto(ROUTES.therapistTerapias)
  await page.getByRole('button', { name: /Pacotes Promocionais/i }).click()
  
  // Find E2E Test Package card, click Delete (Trash2 icon)
  const card = page.locator('li').filter({ hasText: packageName })
  await card.locator('button').last().click() // trash button is the last button on card
  
  // Handle confirm dialog
  page.once('dialog', dialog => dialog.accept())
  
  await expect(page.getByText(packageName)).not.toBeVisible({ timeout: 15_000 })

  monitor.assertNoFetchFailed()
})

