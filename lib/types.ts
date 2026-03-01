export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  image: string | null;
  excerpt: string;          // plain text (usato nelle card)
  excerptRaw: NotionRichText[]; // rich text raw (usato nella pagina articolo)
  link: string | null;
}

export interface NotionRichText {
  plain_text: string;
  href: string | null;
  annotations: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    code: boolean;
    color: string;
  };
}

export interface NotionBlock {
  id: string;
  type: string;
  [key: string]: unknown;
}
