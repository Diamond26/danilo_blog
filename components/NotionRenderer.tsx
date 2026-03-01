import Image from "next/image";
import React from "react";
import type { NotionBlock, NotionRichText } from "@/lib/types";

/**
 * Renderizza un singolo segmento di rich text Notion,
 * preservando line break (\n → <br />), annotazioni e link.
 */
function renderTextSegment(text: NotionRichText, i: number): React.ReactNode {
  // 1. Gestione dei line break interni (\n → <br />)
  const parts = text.plain_text.split("\n");
  let content: React.ReactNode =
    parts.length > 1
      ? parts.map((part, j) => (
        <React.Fragment key={j}>
          {part}
          {j < parts.length - 1 && <br />}
        </React.Fragment>
      ))
      : text.plain_text;

  // 2. Annotazioni Notion
  if (text.annotations.bold) content = <strong>{content}</strong>;
  if (text.annotations.italic) content = <em>{content}</em>;
  if (text.annotations.underline) content = <u>{content}</u>;
  if (text.annotations.strikethrough) content = <s>{content}</s>;
  if (text.annotations.code)
    content = <code>{content}</code>;

  // 3. Colore personalizzato Notion
  if (text.annotations.color && text.annotations.color !== "default") {
    const color = text.annotations.color;
    const isBackground = color.endsWith("_background");
    const style: React.CSSProperties = isBackground
      ? { backgroundColor: notionColorMap[color] || "inherit", padding: "0.1em 0.2em", borderRadius: "3px" }
      : { color: notionColorMap[color] || "inherit" };
    content = <span style={style}>{content}</span>;
  }

  // 4. Link
  if (text.href) {
    content = (
      <a href={text.href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return <React.Fragment key={i}>{content}</React.Fragment>;
}

/** Mappa colori Notion → CSS */
const notionColorMap: Record<string, string> = {
  gray: "#9b9a97",
  brown: "#64473a",
  orange: "#d9730d",
  yellow: "#dfab01",
  green: "#0f7b6c",
  blue: "#0b6e99",
  purple: "#6940a5",
  pink: "#ad1a72",
  red: "#e03e3e",
  gray_background: "#ebeced",
  brown_background: "#e9e5e3",
  orange_background: "#faebdd",
  yellow_background: "#fbf3db",
  green_background: "#ddedea",
  blue_background: "#ddebf1",
  purple_background: "#eae4f2",
  pink_background: "#f4dfeb",
  red_background: "#fbe4e4",
};

/**
 * Renderizza un array di rich text Notion (usato anche esternamente per l'excerpt).
 */
export function renderRichText(richTexts: NotionRichText[]): React.ReactNode {
  if (!richTexts || richTexts.length === 0) return null;
  return richTexts.map((text, i) => renderTextSegment(text, i));
}

/* ─────────────────────────────────────────────
   Rendering dei blocchi Notion
   ───────────────────────────────────────────── */

function renderBlock(block: NotionBlock): React.ReactNode {
  const { id, type } = block;
  const value = block[type] as any;
  if (!value) return null;

  switch (type) {
    case "paragraph":
      if (!value.rich_text?.length)
        return <div key={id} className="notion-empty-line" />;
      return <p key={id}>{renderRichText(value.rich_text)}</p>;

    case "heading_1":
      return (
        <h2 key={id} className="heading-1">
          {renderRichText(value.rich_text)}
        </h2>
      );

    case "heading_2":
      return <h3 key={id}>{renderRichText(value.rich_text)}</h3>;

    case "heading_3":
      return <h4 key={id}>{renderRichText(value.rich_text)}</h4>;

    case "bulleted_list_item":
      return <li key={id}>{renderRichText(value.rich_text)}</li>;

    case "numbered_list_item":
      return <li key={id}>{renderRichText(value.rich_text)}</li>;

    case "to_do":
      return (
        <div key={id} className="notion-todo">
          <input type="checkbox" checked={value.checked} readOnly />
          <span>{renderRichText(value.rich_text)}</span>
        </div>
      );

    case "toggle":
      return (
        <details key={id}>
          <summary>{renderRichText(value.rich_text)}</summary>
        </details>
      );

    case "quote":
      return (
        <blockquote key={id}>{renderRichText(value.rich_text)}</blockquote>
      );

    case "divider":
      return <hr key={id} />;

    case "image": {
      const src =
        value.type === "external" ? value.external?.url : value.file?.url;
      const caption = value.caption?.[0]?.plain_text || "";
      if (!src) return null;
      return (
        <figure key={id} className="notion-image">
          <Image
            src={src}
            alt={caption || "Immagine articolo"}
            width={740}
            height={420}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "var(--radius-lg)",
            }}
          />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    }

    case "callout":
      return (
        <div key={id} className="notion-callout">
          {value.icon?.emoji && (
            <span className="notion-callout-icon">{value.icon.emoji}</span>
          )}
          <div>{renderRichText(value.rich_text)}</div>
        </div>
      );

    case "code":
      return (
        <pre key={id} className="notion-code">
          <code>
            {value.rich_text?.map((t: NotionRichText) => t.plain_text).join("")}
          </code>
        </pre>
      );

    default:
      return null;
  }
}

/**
 * Raggruppa list items consecutivi in <ul>/<ol> per riprodurre
 * fedelmente la struttura Notion (che non ha un blocco "lista" esplicito).
 */
function groupBlocks(blocks: NotionBlock[]): React.ReactNode[] {
  const result: React.ReactNode[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block.type === "bulleted_list_item") {
      const items: React.ReactNode[] = [];
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(renderBlock(blocks[i]));
        i++;
      }
      result.push(<ul key={`ul-${i}`}>{items}</ul>);
      continue;
    }

    if (block.type === "numbered_list_item") {
      const items: React.ReactNode[] = [];
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        items.push(renderBlock(blocks[i]));
        i++;
      }
      result.push(<ol key={`ol-${i}`}>{items}</ol>);
      continue;
    }

    result.push(renderBlock(block));
    i++;
  }

  return result;
}

export default function NotionRenderer({
  blocks,
}: {
  blocks: NotionBlock[];
}) {
  return <div className="post-detail-content">{groupBlocks(blocks)}</div>;
}
