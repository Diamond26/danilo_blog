export async function getAllPosts() {
  const DATABASE_ID = process.env.NOTION_DATABASE_ID;
  const TOKEN = process.env.NOTION_TOKEN;

  if (!DATABASE_ID || !TOKEN) {
    console.error("Mancano le credenziali Notion nel file .env.local");
    return [];
  }

  try {
    // Usiamo il fetch nativo di Next.js, superando il bug dell'SDK
    const response = await fetch(
      `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filter: {
            property: "Published",
            checkbox: { equals: true },
          },
          sorts: [{ property: "Date", direction: "descending" }],
        }),
        // Salva in cache i post per 60 secondi (ISR)
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return [];
    }

    const data = await response.json();

    return data.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Name?.title[0]?.plain_text || "Senza titolo",
      slug: page.properties.Slug?.rich_text[0]?.plain_text || "no-slug",
      date: page.properties.Date?.date?.start || "",
      description: page.properties.Description?.rich_text[0]?.plain_text || "",
    }));
  } catch (error) {
    console.error("Errore fatale nella chiamata a Notion:", error);
    return [];
  }
}