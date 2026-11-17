import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'My App',
    short_name: 'MyApp',
    start_url: '/?source=pwa',
    display: 'standalone',
  }
}