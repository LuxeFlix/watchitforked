'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, Loader2, Plus, Trash2, X } from 'lucide-react'
import ConfirmModal from './ConfirmModal'
import ImageUploader from './ImageUploader'
import { Movie } from '@/types'

const GENRES = ['Action', 'Comedy', 'Drama', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Animation']
const LANGUAGES = ['Hindi', 'English', 'Tamil', 'Thai', 'Korean', 'Chinese', 'Japanese', 'French', 'German', 'Spanish', 'Other']
const QUALITIES = ['2K', '1080p', '720p', '520p', '480p', 'CAM']

type Status = 'draft' | 'published'

type Errors = Partial<Record<
  'title' | 'type' | 'status' | 'year' | 'language' | 'quality' | 'genre' | 'description' | 'posterUrl' | 'tags' | 'sampleImages' | 'downloadLinks',
  string
>>

type MovieFormProps = {
  initialData?: Movie
}

type DraftState = {
  title: string
  type: 'movie' | 'series'
  status: Status
  year: string
  language: string
  quality: string
  genre: string[]
  description: string
  tags: string[]
  downloadLinks: DownloadLink[]
  posterUrl: string
  sampleImages: string[]
  tagInput: string
}

type DownloadLinkQuality = '480p' | '720p' | '1080p' | '2k'

type DownloadLink = {
  quality: DownloadLinkQuality
  url: string
  episode?: string
}

type StoredDraft = DraftState & {
  savedAt: string
}

function getEmptyDraft(): DraftState {
  return {
    title: '',
    type: 'movie',
    status: 'draft',
    year: '',
    language: '',
    quality: '',
    genre: [],
    description: '',
    tags: [],
    downloadLinks: [{ quality: '480p', url: '' }],
    posterUrl: '',
    sampleImages: [],
    tagInput: '',
  }
}

function getInitialDraft(initialData?: Movie): DraftState {
  if (!initialData) return getEmptyDraft()

  const parseLinks = (quality: DownloadLinkQuality, value: string | null): DownloadLink[] => {
    if (!value) return []
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => ({
          quality,
          url: item.url || '',
          episode: String(item.episode || '')
        }))
      }
    } catch {
      // Not JSON
    }
    return [{ quality, url: value, episode: '' }]
  }

  const allLinks = [
    ...parseLinks('480p', initialData.download_480p),
    ...parseLinks('720p', initialData.download_720p),
    ...parseLinks('1080p', initialData.download_1080p),
    ...parseLinks('2k', initialData.download_2k),
  ]

  return {
    title: initialData.title ?? '',
    type: initialData.type ?? 'movie',
    status: initialData.status === 'published' ? 'published' : 'draft',
    year: initialData.year ? String(initialData.year) : '',
    language: initialData.language ?? '',
    quality: initialData.quality ?? '',
    genre: initialData.genre ?? [],
    description: initialData.description ?? '',
    tags: initialData.tags ?? [],
    downloadLinks: allLinks.length > 0 ? allLinks : [getEmptyDownloadLink()],
    posterUrl: initialData.poster_url ?? '',
    sampleImages: initialData.sample_images ?? [],
    tagInput: '',
  }
}

function hasMeaningfulContent(values: DraftState) {
  return Boolean(
    values.title.trim() ||
      values.year.trim() ||
      values.language.trim() ||
      values.quality.trim() ||
      values.genre.length > 0 ||
      values.description.trim() ||
      values.tags.length > 0 ||
      values.downloadLinks.some((link) => link.url.trim()) ||
      values.posterUrl.trim() ||
      values.sampleImages.length > 0
  )
}

function parseList(value: string) {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function urlLooksValid(value: string) {
  try {
    const parsed = new URL(value)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return <p className="mt-1 text-xs text-red-400">{message}</p>
}

function formatSavedAt(value?: string) {
  if (!value) return ''

  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function MovieForm({ initialData }: MovieFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(getInitialDraft(initialData).title)
  const [type, setType] = useState<'movie' | 'series'>(getInitialDraft(initialData).type)
  const [status, setStatus] = useState<Status>(getInitialDraft(initialData).status)
  const [year, setYear] = useState(getInitialDraft(initialData).year)
  const [language, setLanguage] = useState(getInitialDraft(initialData).language)
  const [quality, setQuality] = useState(getInitialDraft(initialData).quality)
  const [genre, setGenre] = useState<string[]>(getInitialDraft(initialData).genre)
  const [description, setDescription] = useState(getInitialDraft(initialData).description)
  const [tagInput, setTagInput] = useState(getInitialDraft(initialData).tagInput)
  const [tags, setTags] = useState<string[]>(getInitialDraft(initialData).tags)
  const [downloadLinks, setDownloadLinks] = useState<DownloadLink[]>(getInitialDraft(initialData).downloadLinks)
  const [posterUrl, setPosterUrl] = useState(getInitialDraft(initialData).posterUrl)
  const [sampleImages, setSampleImages] = useState<string[]>(getInitialDraft(initialData).sampleImages)
  const [errors, setErrors] = useState<Errors>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState<Status | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [draftBanner, setDraftBanner] = useState<StoredDraft | null>(null)
  const [qualityMenuOpen, setQualityMenuOpen] = useState(false)

  const isEditMode = Boolean(initialData)
  const movieId = initialData?.id
  const draftKey = initialData ? `watchit:movie-form:draft:${initialData.id}` : 'watchit:movie-form:draft:new'

  function buildDraft(): DraftState {
    return {
      title,
      type,
      status,
      year,
      language,
      quality,
      genre,
      description,
      tags,
      downloadLinks,
      posterUrl,
      sampleImages,
      tagInput,
    }
  }

  function applyDraft(draft: DraftState) {
    setTitle(draft.title)
    setType(draft.type)
    setStatus(draft.status)
    setYear(draft.year)
    setLanguage(draft.language)
    setQuality(draft.quality)
    setGenre(draft.genre)
    setDescription(draft.description)
    setTags(draft.tags)
    setDownloadLinks(draft.downloadLinks)
    setPosterUrl(draft.posterUrl)
    setSampleImages(draft.sampleImages)
    setTagInput(draft.tagInput)
  }

  useEffect(() => {
    try {
      const rawDraft = window.localStorage.getItem(draftKey)

      if (!rawDraft) return

      const parsed = JSON.parse(rawDraft) as StoredDraft

      if (parsed && hasMeaningfulContent(parsed)) {
        setDraftBanner(parsed)
      }
    } catch {
      // Ignore malformed local drafts.
    }
  }, [draftKey])

  useEffect(() => {
    const currentDraft = buildDraft()

    if (!hasMeaningfulContent(currentDraft)) {
      try {
        window.localStorage.removeItem(draftKey)
      } catch {
        // Ignore storage failures.
      }
      return
    }

    const saveDraft = () => {
      try {
        const payload: StoredDraft = {
          ...currentDraft,
          savedAt: new Date().toISOString(),
        }

        window.localStorage.setItem(draftKey, JSON.stringify(payload))
      } catch {
        // Ignore storage failures.
      }
    }

    const interval = window.setInterval(saveDraft, 30000)
    return () => window.clearInterval(interval)
  }, [
    draftKey,
    title,
    type,
    status,
    year,
    language,
    quality,
    genre,
    description,
    tags,
    downloadLinks,
    posterUrl,
    sampleImages,
    tagInput,
  ])

  function updateDownloadLink(index: number, patch: Partial<DownloadLink>) {
    setDownloadLinks((current) =>
      current.map((link, currentIndex) =>
        currentIndex === index ? { ...link, ...patch } : link
      )
    )
  }

  function addDownloadLink(quality: DownloadLinkQuality) {
    setDownloadLinks((current) => [...current, { quality, url: '', episode: '' }])
    setQualityMenuOpen(false)
  }

  function removeDownloadLink(index: number) {
    setDownloadLinks((current) => {
      const next = current.filter((_, currentIndex) => currentIndex !== index)
      return next.length > 0 ? next : [getEmptyDownloadLink()]
    })
  }

  function toggleGenre(value: string) {
    setGenre((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    )
  }

  function addTagsFromInput(value: string) {
    const nextTags = parseList(value)

    if (nextTags.length === 0) return

    setTags((current) => {
      const merged = new Set(current)
      nextTags.forEach((tag) => merged.add(tag))
      return Array.from(merged)
    })
    setTagInput('')
  }

  function validate() {
    const nextErrors: Errors = {}

    if (!title.trim()) nextErrors.title = 'Title is required.'
    if (!type) nextErrors.type = 'Type is required.'
    if (!status) nextErrors.status = 'Status is required.'

    if (year.trim() && !/^\d{4}$/.test(year.trim())) {
      nextErrors.year = 'Enter a valid 4-digit year.'
    }

    if (!quality.trim()) nextErrors.quality = 'Quality is required.'

    if (downloadLinks.length === 0) {
      nextErrors.downloadLinks = 'Add at least one download link.'
    } else if (downloadLinks.some((link) => !link.url.trim())) {
      nextErrors.downloadLinks = 'Fill every added download link or remove it.'
    } else if (downloadLinks.some((link) => !urlLooksValid(link.url.trim()))) {
      nextErrors.downloadLinks = 'Enter valid URLs for all download links.'
    }

    if (!posterUrl.trim()) {
      nextErrors.posterUrl = 'Poster image is required.'
    } else if (!urlLooksValid(posterUrl.trim())) {
      nextErrors.posterUrl = 'Enter a valid poster URL.'
    }

    if (tags.some((tag) => !tag.trim())) nextErrors.tags = 'Remove empty tags.'

    setErrors(nextErrors)
    return nextErrors
  }

  function mapDownloadLinks() {
    const groups = downloadLinks.reduce<Record<string, DownloadLink[]>>((acc, link) => {
      const url = link.url.trim()
      if (!url) return acc
      if (!acc[link.quality]) acc[link.quality] = []
      acc[link.quality].push(link)
      return acc
    }, {})

    const process = (quality: string) => {
      const links = groups[quality] || []
      if (links.length === 0) return null
      
      // If it's a movie and only one link, store as string for backward compatibility
      if (type === 'movie' && links.length === 1) return links[0].url.trim()
      
      // Otherwise store as JSON array
      return JSON.stringify(links.map(l => ({
        episode: l.episode || '',
        url: l.url.trim()
      })))
    }

    return {
      download_480p: process('480p'),
      download_720p: process('720p'),
      download_1080p: process('1080p'),
      download_2k: process('2k'),
    }
  }

  async function submit(nextStatus: Status) {
    const nextErrors = validate()
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(nextStatus)
    setSubmitError('')

    try {
      const response = await fetch(
        isEditMode && movieId ? `/api/admin/movies/${movieId}` : '/api/admin/movies',
        {
          method: isEditMode ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            type,
            status: nextStatus,
            year: year.trim() ? Number(year.trim()) : 0,
            language: language.trim(),
            quality,
            genre,
            description: description.trim(),
            tags,
            ...mapDownloadLinks(),
            poster_url: posterUrl.trim(),
            sample_images: sampleImages,
          }),
        }
      )

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.error || 'Failed to save movie')
      }

      try {
        window.localStorage.removeItem(draftKey)
      } catch {
        // Ignore storage failures.
      }

      router.push('/admin/dashboard')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to save movie.')
    } finally {
      setSubmitting(null)
    }
  }

  async function handleDelete() {
    if (!isEditMode || !movieId) return

    setDeleting(true)

    try {
      const response = await fetch(`/api/admin/movies/${movieId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete movie')
      }

      try {
        window.localStorage.removeItem(draftKey)
      } catch {
        // Ignore storage failures.
      }

      router.push('/admin/dashboard')
    } finally {
      setDeleting(false)
      setDeleteOpen(false)
    }
  }

  function restoreDraft() {
    if (!draftBanner) return

    applyDraft(draftBanner)
    setDraftBanner(null)
  }

  function discardDraft() {
    try {
      window.localStorage.removeItem(draftKey)
    } catch {
      // Ignore storage failures.
    }

    setDraftBanner(null)
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void submit(status)
  }

  return (
    <form onSubmit={handleFormSubmit} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5 md:space-y-6">
        {draftBanner ? (
          <div className="admin-panel border-amber-500/20 bg-amber-500/10 p-4 text-amber-100">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold">Draft restored is available</p>
                <p className="mt-1 text-xs text-amber-100/80">
                  Saved {formatSavedAt(draftBanner.savedAt) || 'recently'} in your browser.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={restoreDraft}
                  className="rounded-xl bg-amber-100 px-4 py-2 text-sm font-medium text-amber-950 transition-colors hover:bg-white"
                >
                  Restore draft
                </button>
                <button
                  type="button"
                  onClick={discardDraft}
                  className="rounded-xl border border-amber-100/20 px-4 py-2 text-sm text-amber-100 transition-colors hover:bg-amber-100/10"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <section className="admin-panel p-4 sm:p-5">
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <div className="md:col-span-2">
              <label className="admin-field-label">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={validate}
                placeholder="Enter movie or series title"
                className="admin-input mt-2"
              />
              <FieldError message={errors.title} />
            </div>

            <div>
              <label className="admin-field-label">
                Type
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl border border-border bg-[#0a0a0a] p-1">
                {[
                  { label: 'Movie', value: 'movie' },
                  { label: 'Series', value: 'series' },
                ].map((item) => {
                  const active = type === item.value

                  return (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => setType(item.value as 'movie' | 'series')}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        active
                          ? 'bg-primary text-black'
                          : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>
              <FieldError message={errors.type} />
            </div>

            <div>
              <label className="admin-field-label">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as Status)}
                className="admin-select mt-2"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
              <FieldError message={errors.status} />
            </div>

            <div>
              <label className="admin-field-label">
                Year (optional)
              </label>
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                onBlur={validate}
                inputMode="numeric"
                placeholder="2026"
                className="admin-input mt-2"
              />
              <FieldError message={errors.year} />
            </div>

            <div>
              <label className="admin-field-label">
                Language (optional)
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                onBlur={validate}
                className="admin-select mt-2"
              >
                <option value="">Select language</option>
                {LANGUAGES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <FieldError message={errors.language} />
            </div>

            <div>
              <label className="admin-field-label">
                Quality
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                onBlur={validate}
                className="admin-select mt-2"
              >
                <option value="">Select quality</option>
                {QUALITIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <FieldError message={errors.quality} />
            </div>
          </div>
        </section>

        <section className="admin-panel p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <h2 className="text-sm font-semibold text-text-primary">Genre</h2>
              <p className="mt-1 text-xs text-text-secondary">Select one or more genres (optional).</p>
            </div>
            <span className="text-xs text-text-secondary">{genre.length} selected</span>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {GENRES.map((item) => {
              const active = genre.includes(item)

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleGenre(item)}
                  className={`admin-pill inline-flex items-center gap-2 px-3 py-2 transition-colors ${
                    active
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'admin-pill-neutral hover:border-primary/50 hover:text-text-primary'
                  }`}
                >
                  <span
                    className={`grid h-4 w-4 place-items-center rounded border text-[10px] ${
                      active
                        ? 'border-primary bg-primary text-black'
                        : 'border-text-secondary/40 bg-transparent text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  {item}
                </button>
              )
            })}
          </div>
          <FieldError message={errors.genre} />
        </section>

        <section className="admin-panel p-4 sm:p-5">
          <label className="admin-field-label">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={validate}
            rows={6}
            placeholder="Write a short description..."
            className="admin-textarea mt-2"
          />
          <FieldError message={errors.description} />
        </section>

        <section className="admin-panel p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <label className="admin-field-label">
                Tags
              </label>
              <p className="mt-1 text-xs text-text-secondary">Select whether the series/movie is currently ongoing or completed.</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <label 
              className={`flex items-center justify-center px-5 py-2.5 rounded-xl border cursor-pointer transition-all ${
                tags.includes('ongoing') 
                  ? 'bg-portal-accent/10 border-portal-accent text-portal-accent shadow-[0_0_15px_rgba(var(--portal-accent),0.1)]' 
                  : 'bg-[#0a0a0a] border-border text-text-secondary hover:border-text-secondary/50 hover:text-text-primary'
              }`}
            >
              <input 
                type="radio" 
                name="status_tag" 
                value="ongoing"
                checked={tags.includes('ongoing')}
                onChange={() => setTags(['ongoing'])}
                className="hidden"
              />
              <span className="text-sm font-bold tracking-wide uppercase">Ongoing</span>
            </label>
            
            <label 
              className={`flex items-center justify-center px-5 py-2.5 rounded-xl border cursor-pointer transition-all ${
                tags.includes('completed') 
                  ? 'bg-portal-accent/10 border-portal-accent text-portal-accent shadow-[0_0_15px_rgba(var(--portal-accent),0.1)]' 
                  : 'bg-[#0a0a0a] border-border text-text-secondary hover:border-text-secondary/50 hover:text-text-primary'
              }`}
            >
              <input 
                type="radio" 
                name="status_tag" 
                value="completed"
                checked={tags.includes('completed')}
                onChange={() => setTags(['completed'])}
                className="hidden"
              />
              <span className="text-sm font-bold tracking-wide uppercase">Completed</span>
            </label>

            <label 
              className={`flex items-center justify-center px-5 py-2.5 rounded-xl border cursor-pointer transition-all ${
                tags.length === 0 || (!tags.includes('ongoing') && !tags.includes('completed'))
                  ? 'bg-white/5 border-white/20 text-white shadow-sm' 
                  : 'bg-[#0a0a0a] border-border text-text-secondary hover:border-text-secondary/50 hover:text-text-primary'
              }`}
            >
              <input 
                type="radio" 
                name="status_tag" 
                value="none"
                checked={tags.length === 0 || (!tags.includes('ongoing') && !tags.includes('completed'))}
                onChange={() => setTags([])}
                className="hidden"
              />
              <span className="text-sm font-bold tracking-wide uppercase">None</span>
            </label>
          </div>
          <FieldError message={errors.tags} />
        </section>

        <section className="admin-panel p-4 sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <label className="admin-field-label">Download links</label>
              <p className="mt-1 text-xs text-text-secondary">
                Add, edit, or remove quality-specific links for the movie.
              </p>
            </div>
            <div className="relative w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setQualityMenuOpen((current) => !current)}
                className="admin-btn-secondary w-full sm:w-auto"
              >
                <Plus size={16} />
                Add link
                <ChevronDown size={14} className="opacity-70" />
              </button>

              {qualityMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-full min-w-[180px] overflow-hidden rounded-2xl border border-border bg-[#111] shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
                  {(['480p', '720p', '1080p', '2k'] as DownloadLinkQuality[]).map((quality) => (
                    <button
                      key={quality}
                      type="button"
                      onClick={() => addDownloadLink(quality)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm text-text-secondary transition-colors hover:bg-[#1a1a1a] hover:text-text-primary"
                    >
                      <span>Add {quality}</span>
                      <span className="admin-pill admin-pill-neutral py-1">{quality}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {downloadLinks.map((link, index) => (
              <div key={`${link.quality}-${index}`} className="rounded-2xl border border-border bg-[#0a0a0a] p-3 sm:p-4">
                <div className={`grid gap-3 md:items-end ${type === 'series' ? 'grid-cols-2 md:grid-cols-[80px_140px_minmax(0,1fr)_auto]' : 'md:grid-cols-[160px_minmax(0,1fr)_auto]'}`}>
                  {type === 'series' && (
                    <div className="col-span-1">
                      <label className="admin-field-label">Ep No</label>
                      <input
                        value={link.episode || ''}
                        onChange={(e) => updateDownloadLink(index, { episode: e.target.value })}
                        placeholder="01"
                        className="admin-input mt-2"
                      />
                    </div>
                  )}

                  <div className="col-span-1">
                    <label className="admin-field-label">Quality</label>
                    <select
                      value={link.quality}
                      onChange={(e) => updateDownloadLink(index, { quality: e.target.value as DownloadLinkQuality })}
                      className="admin-select mt-2"
                    >
                      <option value="480p">480p</option>
                      <option value="720p">720p</option>
                      <option value="1080p">1080p</option>
                      <option value="2k">2K</option>
                    </select>
                  </div>

                  <div className={type === 'series' ? 'col-span-2 md:col-span-1' : ''}>
                    <label className="admin-field-label">Link</label>
                    <input
                      value={link.url}
                      onChange={(e) => updateDownloadLink(index, { url: e.target.value })}
                      onBlur={validate}
                      placeholder="https://example.com/file"
                      className="admin-input mt-2"
                    />
                  </div>

                  <div className={type === 'series' ? 'col-span-2 md:col-span-1 flex justify-end' : ''}>
                    <button
                      type="button"
                      onClick={() => removeDownloadLink(index)}
                      className="admin-icon-btn h-11 w-11 self-end"
                      aria-label={`Remove ${link.quality} link`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <FieldError message={errors.downloadLinks} />
        </section>

        <section className="grid gap-5 xl:grid-cols-2">
          <div className="admin-panel p-4 sm:p-5">
            <div className="mb-4">
              <label className="admin-field-label">
                Poster upload
              </label>
              <p className="mt-1 text-xs text-text-secondary">Single image mode with live preview.</p>
            </div>
            <ImageUploader
              value={posterUrl}
              onChange={(value) => setPosterUrl(typeof value === 'string' ? value : value[0] || '')}
              multiple={false}
              maxFiles={1}
            />
            <FieldError message={errors.posterUrl} />
          </div>

          <div className="admin-panel p-4 sm:p-5">
            <div className="mb-4">
              <label className="admin-field-label">
                Sample images
              </label>
              <p className="mt-1 text-xs text-text-secondary">Multiple image mode with remove actions.</p>
            </div>
            <ImageUploader
              value={sampleImages}
              onChange={(value) => setSampleImages(Array.isArray(value) ? value : value ? [value] : [])}
              multiple
              maxFiles={6}
            />
          </div>
        </section>
      </div>

      <aside className="space-y-5 lg:sticky lg:top-6 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:self-start">
        <div className="admin-panel p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-text-primary">Save actions</h2>
          <p className="mt-2 text-sm leading-6 text-text-secondary">
            Use draft for incomplete entries, or publish when the required fields are ready.
          </p>

          {submitError ? (
            <p className="mt-4 rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-400">
              {submitError}
            </p>
          ) : null}

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <button
              type="button"
              onClick={() => void submit('draft')}
              disabled={submitting !== null}
              className="admin-btn-secondary"
            >
              {submitting === 'draft' ? <Loader2 size={16} className="animate-spin" /> : null}
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => void submit('published')}
              disabled={submitting !== null}
              className="admin-btn-primary"
            >
              {submitting === 'published' ? <Loader2 size={16} className="animate-spin" /> : null}
              Publish
            </button>
          </div>

          {isEditMode ? (
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              disabled={deleting}
              className="admin-btn-danger mt-3 w-full"
            >
              <Trash2 size={16} />
              Delete movie
            </button>
          ) : null}
        </div>

        <div className="admin-panel p-4 sm:p-5">
          <h2 className="text-sm font-semibold text-text-primary">Selected genres</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {genre.length > 0 ? (
              genre.map((item) => (
                <span key={item} className="admin-pill border-primary/20 bg-primary/10 text-primary">
                  {item}
                </span>
              ))
            ) : (
              <span className="text-xs text-text-secondary">No genres selected yet.</span>
            )}
          </div>
        </div>
      </aside>

      <ConfirmModal
        open={deleteOpen}
        title="Delete movie?"
        description="This action permanently removes the movie and cannot be undone."
        confirmText={deleting ? 'Deleting...' : 'Delete'}
        confirmDisabled={deleting}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </form>
  )
}

function getEmptyDownloadLink(): DownloadLink {
  return { quality: '720p' as DownloadLinkQuality, url: '', episode: '' }
}