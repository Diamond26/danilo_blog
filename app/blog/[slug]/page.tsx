import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug, getPostBlocks, getAllPosts } from "@/lib/notion";
import NotionRenderer from "@/components/NotionRenderer";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const revalidate = 5;
export const dynamicParams = true;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Articolo non trovato" };
  }

  return {
    title: post.title,
    description: post.excerpt || `Leggi "${post.title}" sul blog di Danilo Littarru, psicologo.`,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: "article",
      publishedTime: post.date || undefined,
      ...(post.cover && { images: [{ url: post.cover }] }),
    },
  };
}

/**
 * Genera le pagine statiche al build time per i post pubblicati.
 */
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const blocks = await getPostBlocks(post.id);

  return (
    <>
      <Header />
      <article className="post-detail" style={{ paddingTop: "calc(var(--header-h) + var(--space-3xl))" }}>
        <Link href="/#articoli" className="back-link">
          &larr; Torna agli articoli
        </Link>

        <div className="post-detail-type">Articolo</div>
        <h1 className="post-detail-title">{post.title}</h1>

        <div className="post-detail-meta">
          <span>{formatDate(post.date)}</span>
          <span>Dr. Danilo Littarru</span>
        </div>

        {post.excerpt && (
          <p className="post-detail-excerpt">{post.excerpt}</p>
        )}

        {post.cover && (
          <Image
            src={post.cover}
            alt={post.title}
            width={720}
            height={400}
            className="post-detail-cover"
            priority
          />
        )}

        <NotionRenderer blocks={blocks} />

        {blocks.length === 0 && (
          <p className="empty-state">
            Questo articolo non ha ancora contenuto. Apri la pagina su Notion e
            scrivi il testo del tuo articolo direttamente dentro la pagina.
          </p>
        )}
      </article>
      <Footer />
    </>
  );
}
