import type { Post, NotionBlock } from "./types";

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

/** Nomi delle proprietà del database Notion — devono corrispondere ESATTAMENTE */
const PROP = {
  title: "Title",
  slug: "Slug",
  date: "Date",
  image: "Image",
  excerpt: "Excerpt",
  link: "Link",
  published: "Published",
} as const;

// ─────────────────────────────────────────────
// Helpers interni
// ─────────────────────────────────────────────

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

function extractPlainText(richText: unknown[]): string {
  if (!Array.isArray(richText) || richText.length === 0) return "";
  return richText
    .map((t) =>
      typeof t === "object" && t !== null && "plain_text" in t
        ? (t as { plain_text: string }).plain_text
        : ""
    )
    .join("");
}

/**
 * "Il Mio Post 2026!" → "il-mio-post-2026"
 */
function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Estrae URL immagine dalla proprietà Files & media di Notion. */
function extractImage(
  page: { properties: Record<string, unknown> }
): string | null {
  const prop = page.properties[PROP.image] as
    | {
      files?: Array<{
        type: string;
        external?: { url: string };
        file?: { url: string };
      }>;
    }
    | undefined;

  if (!prop?.files?.length) return null;
  const file = prop.files[0];
  if (file.type === "external") return file.external?.url ?? null;
  if (file.type === "file") return file.file?.url ?? null;
  return null;
}

/** Estrae l'URL dal campo Link (tipo URL in Notion). */
function extractLink(
  page: { properties: Record<string, unknown> }
): string | null {
  const prop = page.properties[PROP.link] as { url?: string | null } | undefined;
  return prop?.url ?? null;
}

/** Mappa una pagina Notion raw nell'interfaccia Post. */
function mapPage(page: {
  id: string;
  properties: Record<string, unknown>;
}): Post {
  const titleProp = page.properties[PROP.title] as
    | { title?: unknown[] }
    | undefined;
  const title = extractPlainText(titleProp?.title ?? []) || "Senza titolo";

  const slugProp = page.properties[PROP.slug] as
    | { rich_text?: unknown[] }
    | undefined;
  const rawSlug = extractPlainText(slugProp?.rich_text ?? []);
  // Se lo slug è valorizzato in Notion lo usa, altrimenti lo genera dal titolo
  const slug = rawSlug ? toSlug(rawSlug) : toSlug(title) || page.id;

  const dateProp = page.properties[PROP.date] as
    | { date?: { start?: string } | null }
    | undefined;

  const excerptProp = page.properties[PROP.excerpt] as
    | { rich_text?: unknown[] }
    | undefined;
  const excerptRaw = (excerptProp?.rich_text ?? []) as import("./types").NotionRichText[];
  const excerpt = extractPlainText(excerptRaw);

  return {
    id: page.id,
    title,
    slug,
    date: dateProp?.date?.start ?? "",
    image: extractImage(page),
    excerpt,
    excerptRaw,
    link: extractLink(page),
  };
}

// ─────────────────────────────────────────────
// API pubblica
// ─────────────────────────────────────────────

/**
 * Recupera tutti i post con Published = true, ordinati per data decrescente.
 * Gestisce la paginazione automatica di Notion (max 100 per request).
 * Tutto server-side: il token Notion non è mai esposto al client.
 */
export async function getAllPosts(): Promise<Post[]> {
  try {
    const databaseId = getDatabaseId();
    const allResults: { id: string; properties: Record<string, unknown> }[] = [];
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
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Errore Notion getAllPosts:", res.status, err);
        return [];
      }

      const data = await res.json() as {
        results: { id: string; properties: Record<string, unknown> }[];
        has_more: boolean;
        next_cursor: string | null;
      };
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
 * Confronta lo slug normalizzato (generato dal campo Slug o dal Title).
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const posts = await getAllPosts();
    return posts.find((p) => p.slug === slug) ?? null;
  } catch (error) {
    console.error("Errore fatale getPostBySlug:", error);
    return null;
  }
}

/**
 * Recupera tutti i blocchi di contenuto di una pagina Notion.
 * Gestisce la paginazione automatica.
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
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        console.error("Errore Notion getPostBlocks:", res.status);
        return [];
      }

      const data = await res.json() as {
        results: NotionBlock[];
        has_more: boolean;
        next_cursor: string | null;
      };
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
