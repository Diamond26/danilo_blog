export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container hero-content">
        <p className="hero-overline">Psicologo &middot; Psicoterapeuta</p>
        <h1 className="hero-title">
          Danilo
          <br />
          Littarru
        </h1>
        <p className="hero-subtitle">
          Ti accompagno in un percorso personalizzato di supporto psicologico ed
          educativo, fondato su competenza clinica, esperienza nel mondo
          scolastico ed empatia autentica.
        </p>
        <div className="hero-actions">
          <a href="#contatti" className="btn btn--primary">
            Prenota un colloquio
          </a>
          <a href="#chi-sono" className="btn btn--outline">
            Scopri di più
          </a>
        </div>
      </div>
    </section>
  );
}
