import Link from "next/link";

export default function NotFound() {
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
          fontSize: "clamp(2rem, 6vw, 4rem)",
          fontWeight: 400,
          marginBottom: "1rem",
        }}
      >
        404
      </h1>
      <p
        style={{
          fontSize: "var(--fs-md)",
          color: "var(--c-text-soft)",
          marginBottom: "2rem",
        }}
      >
        La pagina che cerchi non esiste.
      </p>
      <Link href="/" className="btn btn--primary">
        Torna alla home
      </Link>
    </div>
  );
}
