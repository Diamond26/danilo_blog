import { getAllPosts } from "@/lib/notion"
import Link from "next/link"

export default async function HomePage() {
  const posts = await getAllPosts()

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Danilo Blog</h1>

      {posts.length === 0 && (
        <p>Nessun post trovato. Controlla Published o l'integration.</p>
      )}

      <div style={{ marginTop: "20px" }}>
        {posts.map((post) => (
          <div key={post.id} style={{ marginBottom: "20px" }}>
            <Link href={`/blog/${post.slug}`}>
              <h2 style={{ cursor: "pointer" }}>{post.title}</h2>
            </Link>
            <p>{post.date}</p>
          </div>
        ))}
      </div>
    </main>
  )
}