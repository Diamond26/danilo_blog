import type { Post, NotionBlock } from "./types";

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

/* ── Nomi proprietà del database Notion ── */
const PROP = {
  name: "Name",
  slug: "Slug",
  date: "Date",
  published: "Published ", // spazio finale presente nel DB Notion
  cover: "Cover",
  excerpt: "Excerpt",
  description: "Description",
} as const;

function getHeaders() {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error("NOTION_TOKEN mancante in .env.local");
  return {
    Authorization: `Bearer ${token}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

function getDatabaseId() {
  const id = process.env.NOTION_DATABASE_ID;
  if (!id) throw new Error("NOTION_DATABASE_ID mancante in .env.local");
  return id;
}

function extractPlainText(richText: any[]): string {
  if (!richText || richText.length === 0) return "";
  return richText.map((t) => t.plain_text).join("");
}

/**
 * Converte una stringa in slug URL-safe.
 * "Il Mio Post 123!" → "il-mio-post-123"
 */
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // rimuovi accenti
    .replace(/[^a-z0-9]+/g, "-")    // caratteri non alfanumerici → trattino
    .replace(/^-+|-+$/g, "");        // trim trattini
}

function extractCover(page: any): string | null {
  // 1. Proprietà "Cover" del database (Files & media)
  const coverProp = page.properties[PROP.cover];
  if (coverProp?.files?.length > 0) {
    const file = coverProp.files[0];
    if (file.type === "external") return file.external.url;
    if (file.type === "file") return file.file.url;
  }

  // 2. Fallback: cover a livello di pagina Notion
  if (page.cover?.type === "external") return page.cover.external.url;
  if (page.cover?.type === "file") return page.cover.file.url;

  return null;
}

function extractExcerpt(page: any): string {
  const prop =
    page.properties[PROP.excerpt] ?? page.properties[PROP.description];
  if (prop?.rich_text) return extractPlainText(prop.rich_text);
  return "";
}

function mapPage(page: any): Post {
  const title =
    extractPlainText(page.properties[PROP.name]?.title) || "Senza titolo";
  const rawSlug = extractPlainText(page.properties[PROP.slug]?.rich_text);

  // Se lo slug è vuoto o invalido, genera automaticamente dal titolo
  const slug = rawSlug ? toSlug(rawSlug) : toSlug(title) || page.id;

  return {
    id: page.id,
    title,
    slug,
    date: page.properties[PROP.date]?.date?.start || "",
    excerpt: extractExcerpt(page),
    cover: extractCover(page),
  };
}

/**
 * Recupera tutti i post pubblicati, ordinati per data decrescente.
 * Gestisce paginazione automatica (Notion limita a 100 risultati per pagina).
 */
export async function getAllPosts(): Promise<Post[]> {
  try {
    const databaseId = getDatabaseId();
    const allResults: any[] = [];
    let hasMore = true;
    let startCursor: string | undefined;

    while (hasMore) {
      const body: Record<string, unknown> = {
        filter: {
          property: PROP.published,
          checkbox: { equals: true },
        },
        sorts: [{ property: PROP.date, direction: "descending" }],
        page_size: 100,
      };
      if (startCursor) body.start_cursor = startCursor;

      const res = await fetch(`${NOTION_API}/databases/${databaseId}/query`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(body),
        next: { revalidate: 5 },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Errore Notion getAllPosts:", res.status, err);
        return [];
      }

      const data = await res.json();
      allResults.push(...data.results);
      hasMore = data.has_more;
      startCursor = data.next_cursor ?? undefined;
    }

    return allResults.map(mapPage);
  } catch (error) {
    console.error("Errore fatale getAllPosts:", error);
    return [];
  }
}

/**
 * Recupera un singolo post per slug.
 * Confronta lo slug normalizzato, così funziona anche con numeri,
 * maiuscole o caratteri speciali nel campo Slug di Notion.
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const posts = await getAllPosts();
    const normalized = toSlug(slug);
    return posts.find((p) => p.slug === normalized) ?? null;
  } catch (error) {
    console.error("Errore fatale getPostBySlug:", error);
    return null;
  }
}

/**
 * Recupera i blocchi di contenuto di una pagina Notion.
 * Gestisce paginazione automatica.
 */
export async function getPostBlocks(pageId: string): Promise<NotionBlock[]> {
  try {
    const allBlocks: NotionBlock[] = [];
    let hasMore = true;
    let startCursor: string | undefined;

    while (hasMore) {
      const url = new URL(`${NOTION_API}/blocks/${pageId}/children`);
      url.searchParams.set("page_size", "100");
      if (startCursor) url.searchParams.set("start_cursor", startCursor);

      const res = await fetch(url.toString(), {
        headers: getHeaders(),
        next: { revalidate: 5 },
      });

      if (!res.ok) {
        console.error("Errore Notion getPostBlocks:", res.status);
        return [];
      }

      const data = await res.json();
      allBlocks.push(...data.results);
      hasMore = data.has_more;
      startCursor = data.next_cursor ?? undefined;
    }

    return allBlocks;
  } catch (error) {
    console.error("Errore fatale getPostBlocks:", error);
    return [];
  }
}
