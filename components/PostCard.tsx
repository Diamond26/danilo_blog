import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/types";

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="post-card">
      <div className="post-card-image">
        {post.cover ? (
          <Image
            src={post.cover}
            alt={post.title}
            width={400}
            height={250}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div className="post-card-image-placeholder">DL</div>
        )}
      </div>
      <div className="post-card-body">
        <span className="post-card-type">Articolo</span>
        <h3 className="post-card-title">{post.title}</h3>
        {post.excerpt && <p className="post-card-excerpt">{post.excerpt}</p>}
        <div className="post-card-meta">
          <span className="post-card-date">{formatDate(post.date)}</span>
        </div>
      </div>
    </Link>
  );
}
