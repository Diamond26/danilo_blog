import Image from "next/image";
import type { NotionBlock, NotionRichText } from "@/lib/types";

export function renderRichText(richTexts: NotionRichText[]) {
  if (!richTexts || richTexts.length === 0) return null;

  return richTexts.map((text, i) => {
    let content: React.ReactNode = text.plain_text;

    if (text.annotations.bold) content = <strong key={i}>{content}</strong>;
    if (text.annotations.italic) content = <em key={i}>{content}</em>;
    if (text.annotations.underline)
      content = <u key={i}>{content}</u>;
    if (text.annotations.strikethrough)
      content = <s key={i}>{content}</s>;
    if (text.annotations.code)
      content = (
        <code
          key={i}
          style={{
            background: "var(--c-bg-alt)",
            padding: "0.15em 0.4em",
            borderRadius: "3px",
            fontSize: "0.9em",
          }}
        >
          {content}
        </code>
      );

    if (text.href) {
      content = (
        <a key={i} href={text.href} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      );
    }

    return <span key={i}>{content}</span>;
  });
}

function renderBlock(block: NotionBlock) {
  const { id, type } = block;
  const value = block[type] as any;

  if (!value) return null;

  switch (type) {
    case "paragraph":
      if (!value.rich_text?.length) return <br key={id} />;
      return <p key={id}>{renderRichText(value.rich_text)}</p>;

    case "heading_1":
      return <h2 key={id}>{renderRichText(value.rich_text)}</h2>;

    case "heading_2":
      return <h2 key={id}>{renderRichText(value.rich_text)}</h2>;

    case "heading_3":
      return <h3 key={id}>{renderRichText(value.rich_text)}</h3>;

    case "bulleted_list_item":
      return <li key={id}>{renderRichText(value.rich_text)}</li>;

    case "numbered_list_item":
      return <li key={id}>{renderRichText(value.rich_text)}</li>;

    case "quote":
      return (
        <blockquote key={id}>{renderRichText(value.rich_text)}</blockquote>
      );

    case "divider":
      return (
        <hr
          key={id}
          style={{ border: "none", borderTop: "1px solid var(--c-border)", margin: "2em 0" }}
        />
      );

    case "image": {
      const src =
        value.type === "external" ? value.external?.url : value.file?.url;
      const caption = value.caption?.[0]?.plain_text || "";
      if (!src) return null;
      return (
        <figure key={id} style={{ margin: "2em 0" }}>
          <Image
            src={src}
            alt={caption || "Immagine articolo"}
            width={720}
            height={400}
            style={{ width: "100%", height: "auto", borderRadius: "var(--radius-lg)" }}
          />
          {caption && (
            <figcaption
              style={{
                fontSize: "var(--fs-sm)",
                color: "var(--c-text-muted)",
                marginTop: "0.5rem",
                textAlign: "center",
              }}
            >
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case "callout":
      return (
        <div
          key={id}
          style={{
            background: "var(--c-bg-alt)",
            borderRadius: "var(--radius-lg)",
            padding: "1.25rem 1.5rem",
            margin: "1.5em 0",
            display: "flex",
            gap: "0.75rem",
            alignItems: "flex-start",
          }}
        >
          {value.icon?.emoji && <span>{value.icon.emoji}</span>}
          <div>{renderRichText(value.rich_text)}</div>
        </div>
      );

    default:
      return null;
  }
}

/**
 * Raggruppa list items consecutivi in <ul>/<ol>.
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

export default function NotionRenderer({ blocks }: { blocks: NotionBlock[] }) {
  return (
    <div className="post-detail-content">{groupBlocks(blocks)}</div>
  );
}
