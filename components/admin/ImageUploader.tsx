'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Loader2, Plus, Trash2, Upload } from 'lucide-react'

type ImageValue = string | string[]

type ImageUploaderProps = {
  value: ImageValue
  onChange: (value: ImageValue) => void
  multiple?: boolean
  maxFiles?: number
}

type CloudinaryUploadResponse = {
  secure_url?: string
}

function getInitialItems(value: ImageValue, multiple?: boolean) {
  if (multiple) {
    return Array.isArray(value) ? value : value ? [value] : []
  }

  return typeof value === 'string' ? (value ? [value] : []) : value[0] ? [value[0]] : []
}

function getCloudinaryConfig() {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  return { cloud, uploadPreset }
}

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  maxFiles = 1,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [items, setItems] = useState<string[]>(() => getInitialItems(value, multiple))
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const { cloud, uploadPreset } = useMemo(getCloudinaryConfig, [])

  useEffect(() => {
    setItems(getInitialItems(value, multiple))
  }, [value, multiple])

  function emit(nextItems: string[]) {
    const normalized = multiple ? nextItems.slice(0, maxFiles) : nextItems.slice(0, 1)
    setItems(normalized)
    onChange(multiple ? normalized : normalized[0] || '')
  }

  async function uploadFile(file: File) {
    if (!cloud || !uploadPreset) {
      throw new Error('Missing Cloudinary configuration.')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', 'movies')

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    const payload = (await response.json()) as CloudinaryUploadResponse & { error?: { message?: string } }

    if (!response.ok) {
      throw new Error(payload?.error?.message || 'Upload failed.')
    }

    if (!payload.secure_url) {
      throw new Error('Cloudinary did not return a secure URL.')
    }

    return payload.secure_url
  }

  async function handleFiles(selectedFiles: FileList | null) {
    if (!selectedFiles || selectedFiles.length === 0) return

    setError('')

    const availableSlots = multiple ? maxFiles - items.length : 1
    const files = Array.from(selectedFiles).slice(0, Math.max(availableSlots, 0))

    if (files.length === 0) {
      setError(`You can upload up to ${multiple ? maxFiles : 1} image${(multiple ? maxFiles : 1) === 1 ? '' : 's'}.`)
      return
    }

    setUploading(true)

    try {
      const uploadedUrls: string[] = []

      for (const file of files) {
        const url = await uploadFile(file)
        uploadedUrls.push(url)
      }

      emit(multiple ? [...items, ...uploadedUrls] : uploadedUrls)
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Upload failed.')
    } finally {
      setUploading(false)
      if (inputRef.current) {
        inputRef.current.value = ''
      }
    }
  }

  function handleRemove(index: number) {
    const nextItems = items.filter((_, itemIndex) => itemIndex !== index)
    emit(nextItems)
  }

  const remaining = multiple ? Math.max(maxFiles - items.length, 0) : 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-[#0a0a0a] p-4">
        <div>
          <p className="text-sm font-medium text-text-primary">
            {multiple ? 'Multiple images' : 'Single image'}
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            {cloud && uploadPreset
              ? 'Images upload directly to Cloudinary.'
              : 'Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || remaining === 0}
          className="admin-btn-primary px-4 py-2.5"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          {uploading ? 'Uploading...' : 'Upload image'}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(event) => void handleFiles(event.target.files)}
        className="hidden"
      />

      {error ? (
        <p className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      ) : null}

      {items.length > 0 ? (
        <div className={multiple ? 'grid gap-3 sm:grid-cols-2 xl:grid-cols-3' : 'space-y-3'}>
          {items.map((imageUrl, index) => (
            <div
              key={`${imageUrl}-${index}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-[#0a0a0a]"
            >
              <div className={`relative w-full ${multiple ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}>
                <Image
                  src={imageUrl}
                  alt={`Uploaded image ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 300px"
                  className="object-cover"
                />
              </div>

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                <span className="truncate text-xs text-white/90">{imageUrl}</span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white transition-colors hover:bg-red-500"
                >
                  <Trash2 size={12} />
                  Remove
                </button>
              </div>
            </div>
          ))}

          {multiple && items.length < maxFiles ? (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="flex min-h-[180px] items-center justify-center rounded-2xl border border-dashed border-border bg-[#0a0a0a] text-text-secondary transition-colors hover:border-primary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <div className="text-center">
                <Plus size={18} className="mx-auto mb-2" />
                <p className="text-sm font-medium">Add more</p>
                <p className="mt-1 text-xs">{remaining} slot{remaining === 1 ? '' : 's'} left</p>
              </div>
            </button>
          ) : null}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-[#0a0a0a] px-4 py-10 text-sm text-text-secondary transition-colors hover:border-primary hover:text-text-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          <span>{multiple ? 'Upload sample images' : 'Upload poster image'}</span>
        </button>
      )}
    </div>
  )
}