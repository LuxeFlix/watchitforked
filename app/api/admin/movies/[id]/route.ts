import { updateMovie, deleteMovie } from "@/lib/queries";
import { sql } from "@/lib/db";
import { Movie } from "@/types";
import { revalidateTag, revalidatePath } from "next/cache";
import { sendTelegramNotification } from "@/lib/telegram";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // Admin GET: no status filter (can see drafts too)
    const result = await sql`SELECT * FROM movies WHERE id = ${Number(id)}`;

    if (result.length === 0) {
      return Response.json({ error: "Movie not found" }, { status: 404 });
    }

    return Response.json(result[0] as Movie);
  } catch {
    return Response.json({ error: "Failed to fetch movie" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // Fetch old movie to compare changes
    const oldMovieResult =
      await sql`SELECT * FROM movies WHERE id = ${Number(id)}`;
    const oldMovie = oldMovieResult[0] as Movie | undefined;

    const body = await request.json();
    const movie = await updateMovie(Number(id), body);

    if (!movie) {
      return Response.json({ error: "Movie not found" }, { status: 404 });
    }

    revalidateTag("movie-details", "default");
    revalidatePath("/");

    if (movie.status === "published") {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

      const isSeries = movie.type === "series";
      const heading = isSeries
        ? "📺 New Series Uploaded!"
        : "🎥 New Movie Uploaded!";

      let message =
        `${heading}\n\n` +
        `📌 <b>Title:</b> ${movie.title}\n` +
        `📅 <b>Year:</b> ${movie.year}\n` +
        `🎭 <b>Type:</b> ${isSeries ? "Series" : "Movie"}\n`;

      // Show description if available
      if (movie.description?.trim()) {
        message += `\n📝 <b>Description</b>\n${movie.description.trim()}\n`;
      }

      // Calculate changes
      if (oldMovie) {
        const getEps = (m: Movie) => {
          const eps = new Set<string>();

          const parse = (str: string | null) => {
            if (!str) return;

            try {
              const arr = JSON.parse(str);

              if (Array.isArray(arr)) {
                arr.forEach((a) => {
                  if (a.episode) eps.add(String(a.episode));
                });
              }
            } catch {}
          };

          parse(m.download_480p);
          parse(m.download_720p);
          parse(m.download_1080p);
          parse(m.download_2k);

          return Array.from(eps);
        };

        const getQualities = (m: Movie) => {
          const q: string[] = [];

          if (m.download_480p && m.download_480p !== "[]") q.push("480P");
          if (m.download_720p && m.download_720p !== "[]") q.push("720P");
          if (m.download_1080p && m.download_1080p !== "[]") q.push("1080P");
          if (m.download_2k && m.download_2k !== "[]") q.push("2K");

          return q;
        };

        const oldEps = getEps(oldMovie);
        const newEps = getEps(movie);

        const addedEps = newEps.filter((ep) => !oldEps.includes(ep));

        const oldQ = getQualities(oldMovie);
        const newQ = getQualities(movie);

        const addedQ = newQ.filter((q) => !oldQ.includes(q));

        if (addedEps.length || addedQ.length) {
          message += `\n🔥 <b>What's New</b>\n`;

          if (addedEps.length) {
            message += `• New Episode(s): ${addedEps.join(", ")}\n`;
          }

          if (addedQ.length) {
            message += `• Quality Added: ${addedQ.join(", ")}\n`;
          }
        }
      }

      message += `\n🔗 <b>Download Links</b>\n`;

      const linkUrl = `${siteUrl}/movie/${movie.id}`;

      await sendTelegramNotification(message, movie.poster_url, linkUrl);
    }

    return Response.json(movie);
  } catch (error) {
    console.error("Update error:", error);
    return Response.json({ error: "Failed to update movie" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deleted = await deleteMovie(Number(id));

    if (!deleted) {
      return Response.json({ error: "Movie not found" }, { status: 404 });
    }

    revalidateTag("movie-details", "default");
    revalidatePath("/");
    return Response.json({ success: true });
  } catch {
    return Response.json({ error: "Failed to delete movie" }, { status: 500 });
  }
}
