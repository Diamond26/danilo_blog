import { getPostBySlug, getPostBlocks } from "@/lib/notion";
import { notFound } from "next/navigation";
import Link from "next/link";

const renderBlock = (block: any) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case "paragraph":
      return (
        <p key={id} className="mb-5 text-lg text-gray-800 leading-relaxed">
          {value.rich_text.map((text: any, i: number) => (
            <span
              key={i}
              className={`
                ${text.annotations.bold ? 'font-bold' : ''} 
                ${text.annotations.italic ? 'italic' : ''}
                ${text.annotations.underline ? 'underline' : ''}
              `}
            >
              {text.plain_text}
            </span>
          ))}
        </p>
      );
    case "heading_1":
      return <h1 key={id} className="text-4xl font-bold mt-10 mb-6 text-slate-900">{value.rich_text[0]?.plain_text}</h1>;
    case "heading_2":
      return <h2 key={id} className="text-3xl font-bold mt-8 mb-4 text-slate-900">{value.rich_text[0]?.plain_text}</h2>;
    case "heading_3":
      return <h3 key={id} className="text-2xl font-bold mt-6 mb-3 text-slate-900">{value.rich_text[0]?.plain_text}</h3>;
    case "bulleted_list_item":
      return <li key={id} className="ml-6 list-disc mb-2 text-lg text-gray-800">{value.rich_text[0]?.plain_text}</li>;
    default:
      return <p key={id} className="text-gray-400 text-sm italic mb-4">[Contenuto non supportato al momento]</p>;
  }
};

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const blocks = await getPostBlocks(post.id);

  return (
    <article className="max-w-3xl mx-auto py-20 px-6">
      <Link href="/blog" className="text-blue-600 hover:text-blue-800 font-medium mb-10 inline-flex items-center transition-colors">
        &larr; Torna agli articoli
      </Link>

      <header className="mb-12 border-b border-gray-100 pb-8">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-slate-900 tracking-tight">{post.title}</h1>
        <p className="text-slate-500 font-medium">{post.date}</p>
      </header>

      <div className="prose prose-lg max-w-none">
        {blocks.map((block: any) => renderBlock(block))}
      </div>
    </article>
  );
}