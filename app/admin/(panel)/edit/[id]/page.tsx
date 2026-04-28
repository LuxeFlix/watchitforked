import { notFound } from 'next/navigation'
import MovieForm from '@/components/admin/MovieForm'
import { sql } from '@/lib/db'
import { Movie } from '@/types'

export default async function EditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const result = await sql`SELECT * FROM movies WHERE id = ${Number(id)}`
  const movie = result[0] as Movie | undefined

  if (!movie) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <div className="space-y-2">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Edit Movie #{id}</h1>
        <p className="max-w-2xl text-sm leading-6 text-text-secondary sm:text-[15px]">
          Update movie details and save the changes.
        </p>
      </div>

      <MovieForm initialData={movie} />
    </div>
  )
}
