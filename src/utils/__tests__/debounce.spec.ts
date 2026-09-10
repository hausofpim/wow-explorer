import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { debounce } from '@/utils/debounce'

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('calls the function only once after the wait period', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced()
    debounced()
    debounced()

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('cancel prevents a pending call', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 300)

    debounced()
    debounced.cancel()
    vi.advanceTimersByTime(300)

    expect(fn).not.toHaveBeenCalled()
  })
})
