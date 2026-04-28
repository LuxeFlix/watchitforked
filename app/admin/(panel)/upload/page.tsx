import MovieForm from '@/components/admin/MovieForm'

export default function UploadPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold">Add New Movie</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Fill in the details to add a new movie or series.
        </p>
      </div>

      <MovieForm />
    </div>
  )
}
