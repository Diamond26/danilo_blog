export default function BlogPostLoading() {
  return (
    <div className="post-detail" style={{ paddingTop: "calc(var(--header-h) + var(--space-3xl))" }}>
      <div className="skeleton skeleton--text" style={{ width: "120px", marginBottom: "var(--space-3xl)" }} />
      <div className="skeleton skeleton--text" style={{ width: "80px", marginBottom: "var(--space-lg)" }} />
      <div className="skeleton skeleton--heading" style={{ marginBottom: "var(--space-lg)" }} />
      <div className="skeleton skeleton--text" style={{ width: "200px", marginBottom: "var(--space-2xl)" }} />
      <div className="skeleton skeleton--image" style={{ marginBottom: "var(--space-2xl)" }} />
      <div className="skeleton skeleton--text" style={{ marginBottom: "0.75rem" }} />
      <div className="skeleton skeleton--text" style={{ marginBottom: "0.75rem" }} />
      <div className="skeleton skeleton--text" style={{ width: "75%", marginBottom: "2rem" }} />
      <div className="skeleton skeleton--text" style={{ marginBottom: "0.75rem" }} />
      <div className="skeleton skeleton--text" style={{ width: "60%" }} />
    </div>
  );
}
