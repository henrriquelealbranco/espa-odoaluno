"use client";
import { useState } from "react";
import { BookOpen, ArrowLeft, CheckCircle2 } from "lucide-react";
import { StudentShell } from "@/components/shell";
const materials = [
  {
    title: "Uma pausa para respirar",
    category: "Para o seu dia",
    text: "Pare por um instante e apoie os pés no chão. Inspire devagar, conte até três e solte o ar com calma. Repita algumas vezes, no seu ritmo. Se quiser companhia, converse com uma pessoa de confiança.",
  },
  {
    title: "Leitura: um mundo de histórias",
    category: "Língua portuguesa",
    text: "Escolha um livro da biblioteca e leia os capítulos 5 e 6. Anote o nome do personagem principal, o lugar em que a história acontece e uma pergunta que você faria ao autor. Leve suas anotações para nossa roda de leitura.",
  },
  {
    title: "Matemática no cotidiano",
    category: "Matemática",
    text: "Observe três situações do seu dia em que aparecem números. Pode ser uma receita, o tempo de um percurso ou o preço de um produto. Resolva os exercícios 1 a 5 do capítulo 4 e anote suas dúvidas para a próxima aula.",
  },
  {
    title: "Cuidar das nossas amizades",
    category: "Convivência",
    text: "Uma amizade tem espaço para ouvir, respeitar diferenças e dizer como você se sente. Se uma brincadeira deixa alguém desconfortável, é hora de parar. Você pode chamar um adulto de confiança para ajudar na conversa.",
  },
];
export default function Page() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <StudentShell>
      <a href="/aluno" className="back-button">
        <ArrowLeft size={16} />
        Voltar
      </a>
      {open === null ? (
        <>
          <span className="eyebrow">Feito pela sua escola</span>
          <h1>Conteúdos para descobrir</h1>
          <p className="lead">Aprender, fazer uma pausa e cuidar do seu dia.</p>
          <div className="materials">
            {materials.map((m, i) => (
              <button
                className="material-card"
                key={m.title}
                onClick={() => setOpen(i)}
              >
                <span className={`action-icon ${i % 2 ? "green" : "blue"}`}>
                  <BookOpen />
                </span>
                <small>{m.category} · 3 min de leitura</small>
                <h2>{m.title}</h2>
                <span className="text-link">Abrir conteúdo →</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <article className="reading">
          <button className="back-button" onClick={() => setOpen(null)}>
            <ArrowLeft size={16} />
            Todos os conteúdos
          </button>
          <span className="eyebrow">{materials[open].category}</span>
          <h1>{materials[open].title}</h1>
          <p>{materials[open].text}</p>
          <p className="notice">
            <CheckCircle2 size={18} />
            Material demonstrativo preparado para esta experiência escolar.
          </p>
        </article>
      )}
    </StudentShell>
  );
}
