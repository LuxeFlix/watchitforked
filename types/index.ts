export type Movie = {
  id: number
  title: string
  type: 'movie' | 'series'
  genre: string[]
  year: number
  language: string
  quality: string
  description: string
  poster_url: string
  sample_images: string[]
  download_480p: string | null
  download_720p: string | null
  download_1080p: string | null
  download_2k: string | null
  status: string
  tags: string[]
  views: number
  rating?: number
  votes?: number
  created_at: string
}
