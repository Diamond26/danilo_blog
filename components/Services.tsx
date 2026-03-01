const services = [
  {
    title: "Colloquio psicologico",
    description:
      "Un primo incontro conoscitivo per comprendere insieme il tuo bisogno e definire un percorso adatto a te.",
    tag: "Individuale",
  },
  {
    title: "Psicoterapia individuale",
    description:
      "Percorsi strutturati per affrontare problematiche specifiche con strumenti terapeutici mirati.",
    tag: "In studio / Online",
  },
  {
    title: "Sostegno psicologico",
    description:
      "Supporto continuativo per chi sta vivendo un periodo di difficoltà e ha bisogno di uno spazio di ascolto.",
    tag: "Continuativo",
  },
  {
    title: "Consulenza online",
    description:
      "Sedute a distanza con la stessa qualità e riservatezza di un incontro in studio, ovunque tu sia.",
    tag: "Da remoto",
  },
];

export default function Services() {
  return (
    <section className="section section--alt" id="servizi">
      <div className="container">
        <div className="section-label">Servizi</div>
        <h2 className="section-title">Come posso aiutarti</h2>
        <div className="services-list">
          {services.map((service) => (
            <div key={service.title} className="service">
              <div className="service-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <span className="service-tag">{service.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
