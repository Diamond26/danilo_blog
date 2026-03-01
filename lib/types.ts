export interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  cover: string | null;
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
