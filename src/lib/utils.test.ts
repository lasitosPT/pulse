import { describe, expect, it } from 'vitest'
import { cn } from './utils'

describe('cn', () => {
  it('joins multiple class names', () => {
    expect(cn('px-2', 'py-1')).toBe('px-2 py-1')
  })

  it('lets the last conflicting Tailwind utility win', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('ignores falsy conditional classes', () => {
    expect(cn('base', false && 'hidden', undefined, 'active')).toBe('base active')
  })

  it('flattens arrays and object maps', () => {
    expect(cn(['a', 'b'], { c: true, d: false })).toBe('a b c')
  })
})
