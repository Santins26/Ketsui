'use client'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

const KEY = 'last-path'

export function RouteSaver() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const restored = useRef(false)


  useEffect(() => {
    if (restored.current) return
    restored.current = true

    const standalone =
      (window.navigator as any).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches
    const launched = !sessionStorage.getItem('launched')
    sessionStorage.setItem('launched', '1')

    if (!standalone || !launched || pathname !== '/') return

    const last = localStorage.getItem(KEY)
    if (last && last !== '/' && last.startsWith('/') && !last.startsWith('//')) {
      router.replace(last)
    }
  }, [pathname, router])

  useEffect(() => {
    const qs = searchParams.toString()
    localStorage.setItem(KEY, pathname + (qs ? `?${qs}` : ''))
  }, [pathname, searchParams])

  return null
}