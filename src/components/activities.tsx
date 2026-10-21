"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  CalendarDays,
  BookOpen,
  Calculator,
  FlaskConical,
  Palette,
  Check,
  ArrowRight,
  Megaphone,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { StudentShell } from "./shell";
const tasks = [
  {
    subject: "Matemática",
    title: "Lista de exercícios — Capítulo 4",
    due: "Amanhã",
    icon: Calculator,
    color: "blue",
  },
  {
    subject: "Língua portuguesa",
    title: "Leitura dos capítulos 5 e 6",
    due: "Quinta-feira",
    icon: BookOpen,
    color: "green",
  },
  {
    subject: "Ciências",
    title: "Diário de observação: as plantas",
    due: "Sexta-feira",
    icon: FlaskConical,
    color: "peach",
  },
  {
    subject: "Artes",
    title: "Meu lugar preferido em cores",
    due: "Sexta-feira",
    icon: Palette,
    color: "lilac",
  },
];
export function Activities() {
  const [done, setDone] = useState<number[]>([]);
  const [day, setDay] = useState(1);
  const router = useRouter();
  const taps = useRef<number[]>([]);
  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem("school-tasks") || "[]"));
    } catch {}
  }, []);
  return (
    <StudentShell wide>
      <div className="page-topline">
        <span className="eyebrow">Aprender um pouco a cada dia</span>
        <span className="muted">Semana de 19 a 23 de outubro</span>
      </div>
      <h1>Meu dia na escola</h1>
      <p className="lead">Tudo no seu tempo. Vamos organizar a semana?</p>
      <div className="activities-grid">
        <section>
          <div className="row-between">
            <h2>Próximas atividades</h2>
            <span className="muted">{done.length} de 4 feitas</span>
          </div>
          <div className="progress">
            <span style={{ width: `${done.length * 25}%` }} />
          </div>
          <div className="task-list">
            {tasks.map((t, i) => (
              <article
                className={`task-card ${done.includes(i) ? "completed" : ""}`}
                key={t.subject}
              >
                <span className={`action-icon ${t.color}`}>
                  <t.icon />
                </span>
                <div>
                  <span className="eyebrow">{t.subject}</span>
                  <h3>{t.title}</h3>
                  <small>
                    <Clock size={13} />
                    {t.due}
                  </small>
                </div>
                <button
                  className="task-check"
                  aria-label={`${done.includes(i) ? "Reabrir" : "Concluir"} ${t.subject}`}
                  aria-pressed={done.includes(i)}
                  onClick={() =>
                    setDone((old) => {
                      const next = old.includes(i)
                        ? old.filter((n) => n !== i)
                        : [...old, i];
                      localStorage.setItem(
                        "school-tasks",
                        JSON.stringify(next),
                      );
                      return next;
                    })
                  }
                >
                  {done.includes(i) && <Check size={18} />}
                </button>
              </article>
            ))}
          </div>
          <h2>Suas matérias</h2>
          <div className="subjects">
            {tasks.map((t) => (
              <Link key={t.subject} href="/conteudos" className={t.color}>
                <t.icon size={23} />
                <strong>{t.subject}</strong>
                <ArrowRight size={15} />
              </Link>
            ))}
          </div>
        </section>
        <aside>
          <section className="panel calendar">
            <div className="row-between">
              <h2>
                <CalendarDays size={19} />
                Sua semana
              </h2>
              <small>OUTUBRO</small>
            </div>
            <div className="days">
              {["Seg", "Ter", "Qua", "Qui", "Sex"].map((x, i) => (
                <button
                  key={x}
                  className={day === i ? "active" : ""}
                  onClick={() => setDay(i)}
                >
                  <small>{x}</small>
                  <strong>{19 + i}</strong>
                </button>
              ))}
            </div>
            <div className="calendar-event">
              <span className="dot blue" />
              <span>
                <strong>
                  {
                    [
                      "Aula de artes",
                      "Matemática",
                      "Clube de leitura",
                      "Leitura em grupo",
                      "Feira de ciências",
                    ][day]
                  }
                </strong>
                <small>10:30 · Sala {day + 1}</small>
              </span>
            </div>
            <div className="calendar-event">
              <span className="dot green" />
              <span>
                <strong>Atividade na biblioteca</strong>
                <small>14:00 · Espaço de leitura</small>
              </span>
            </div>
          </section>
          <section className="panel school-notice">
            <span className="mini-icon peach">
              <Megaphone size={22} />
            </span>
            <h2>Acontece na escola</h2>
            <p>
              Na sexta, nossa biblioteca recebe uma troca de livros. Traga uma
              história que você já leu!
            </p>
            <small>Aviso fictício da coordenação</small>
          </section>
        </aside>
      </div>
      <footer className="neutral-footer">
        <span>Espaço do Aluno · Aprender e descobrir</span>
        <button
          aria-label="Estrela"
          onClick={() => {
            const time = Date.now();
            taps.current = [
              ...taps.current.filter((t) => time - t < 1200),
              time,
            ];
            if (taps.current.length >= 3) router.replace("/aluno");
          }}
        >
          <Star size={17} />
        </button>
      </footer>
    </StudentShell>
  );
}
