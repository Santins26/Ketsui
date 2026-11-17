import { NextResponse, type NextRequest } from 'next/server'

export function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl

  if (pathname === '/' && searchParams.get('source') === 'pwa') {
    const last = req.cookies.get('last-path')?.value
    if (last) {
      const target = decodeURIComponent(last)
      if (target.startsWith('/') && !target.startsWith('//') && target !== '/') {
        return NextResponse.redirect(new URL(target, req.url))
      }
    }
  }
  return NextResponse.next()
}

export const config = { matcher: '/' }