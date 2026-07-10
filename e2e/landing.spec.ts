import { expect, test } from '@playwright/test'

test.describe('Landing page', () => {
  test('shows the hero and primary call to action', async ({ page }) => {
    await page.goto('/')
    await expect(
      page.getByRole('heading', { name: /Know the moment your site goes down/i }),
    ).toBeVisible()
    await expect(page.getByRole('link', { name: /Start monitoring free/i })).toBeVisible()
  })

  test('navigates to the login page from the header', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Sign in' }).first().click()
    await expect(page).toHaveURL(/\/login$/)
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible()
  })
})
