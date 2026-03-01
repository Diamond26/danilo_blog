import type { Post, NotionBlock } from "./types";

const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

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

function extractCover(page: any): string | null {
  if (page.cover?.type === "external") return page.cover.external.url;
  if (page.cover?.type === "file") return page.cover.file.url;
  return null;
}

function extractExcerpt(page: any): string {
  const prop = page.properties.Excerpt ?? page.properties.Description;
  if (prop?.rich_text) return extractPlainText(prop.rich_text);
  return "";
}

function mapPage(page: any): Post {
  return {
    id: page.id,
    title: extractPlainText(page.properties.Name?.title) || "Senza titolo",
    slug: extractPlainText(page.properties.Slug?.rich_text) || "no-slug",
    date: page.properties.Date?.date?.start || "",
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
          property: "Published",
          checkbox: { equals: true },
        },
        sorts: [{ property: "Date", direction: "descending" }],
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
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const databaseId = getDatabaseId();

    const res = await fetch(`${NOTION_API}/databases/${databaseId}/query`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        filter: {
          and: [
            { property: "Slug", rich_text: { equals: slug } },
            { property: "Published", checkbox: { equals: true } },
          ],
        },
      }),
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Errore Notion getPostBySlug:", res.status);
      return null;
    }

    const data = await res.json();
    const page = data.results[0];
    if (!page) return null;

    return mapPage(page);
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
        next: { revalidate: 60 },
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
