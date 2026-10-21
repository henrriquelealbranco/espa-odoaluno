"use client";
import type { Request } from "@/lib/model";
function Bars({ data }: { data: [string, number][] }) {
  const max = Math.max(...data.map((d) => d[1]), 1);
  return (
    <div className="bars">
      {data.map(([name, n]) => (
        <div className="bar-item" key={name}>
          <div>
            <span>{name}</span>
            <strong>{n}</strong>
          </div>
          <div className="bar-track">
            <span style={{ width: `${(n / max) * 100}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
export function Indicators({ requests }: { requests: Request[] }) {
  const counts = (key: (r: Request) => string) => {
    const values: Record<string, number> = {};
    requests.forEach((r) => {
      const v = key(r) || "Não informado";
      values[v] = (values[v] || 0) + 1;
    });
    return Object.entries(values);
  };
  const answered = requests.filter((r) => r.feedback);
  const safe = answered.filter((r) => r.feedback === "Sim").length;
  return (
    <>
      <div className="indicator-grid">
        <section className="panel">
          <h2>Pedidos por semana</h2>
          <p className="muted">Pedidos locais agrupados por semana</p>
          <Bars
            data={counts((r) => {
              const d = new Date(r.created);
              d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
              return `Semana de ${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}`;
            })}
          />
        </section>
        <section className="panel">
          <h2>Locais mais mencionados</h2>
          <p className="muted">Informações agregadas dos pedidos</p>
          <Bars data={counts((r) => r.answers.local)} />
        </section>
        <section className="panel">
          <h2>Tipos de situação</h2>
          <p className="muted">Categorias escolhidas pelos estudantes</p>
          <Bars
            data={counts((r) =>
              r.category.replace("Quero ", "").replace("Estou ", ""),
            )}
          />
        </section>
        <section className="panel">
          <h2>Tempo de resposta</h2>
          <p className="muted">Cenário fictício para apresentação</p>
          <Bars
            data={[
              ["Até 1 hora", 3],
              ["De 1 a 3 horas", 4],
              ["No próximo período", 1],
            ]}
          />
          <p className="metric-foot">
            Média simulada: <strong>1h 24min</strong>
          </p>
        </section>
        <section className="panel indicator-big">
          <span className="eyebrow">Percepção após o atendimento</span>
          <strong>
            {answered.length ? Math.round((safe / answered.length) * 100) : 0}%
          </strong>
          <h2>Disseram estar mais seguros</h2>
          <p className="muted">
            {safe} de {answered.length} respostas locais recebidas.
          </p>
        </section>
        <section className="panel indicator-big warm">
          <span className="eyebrow">A escuta continua</span>
          <strong>
            {requests.filter((r) => r.feedback === "Ainda não").length}
          </strong>
          <h2>Precisaram de novo acompanhamento</h2>
          <p className="muted">Pedidos com retorno “Ainda não”.</p>
        </section>
      </div>
      <p className="notice">
        Indicadores agregados. Os dados não identificam estudantes. Tempos de
        resposta são exemplos ilustrativos, sem garantia de atendimento.
      </p>
    </>
  );
}
