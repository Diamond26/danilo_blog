import { getAllPosts } from "@/lib/notion"
import Link from "next/link"

export default async function HomePage() {
  const posts = await getAllPosts()

  return (
    <main style={{ padding: "32px", fontFamily: "system-ui, sans-serif" }}>
      <h1>Danilo Blog</h1>

      {posts.length === 0 && (
        <p>Nessun post trovato. Controlla Published o l'integration.</p>
      )}

      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: "24px" }}>
          <Link href={`/blog/${post.slug}`}>
            <a style={{ fontSize: "20px", fontWeight: "bold" }}>
              {post.title}
            </a>
          </Link>
          <p style={{ fontSize: "14px", color: "#666" }}>
            {post.date}
          </p>
        </div>
      ))}
    </main>
  )
}