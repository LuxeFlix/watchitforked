'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Movie } from '@/types'
import {
  Pencil,
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
  Loader2,
  Trash2,
} from 'lucide-react'
import ConfirmModal from './ConfirmModal'

type SortKey = 'date' | 'views'
type SortDir = 'asc' | 'desc'
type StatusFilter = 'all' | 'published' | 'draft'
type TypeFilter = 'all' | 'movie' | 'series'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function truncateDescription(text: string, maxLength = 50) {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active) return <ArrowUpDown size={13} className="text-text-secondary/50" />
  return dir === 'asc' ? (
    <ChevronUp size={13} className="text-primary" />
  ) : (
    <ChevronDown size={13} className="text-primary" />
  )
}

export default function MovieTable({ movies }: { movies: Movie[] }) {
  const PAGE_SIZE = 20
  const [rows, setRows] = useState<Movie[]>(movies)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pendingStatusId, setPendingStatusId] = useState<number | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Movie | null>(null)

  useEffect(() => {
    setRows(movies)
  }, [movies])

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  const filtered = useMemo(() => {
    let list = rows

    if (search) {
      const q = search.toLowerCase()
      list = list.filter((m) => m.title.toLowerCase().includes(q))
    }

    if (statusFilter !== 'all') {
      list = list.filter((m) => m.status === statusFilter)
    }

    if (typeFilter !== 'all') {
      list = list.filter((m) => m.type === typeFilter)
    }

    list = [...list].sort((a, b) => {
      let cmp = 0
      if (sortKey === 'date') {
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      } else {
        cmp = a.views - b.views
      }
      return sortDir === 'asc' ? cmp : -cmp
    })

    return list
  }, [rows, search, statusFilter, typeFilter, sortKey, sortDir])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, statusFilter, typeFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  useEffect(() => {
    setCurrentPage((previous) => Math.min(previous, totalPages))
  }, [totalPages])

  const pageStart = (currentPage - 1) * PAGE_SIZE
  const pageEnd = pageStart + PAGE_SIZE
  const pagedRows = filtered.slice(pageStart, pageEnd)

  async function toggleStatus(movie: Movie) {
    if (pendingStatusId === movie.id || pendingDeleteId === movie.id) return

    const nextStatus = movie.status === 'published' ? 'draft' : 'published'
    const previousRows = rows

    setPendingStatusId(movie.id)
    setRows((current) =>
      current.map((row) =>
        row.id === movie.id ? { ...row, status: nextStatus } : row
      )
    )

    try {
      const response = await fetch(`/api/admin/movies/${movie.id}/status`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        throw new Error('Failed to toggle status')
      }

      const updatedMovie: Movie = await response.json()
      setRows((current) =>
        current.map((row) => (row.id === updatedMovie.id ? updatedMovie : row))
      )
    } catch {
      setRows(previousRows)
    } finally {
      setPendingStatusId(null)
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || pendingDeleteId === deleteTarget.id) return

    const movie = deleteTarget
    const previousRows = rows

    setPendingDeleteId(movie.id)
    setDeleteTarget(null)
    setRows((current) => current.filter((row) => row.id !== movie.id))

    try {
      const response = await fetch(`/api/admin/movies/${movie.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete movie')
      }
    } catch {
      setRows(previousRows)
    } finally {
      setPendingDeleteId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="admin-panel p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,auto))] md:items-end">
          <div className="relative">
            <label className="admin-field-label mb-2 block">Search</label>
            <Search size={15} className="pointer-events-none absolute left-3 top-[2.6rem] -translate-y-1/2 text-text-secondary" />
            <input
              type="text"
              placeholder="Search by title"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input pl-9"
            />
          </div>

          <div>
            <label className="admin-field-label mb-2 block">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="admin-select min-w-0"
            >
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div>
            <label className="admin-field-label mb-2 block">Type</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              className="admin-select min-w-0"
            >
              <option value="all">All</option>
              <option value="movie">Movie</option>
              <option value="series">Series</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-3 md:justify-end md:col-span-3 lg:col-span-1">
            <button
              type="button"
              onClick={() => toggleSort('views')}
              className="admin-btn-secondary !w-auto px-3 py-2 text-xs"
            >
              Views
              <SortIcon active={sortKey === 'views'} dir={sortDir} />
            </button>
            <button
              type="button"
              onClick={() => toggleSort('date')}
              className="admin-btn-secondary !w-auto px-3 py-2 text-xs"
            >
              Date
              <SortIcon active={sortKey === 'date'} dir={sortDir} />
            </button>
            <span className="ml-auto text-xs text-text-secondary">
              Showing {pagedRows.length} of {filtered.length} movies
            </span>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="admin-panel flex flex-col items-center justify-center py-20 text-center">
          <p className="text-sm text-text-secondary">No movies found.</p>
        </div>
      ) : (
        <>
          {/* Table view for desktop (md+) */}
          <div className="hidden md:block">
            <div className="admin-panel overflow-x-auto">
              <table className="w-full table-fixed text-xs lg:text-sm">
                <thead>
                  <tr className="text-left text-text-secondary/80">
                    <th className="w-[68px] p-2.5">Poster</th>
                    <th className="w-[220px] p-2.5">Title</th>
                    <th className="w-[86px] p-2.5">Status</th>
                    <th className="w-[72px] p-2.5">Type</th>
                    <th className="w-[80px] p-2.5">Quality</th>
                    <th className="w-[66px] p-2.5">Year</th>
                    <th className="w-[90px] p-2.5">Language</th>
                    <th className="w-[80px] p-2.5">
                      <button type="button" onClick={() => toggleSort('views')} className="flex items-center gap-2">
                        Views <SortIcon active={sortKey === 'views'} dir={sortDir} />
                      </button>
                    </th>
                    <th className="w-[110px] p-2.5">
                      <button type="button" onClick={() => toggleSort('date')} className="flex items-center gap-2">
                        Date <SortIcon active={sortKey === 'date'} dir={sortDir} />
                      </button>
                    </th>
                    <th className="w-[180px] p-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedRows.map((movie, index) => (
                    <tr key={movie.id} className="border-t border-border align-top">
                      <td className="p-2.5 align-middle">
                        <div className="relative h-[72px] w-12 overflow-hidden rounded-md bg-[#1a1a1a]">
                          {movie.poster_url ? (
                            <Image 
                              src={movie.poster_url} 
                              alt={movie.title} 
                              fill 
                              className="object-cover" 
                              sizes="48px" 
                              priority={index < 5}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-xs text-text-secondary">N/A</div>
                          )}
                        </div>
                      </td>
                      <td className="p-2.5 align-middle">
                        <div className="flex items-center gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              {/* <span className={movie.status === 'published' ? 'admin-pill admin-pill-status-published' : 'admin-pill admin-pill-status-draft'}>{movie.status}</span> */}
                           
                              <span className="line-clamp-2 font-semibold leading-5 text-text-primary">{movie.title}</span>
                               </div>
                            <div className="line-clamp-1 text-[11px] text-text-secondary">
                              {movie.description ? truncateDescription(movie.description) : movie.language}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-2.5 align-middle">
                        <span className={movie.status === 'published' ? 'admin-pill admin-pill-status-published' : 'admin-pill admin-pill-status-draft'}>
                          {movie.status}
                        </span>
                      </td>
                      <td className="p-2.5 align-middle">{movie.type}</td>
                      <td className="p-2.5 align-middle">{movie.quality}</td>
                      <td className="p-2.5 align-middle">{movie.year}</td>
                      <td className="p-2.5 align-middle">{movie.language}</td>
                      <td className="p-2.5 align-middle whitespace-nowrap">{movie.views.toLocaleString()}</td>
                      <td className="p-2.5 align-middle whitespace-nowrap">{formatDate(movie.created_at)}</td>
                      <td className="p-2.5 align-middle">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleStatus(movie)}
                            disabled={pendingStatusId === movie.id || pendingDeleteId === movie.id}
                            className={`admin-btn-secondary px-2 py-1 text-[11px] ${movie.status === 'published' ? 'border-emerald-500/20 text-emerald-300' : 'border-amber-500/20 text-amber-300'}`}
                          >
                            {pendingStatusId === movie.id ? <Loader2 size={14} className="animate-spin" /> : 'Toggle'}
                          </button>
                          <Link href={`/admin/edit/${movie.id}`} className="admin-btn-secondary px-2 py-1 text-[11px]">Edit</Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(movie)}
                            disabled={pendingDeleteId === movie.id || pendingStatusId === movie.id}
                            className="admin-btn-danger px-2 py-1 text-[11px]"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Card view for small screens */}
          <div className="md:hidden grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {pagedRows.map((movie, index) => (
              <article
                key={movie.id}
                className="group overflow-hidden rounded-2xl border border-border bg-[#111] shadow-[0_24px_70px_rgba(0,0,0,0.25)] transition-transform duration-200 hover:-translate-y-0.5 hover:border-[#343434]"
              >
                <div className="flex h-full flex-col">
                  <div className="grid grid-cols-[84px_minmax(0,1fr)] gap-3 border-b border-border p-3 sm:grid-cols-[96px_minmax(0,1fr)] md:grid-cols-[112px_minmax(0,1fr)] md:p-4">
                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl border border-border bg-[#1a1a1a] shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
                      {movie.poster_url ? (
                        <Image
                          src={movie.poster_url}
                          alt={movie.title}
                          fill
                          priority={index < 2}
                          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 84px, (max-width: 1024px) 96px, 112px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-[10px] text-text-secondary">
                          N/A
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 space-y-2">
                      <div className="flex flex-wrap items-start gap-2">
                        <h3 className="min-w-0 flex-1 break-words text-sm font-semibold leading-5 text-text-primary sm:text-base">
                          {movie.title}
                        </h3>
                        <span className={movie.status === 'published' ? 'admin-pill admin-pill-status-published' : 'admin-pill admin-pill-status-draft'}>
                          {movie.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <span className="admin-pill admin-pill-type">{movie.type}</span>
                        <span className="admin-pill admin-pill-quality">{movie.quality}</span>
                        <span className="admin-pill admin-pill-neutral">{movie.year}</span>
                      </div>

                      <p className="line-clamp-2 text-xs leading-5 text-text-secondary sm:text-sm">
                        {movie.language}
                        {movie.description ? ` · ${truncateDescription(movie.description)}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-3 p-3 md:p-4">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-text-secondary">
                      <span className="rounded-full border border-border bg-[#0a0a0a] px-2.5 py-1">{movie.views.toLocaleString()} views</span>
                      <span className="rounded-full border border-border bg-[#0a0a0a] px-2.5 py-1">{formatDate(movie.created_at)}</span>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => toggleStatus(movie)}
                        disabled={pendingStatusId === movie.id || pendingDeleteId === movie.id}
                        className={`admin-btn-secondary w-full sm:flex-1 ${movie.status === 'published' ? 'border-emerald-500/20 text-emerald-300 hover:bg-emerald-500/10' : 'border-amber-500/20 text-amber-300 hover:bg-amber-500/10'}`}
                      >
                        {pendingStatusId === movie.id ? <Loader2 size={14} className="animate-spin" /> : null}
                        Toggle status
                      </button>
                      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-1">
                        <Link
                          href={`/admin/edit/${movie.id}`}
                          className="admin-btn-secondary w-full px-3 py-2 text-center"
                        >
                          <Pencil size={14} />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(movie)}
                          disabled={pendingDeleteId === movie.id || pendingStatusId === movie.id}
                          className="admin-btn-danger w-full px-3 py-2"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="admin-panel flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-secondary">
              {pageStart + 1}-{Math.min(pageStart + pagedRows.length, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="admin-btn-secondary !w-auto px-3 py-1.5 text-xs"
              >
                Previous
              </button>
              <span className="text-xs text-text-secondary">
                Page {currentPage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="admin-btn-secondary !w-auto px-3 py-1.5 text-xs"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete movie?"
        description={deleteTarget ? `This will permanently remove ${deleteTarget.title}.` : ''}
        confirmText={pendingDeleteId === deleteTarget?.id ? 'Deleting...' : 'Delete'}
        confirmDisabled={pendingDeleteId !== null}
        onCancel={() => {
          if (pendingDeleteId) return
          setDeleteTarget(null)
        }}
        onConfirm={confirmDelete}
      />
    </div>
  )
}
