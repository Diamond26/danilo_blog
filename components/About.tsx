import Image from "next/image";

const qualifiche = [
  { year: "2006", text: "Laurea in Psicologia Clinica e di Comunità" },
  { year: "2011", text: "Specializzazione in Psicoterapia" },
  { year: "OGGI", text: "Psicologo Scolastico e Libero Professionista" },
];

export default function About() {
  return (
    <section className="section" id="chi-sono">
      <div className="container">
        <div className="about-grid">
          <div className="about-image-wrapper">
            <Image
              src="/img/danilo.png"
              alt="Dr. Danilo Littarru"
              width={520}
              height={650}
              className="about-photo"
            />
          </div>

          <div className="about-details">
            <div className="section-label">Profilo</div>
            <h2 className="section-title">Chi sono</h2>

            <div className="prose">
              <h3
                style={{
                  marginBottom: "0.5rem",
                  color: "var(--c-accent)",
                }}
              >
                Dr. Danilo Littarru
              </h3>
              <p
                style={{
                  fontSize: "var(--fs-md)",
                  fontWeight: 500,
                  color: "var(--c-text)",
                  marginBottom: "2rem",
                }}
              >
                Psicologo Clinico e della Riabilitazione, Pedagogista ad
                indirizzo psico-educativo, esperto dell&apos;età evolutiva e dei
                Disturbi Specifici dell&apos;Apprendimento (DSA), con
                particolare attenzione a bullismo e cyberbullismo.
              </p>

              <p>
                Sono iscritto all&apos;Ordine degli Psicologi della Sardegna (n.
                3946) e all&apos;Associazione Nazionale Pedagogisti Italiani
                (ANPE). Da oltre venticinque anni insegno in scuole statali e di
                formazione superiore, affiancando all&apos;attività didattica un
                costante impegno clinico e riabilitativo.
              </p>

              <p>
                La mia formazione comprende la laurea in Psicologia, la
                specializzazione in Psicologia Clinica e Riabilitativa, con
                competenze nella valutazione, diagnosi e trattamento di
                disabilità cognitive, emozionali e psichiche. Ho conseguito la
                laurea con 110/110 e lode e due Master in &ldquo;Handicap e
                Integrazione&rdquo; presso l&apos;Università Europea di Roma
                (70/70), oltre a un Master in Psicologia dell&apos;infanzia e
                dell&apos;adolescenza con titolo di eccellenza accademica.
              </p>

              <p>
                Mi sono specializzato nell&apos;accompagnamento di bambini in
                età prescolare e scolare, adolescenti e adulti, con particolare
                attenzione alle neurodivergenze: DSA, ADHD, Disturbo dello
                Spettro Autistico (ASD), disturbi del linguaggio e altre
                differenze neurologiche. Lavoro anche con le famiglie,
                intervenendo sulle dinamiche relazionali che possono influire sul
                benessere del bambino o dell&apos;adolescente.
              </p>

              <p>
                Il mio approccio è integrato e personalizzato: unisco interventi
                psico-riabilitativi, supporto psico-educativo e tecniche di
                rilassamento — in particolare il training autogeno — per
                promuovere il benessere emotivo e sociale. Empatia e ascolto
                attivo sono alla base del mio agire professionale, con
                l&apos;obiettivo di costruire percorsi realmente su misura.
              </p>

              <p>
                Collaboro con scuole, servizi sociali ed educatori per
                progettare interventi individualizzati e promuovere
                un&apos;educazione inclusiva. Sono inoltre giornalista e
                divulgatore in ambito psico-pedagogico, curando rubriche su
                testate dedicate a psicologia ed educazione. Sono preparatore
                mentale certificato dalla Federazione Italiana Tennis e Padel.
              </p>

              <p>
                Metto a disposizione la mia esperienza per chi desidera
                affrontare in modo concreto e personalizzato difficoltà
                psicologiche, educative e relazionali, promuovendo integrazione,
                valorizzazione delle differenze e un ambiente familiare più
                sereno.
              </p>
            </div>

            <div className="qualifiche">
              {qualifiche.map((q) => (
                <div key={q.year} className="qualifica">
                  <span className="qualifica-year">{q.year}</span>
                  <span className="qualifica-text">{q.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
