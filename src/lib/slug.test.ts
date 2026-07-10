import { describe, expect, it } from 'vitest'
import { slugify } from './slug'

describe('slugify', () => {
  it('lowercases and hyphenates', () => {
    expect(slugify('Acme Corp')).toBe('acme-corp')
  })

  it('strips punctuation and collapses separators', () => {
    expect(slugify('  Hello,   World!!  ')).toBe('hello-world')
  })

  it('trims leading and trailing hyphens', () => {
    expect(slugify('---Edge---')).toBe('edge')
  })

  it('falls back to "team" when empty', () => {
    expect(slugify('!!!')).toBe('team')
  })

  it('caps length at 40 characters', () => {
    expect(slugify('a'.repeat(100)).length).toBeLessThanOrEqual(40)
  })
})
