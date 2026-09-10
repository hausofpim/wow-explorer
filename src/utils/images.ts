export function getImageUrl(path: string, mediaPath: string): string {
  const cleanBaseUrl = mediaPath.endsWith('/') ? mediaPath.slice(0, -1) : mediaPath
  const cleanPath = path.startsWith('/') ? path : `/${path}`

  return `${cleanBaseUrl}${cleanPath}`
}
