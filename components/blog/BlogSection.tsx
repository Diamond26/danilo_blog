import type { Post } from "@/lib/types";
import PostCard from "./PostCard";

export default function BlogSection({ posts }: { posts: Post[] }) {
    return (
        <section className="section section--alt" id="articoli">
            <div className="container">
                <div className="section-header">
                    <div>
                        <div className="section-label">Blog</div>
                        <h2 className="section-title">Articoli e approfondimenti</h2>
                    </div>
                </div>

                {posts.length === 0 ? (
                    <p className="empty-state">Nessun articolo disponibile al momento...</p>
                ) : (
                    <div className="posts-grid">
                        {posts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
