import { describe, it, expect, beforeEach } from 'vitest'

describe('themeStore', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('exports useThemeStore hook', async () => {
    const { useThemeStore } = await import('../themeStore')
    expect(useThemeStore).toBeDefined()
  })

  it('defaults to system preference when no localStorage value', async () => {
    const { useThemeStore } = await import('../themeStore')
    const store = useThemeStore.getState()
    expect(['light', 'dark']).toContain(store.theme)
  })

  it('toggleTheme switches between light and dark', async () => {
    const { useThemeStore } = await import('../themeStore')
    const initial = useThemeStore.getState().theme
    useThemeStore.getState().toggleTheme()
    const next = useThemeStore.getState().theme
    expect(next).not.toBe(initial)
  })

  it('setTheme persists to localStorage', async () => {
    const { useThemeStore } = await import('../themeStore')
    useThemeStore.getState().setTheme('dark')
    expect(localStorage.getItem('vocra-theme')).toBe('dark')
  })

  it('applies dark class to documentElement', async () => {
    const { useThemeStore } = await import('../themeStore')
    useThemeStore.getState().setTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes dark class when set to light', async () => {
    const { useThemeStore } = await import('../themeStore')
    useThemeStore.getState().setTheme('dark')
    useThemeStore.getState().setTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
