"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CalendarDays,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Calculator,
  ArrowRight,
  Check,
  Sun,
} from "lucide-react";
import { StudentShell, DemoBar } from "./shell";
import { HelpFlow } from "./support-flow";
export function StudentHome() {
  const [mood, setMood] = useState("");
  const [flow, setFlow] = useState(false);
  useEffect(() => {
    setMood(localStorage.getItem("student-mood") || "");
  }, []);
  return (
    <>
      <StudentShell>
        {flow ? (
          <HelpFlow onClose={() => setFlow(false)} />
        ) : (
          <>
            <div className="home-greeting">
              <span className="eyebrow">
                <Sun size={14} /> Um dia de cada vez
              </span>
              <h1>Olá! Este é o seu espaço.</h1>
              <p>Como você está se sentindo hoje?</p>
            </div>
            <div
              className="moods"
              aria-label="Como você está se sentindo hoje?"
            >
              {["Muito bem", "Bem", "Mais ou menos", "Mal", "Muito mal"].map(
                (label, i) => (
                  <button
                    key={label}
                    className={`mood ${mood === label ? "selected" : ""}`}
                    aria-pressed={mood === label}
                    onClick={() => {
                      setMood(label);
                      localStorage.setItem("student-mood", label);
                    }}
                  >
                    <span className={`face face-${i}`}>
                      <svg viewBox="0 0 60 60" aria-hidden="true">
                        <circle cx="21" cy="23" r="2.1" />
                        <circle cx="39" cy="23" r="2.1" />
                        {i < 2 ? (
                          <path
                            d={
                              i === 0
                                ? "M20 34 Q30 47 40 34"
                                : "M22 35 Q30 43 38 35"
                            }
                          />
                        ) : i === 2 ? (
                          <path d="M23 37 L37 37" />
                        ) : (
                          <path
                            d={
                              i === 3
                                ? "M22 40 Q30 29 38 40"
                                : "M20 40 Q30 25 40 40"
                            }
                          />
                        )}
                      </svg>
                      {mood === label && (
                        <span className="mood-check">
                          <Check size={12} />
                        </span>
                      )}
                    </span>
                    <span>{label}</span>
                  </button>
                ),
              )}
            </div>
            {mood && (
              <p role="status" className="mood-saved">
                Obrigado por compartilhar. Este espaço é seu.
              </p>
            )}
            <div className="home-actions">
              <Link href="/atividades" className="action-card green">
                <span className="action-icon">
                  <CalendarDays />
                </span>
                <span>
                  <strong>Organizar meu dia</strong>
                  <small>Veja atividades e compromissos.</small>
                </span>
                <ChevronRight size={20} />
              </Link>
              <Link href="/conteudos" className="action-card peach">
                <span className="action-icon">
                  <BookOpen />
                </span>
                <span>
                  <strong>Ver conteúdos</strong>
                  <small>Encontre materiais preparados pela escola.</small>
                </span>
                <ChevronRight size={20} />
              </Link>
              <button
                aria-label="Conversar com alguém"
                className="action-card blue"
                onClick={() => setFlow(true)}
              >
                <span className="action-icon">
                  <MessageSquare />
                </span>
                <span>
                  <strong>Conversar com alguém</strong>
                  <small>
                    Peça um momento reservado com uma pessoa de confiança.
                  </small>
                </span>
                <ChevronRight size={20} />
              </button>
            </div>
            <section className="week-section">
              <div className="row-between">
                <h2>Sua semana</h2>
                <Link href="/atividades">
                  Ver todas <ArrowRight size={14} />
                </Link>
              </div>
              <Link href="/atividades" className="week-card">
                <span className="mini-icon blue">
                  <Calculator size={23} />
                </span>
                <span>
                  <strong>
                    Matemática <span>· Amanhã</span>
                  </strong>
                  <small>Lista de exercícios — Capítulo 4</small>
                </span>
                <ChevronRight size={18} />
              </Link>
              <Link href="/conteudos" className="week-card">
                <span className="mini-icon blue">
                  <BookOpen size={23} />
                </span>
                <span>
                  <strong>
                    Leitura <span>· Quinta-feira</span>
                  </strong>
                  <small>Capítulos 5 e 6</small>
                </span>
                <ChevronRight size={18} />
              </Link>
            </section>
            <p className="home-footnote">Seu ritmo. Seu dia. Seu espaço.</p>
          </>
        )}
      </StudentShell>
      <DemoBar />
    </>
  );
}
