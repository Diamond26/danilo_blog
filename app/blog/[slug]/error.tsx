"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Errore pagina blog:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-body)",
        color: "var(--c-text)",
        background: "var(--c-bg)",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
          fontWeight: 400,
          marginBottom: "1rem",
        }}
      >
        Articolo non disponibile
      </h1>
      <p
        style={{
          fontSize: "var(--fs-md)",
          color: "var(--c-text-soft)",
          marginBottom: "2rem",
          maxWidth: "440px",
        }}
      >
        L&apos;articolo potrebbe essere stato rimosso o aggiornato. Prova a
        ricaricare la pagina.
      </p>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={reset} className="btn btn--primary">
          Riprova
        </button>
        <Link href="/#articoli" className="btn btn--outline">
          Torna agli articoli
        </Link>
      </div>
    </div>
  );
}
