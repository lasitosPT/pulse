import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Button } from './button'

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies variant and size classes', () => {
    render(
      <Button variant="outline" size="lg">
        Outline
      </Button>,
    )
    const button = screen.getByRole('button', { name: 'Outline' })
    expect(button.className).toContain('border')
    expect(button.className).toContain('h-11')
  })

  it('forwards native button attributes', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button', { name: 'Disabled' })).toBeDisabled()
  })
})
