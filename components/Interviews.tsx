const interviews = [
    {
        id: "YnZpm4GCwtE",
        title: "Interazioni — Puntata 27",
        description:
            "In questa puntata abbiamo continuato a sviscerare il precetto Rispetta la Fede Religiosa degli Altri.",
    },
    {
        id: "xDWlDoqpafE",
        title: "Interazioni — Puntata 4",
        description:
            "Una puntata dedicata ai più piccoli e agli adolescenti: Ama e Aiuta i Bambini.",
    },
];

export default function Interviews() {
    return (
        <section className="section" id="interviste">
            <div className="container">
                <div className="section-label">Media</div>
                <h2 className="section-title">Interviste</h2>
                <p className="section-intro">
                    Alcune delle mie partecipazioni televisive e interviste sul tema della
                    psicologia, della fede e dell&apos;educazione.
                </p>

                <div className="interviews-grid">
                    {interviews.map((video) => (
                        <div key={video.id} className="interview-card">
                            <div className="interview-video">
                                <iframe
                                    src={`https://www.youtube.com/embed/${video.id}`}
                                    title={video.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </div>
                            <div className="interview-body">
                                <h3 className="interview-title">{video.title}</h3>
                                <p className="interview-desc">{video.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
