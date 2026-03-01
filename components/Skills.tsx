const skills = [
  {
    title: "Disturbi Specifici dell'Apprendimento (DSA)",
    description:
      "Valutazione e supporto per difficoltà di lettura, scrittura e calcolo. Interventi personalizzati per favorire autonomia, metodo di studio e inclusione scolastica.",
  },
  {
    title: "ADHD e Disturbi dell'Attenzione",
    description:
      "Percorsi mirati per migliorare concentrazione, autoregolazione, gestione dell'impulsività e organizzazione delle attività scolastiche e quotidiane.",
  },
  {
    title: "Disturbo dello Spettro Autistico (ASD) e Neurodivergenze",
    description:
      "Interventi psico-educativi individualizzati per sostenere lo sviluppo delle competenze sociali, comunicative e relazionali, in collaborazione con famiglia e scuola.",
  },
  {
    title: "Ansia, Regolazione Emotiva e Rabbia",
    description:
      "Strumenti concreti per aiutare bambini e adolescenti a riconoscere e gestire ansia, paure, rabbia e difficoltà emotive, rafforzando autostima e sicurezza personale.",
  },
  {
    title: "Difficoltà Comportamentali (DOP, DC)",
    description:
      "Intervento su comportamenti oppositivi, provocatori o aggressivi, lavorando sulle cause profonde del disagio e costruendo strategie educative condivise con la famiglia.",
  },
  {
    title: "Supporto Genitoriale",
    description:
      "Accompagnamento ai genitori nella comprensione delle dinamiche evolutive, nella gestione delle difficoltà quotidiane e nella costruzione di un ambiente familiare sereno e coerente.",
  },
];

export default function Skills() {
  return (
    <section className="section" id="competenze">
      <div className="container">
        <div className="section-label">Competenze</div>
        <h2 className="section-title">Aree di intervento</h2>
        <div className="skills-grid">
          {skills.map((skill) => (
            <div key={skill.title} className="skill-card">
              <h3>{skill.title}</h3>
              <p>{skill.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
