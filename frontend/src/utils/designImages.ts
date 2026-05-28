// 디자인 모델 A/B/C/D의 큐레이션 fallback 이미지 매핑.
// 백엔드 thumbnailImage 가 비어있거나 깨진 placeholder 일 때 사용.

export type DesignLike = {
  modelCode?: string
  thumbnailImage?: string
}

export const designImages: Record<string, string> = {
  A: '/images/designs/a.jpg',
  B: '/images/designs/b.jpg',
  C: '/images/designs/c.jpg',
  D: '/images/designs/d.jpg',
}

export function resolveDesignImage(d?: DesignLike, fallbackCode?: string): string | undefined {
  const code = d?.modelCode ?? fallbackCode
  if (code && designImages[code]) return designImages[code]
  if (d?.thumbnailImage) return d.thumbnailImage
  return undefined
}
