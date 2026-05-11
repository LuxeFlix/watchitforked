'use client'

import { useMemo, useState } from 'react'
import { Download, Search, Settings2 } from 'lucide-react'

type DownloadItem = {
  quality: string
  name: string
  size: string
  tag: string
  url: string
}

type DownloadSectionProps = {
  downloads: DownloadItem[]
}

export default function DownloadSection({ downloads }: DownloadSectionProps) {
  const [activeQuality, setActiveQuality] = useState('unsorted')
  const [searchTerm, setSearchTerm] = useState('')

  const qualityCounts = useMemo(() => {
    return downloads.reduce((acc, download) => {
      acc[download.quality] = (acc[download.quality] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }, [downloads])

  const qualities = useMemo(() => {
    return ['unsorted', '480p', '720p', '1080p', '4K'].filter(
      (quality) => quality === 'unsorted' || (qualityCounts[quality] && qualityCounts[quality] > 0)
    )
  }, [qualityCounts])

  const visibleDownloads = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return downloads.filter((download) => {
      const qualityMatches = activeQuality === 'unsorted' || download.quality === activeQuality
      const searchMatches = !query || download.name.toLowerCase().includes(query)

      return qualityMatches && searchMatches
    })
  }, [activeQuality, downloads, searchTerm])

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-black tracking-tight">Available Downloads</h2>

      <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <div className="flex w-max items-center gap-1 rounded-xl bg-portal-border/30 p-1">
          {qualities.map((quality) => (
            <button
              key={quality}
              type="button"
              onClick={() => setActiveQuality(quality)}
              className={
                activeQuality === quality
                  ? 'shrink-0 rounded-lg bg-portal-text px-3 py-2 text-xs font-bold text-white shadow-md sm:px-6'
                  : 'shrink-0 rounded-lg px-3 py-2 text-xs font-bold text-portal-muted transition-all hover:text-portal-text sm:px-6'
              }
            >
              {quality}({quality === 'unsorted' ? downloads.length : (qualityCounts[quality] || 0)})
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search files (e.g. BluRay, WEB-D)"
            className="w-full rounded-xl border border-portal-border bg-white py-2.5 pl-10 pr-4 text-sm focus:outline-none"
          />
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-portal-muted" />
        </div>
        {/* <button className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-portal-border bg-white px-3 py-2 text-xs font-bold text-portal-muted sm:px-4">
          Size
          <Settings2 className="h-4 w-4" />
        </button> */}
      </div>

      <div className="space-y-3">
        {visibleDownloads.map((download, index) => (
          <div key={`${download.quality}-${index}`} className="flex flex-col gap-4 rounded-2xl border border-portal-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="space-y-1">
              <h4 className="text-sm font-bold leading-tight">{download.name}</h4>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-portal-muted/60">{download.size || '952.42 MB'}</span>
                <div className="rounded-lg border border-emerald-200 bg-emerald-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">
                  {download.tag || 'Good Encode'}
                </div>
              </div>
              <a
                href={download.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-portal-text px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white transition-colors hover:bg-portal-accent sm:w-auto sm:justify-start"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}