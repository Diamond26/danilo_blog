const NOTION_API = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

function getConfig() {
  return {
    databaseId: process.env.NOTION_DATABASE_ID,
    token: process.env.NOTION_TOKEN,
  };
}

function headers() {
  const { token } = getConfig();
  return {
    Authorization: `Bearer ${token}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json",
  };
}

export async function getAllPosts() {
  const { databaseId, token } = getConfig();

  if (!databaseId || !token) {
    console.error("❌ Mancano le credenziali Notion nel file .env.local");
    return [];
  }

  try {
    const response = await fetch(`${NOTION_API}/databases/${databaseId}/query`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        filter: {
          property: "Published ",
          checkbox: { equals: true },
        },
        sorts: [
          {
            property: "Date",
            direction: "descending",
          },
        ],
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Errore dalla API Notion:", errorData);
      return [];
    }

    const data = await response.json();

    return data.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Name?.title?.[0]?.plain_text || "Senza titolo",
      slug: page.properties.Slug?.rich_text?.[0]?.plain_text || "no-slug",
      date: page.properties.Date?.date?.start || "",
    }));
  } catch (error) {
    console.error("💀 Errore fatale nella chiamata a Notion:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  const { databaseId, token } = getConfig();

  if (!databaseId || !token) return null;

  try {
    const response = await fetch(`${NOTION_API}/databases/${databaseId}/query`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        filter: {
          and: [
            { property: "Slug", rich_text: { equals: slug } },
            { property: "Published ", checkbox: { equals: true } },
          ],
        },
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("❌ Errore ricerca post per slug:", await response.json());
      return null;
    }

    const data = await response.json();
    const page = data.results[0];
    if (!page) return null;

    return {
      id: page.id,
      title: page.properties.Name?.title?.[0]?.plain_text || "Senza titolo",
      slug: page.properties.Slug?.rich_text?.[0]?.plain_text || "no-slug",
      date: page.properties.Date?.date?.start || "",
    };
  } catch (error) {
    console.error("💀 Errore fatale getPostBySlug:", error);
    return null;
  }
}

export async function getPostBlocks(pageId: string) {
  const { token } = getConfig();

  if (!token) return [];

  try {
    const response = await fetch(`${NOTION_API}/blocks/${pageId}/children?page_size=100`, {
      headers: headers(),
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("❌ Errore recupero blocchi:", await response.json());
      return [];
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("💀 Errore fatale getPostBlocks:", error);
    return [];
  }
}