"use client";

import { useState, type FormEvent } from "react";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        console.error("Errore invio:", result.error);
        setStatus("error");
      }
    } catch (err) {
      // Nessun log sensibile lato client come richiesto
      setStatus("error");
    }
  }

  function handleChange() {
    if (status === "error" || status === "success") setStatus("idle");
  }

  return (
    <section className="section" id="contatti">
      <div className="container">
        <div className="section-label">Contatti</div>
        <h2 className="section-title">Parliamone</h2>
        <p className="section-intro">
          Per richiedere informazioni o fissare un primo colloquio conoscitivo,
          compili il modulo sottostante.
        </p>

        <div className="contact-layout">
          <form className="contact-form" onSubmit={handleSubmit} onChange={handleChange} noValidate>
            {/* Honeypot field - Nascosto agli utenti, cattura i bot */}
            <div style={{ display: "none" }} aria-hidden="true">
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-name">Nome *</label>
                <input type="text" id="contact-name" name="name" required placeholder="Il tuo nome" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-email">Email *</label>
                <input type="email" id="contact-email" name="email" required placeholder="la-tua@email.it" />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact-tel">Telefono</label>
                <input type="tel" id="contact-tel" name="phone" placeholder="Il tuo numero" />
              </div>
              <div className="form-group">
                <label htmlFor="contact-subject">Motivo del contatto</label>
                <select id="contact-subject" name="subject">
                  <option value="">Seleziona...</option>
                  <option value="info">Informazioni generali</option>
                  <option value="colloquio">Prenotare un colloquio</option>
                  <option value="online">Consulenza online</option>
                  <option value="altro">Altro</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contact-message">Messaggio *</label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                placeholder="Come posso aiutarti?"
              />
            </div>

            <div className="form-privacy">
              <label className="checkbox-label">
                <input type="checkbox" name="privacy" required />
                <span>
                  Ho letto e accetto la{" "}
                  <a href="/privacy" className="link" style={{ color: "var(--c-accent)", textDecoration: "underline", textUnderlineOffset: "2px" }}>
                    privacy policy
                  </a>
                  .
                </span>
              </label>
            </div>

            {status === "success" && (
              <div className="form-status success">
                Messaggio inviato con successo. La ricontatteremo al più presto.
              </div>
            )}
            {status === "error" && (
              <div className="form-status error">
                Si è verificato un errore. Riprovi più tardi o ci contatti
                telefonicamente.
              </div>
            )}

            <button
              type="submit"
              className="btn btn--primary"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Invio in corso..." : "Invia messaggio"}
            </button>
          </form>

          <div className="contact-info">
            <div className="contact-info-item">
              <span className="contact-info-label">Telefono</span>
              <span className="contact-info-value">+39 393 463 5653</span>
            </div>
            <div className="contact-info-item">
              <span className="contact-info-label">Studio</span>
              <span className="contact-info-value">Cagliari, Sardegna</span>
            </div>
            <div className="contact-info-social" style={{ display: "flex", gap: "0.75rem" }}>
              <a
                href="https://www.facebook.com/danilo.littarru/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link--circle"
                title="Facebook"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
                  <path d="M504 256C504 119 393 8 256 8S8 119 8 256c0 123.8 90.7 226.4 209.3 245V327.7h-63V256h63v-54.6c0-62.2 37-96.6 93.7-96.6 27.2 0 55.7 4.9 55.7 4.9V171h-31.3c-30.8 0-40.4 19.1-40.4 38.7V256h68.8l-11 71.7h-57.8V501C413.3 482.4 504 379.8 504 256z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/dr_danilo_littarru_psicologo_/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link--circle"
                title="Instagram"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" fill="currentColor">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.8 9.9 67.6 36.1 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
