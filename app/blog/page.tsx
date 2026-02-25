import { getAllPosts } from "@/lib/notion";
import Link from "next/link";

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <main className="max-w-4xl mx-auto py-20 px-6">
      <h1 className="text-4xl font-bold mb-10 text-slate-900">Articoli di Psicologia</h1>
      
      <div className="space-y-12">
        {posts.length === 0 ? (
          <p className="text-gray-500 italic">Al momento non ci sono articoli pubblicati.</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} className="group">
              <Link href={`/blog/${post.slug}`}>
                <p className="text-sm text-blue-600 mb-2">{post.date}</p>
                <h2 className="text-2xl font-semibold group-hover:underline mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-600 line-clamp-2">{post.description}</p>
              </Link>
            </article>
          ))
        )}
      </div>
    </main>
  );
}