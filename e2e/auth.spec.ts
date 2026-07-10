import { expect, test } from '@playwright/test'

test('sign up creates an account and lands on the dashboard', async ({ page }) => {
  const email = `e2e_${Date.now()}@example.com`

  await page.goto('/signup')
  await page.getByLabel('Name').fill('E2E User')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password').fill('supersecret123')
  await page.getByRole('button', { name: 'Create account' }).click()

  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 })
  await expect(page.getByText("E2E User's team")).toBeVisible()

  // The new account owns its organization.
  await expect(page.getByText('OWNER')).toBeVisible()
})
