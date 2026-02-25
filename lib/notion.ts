import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID!;

export async function getAllPosts() {
  try {
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Published",
        checkbox: { equals: true }, // Prende solo i post con la spunta "Published"
      },
      sorts: [{ property: "Date", direction: "descending" }],
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Name.title[0]?.plain_text || "Senza titolo",
      slug: page.properties.Slug.rich_text[0]?.plain_text || "no-slug",
      date: page.properties.Date.date?.start || "",
      description: page.properties.Description.rich_text[0]?.plain_text || "",
    }));
  } catch (error) {
    console.error("Errore Notion:", error);
    return [];
  }
}