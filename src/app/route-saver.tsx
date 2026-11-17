'use client'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export function RouteSaver() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const qs = searchParams.toString()
    if (searchParams.get('source') === 'pwa') return
    const path = pathname + (qs ? `?${qs}` : '')
    document.cookie = `last-path=${encodeURIComponent(path)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`
  }, [pathname, searchParams])

  return null
}