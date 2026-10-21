"use client";
import { useState } from "react";
import { Send, LockKeyhole } from "lucide-react";
import { useStore } from "@/lib/store";
import { now, type Request } from "@/lib/model";
export function Chat({
  request,
  from,
}: {
  request: Request;
  from: "aluno" | "equipe";
}) {
  const [text, setText] = useState("");
  const { update } = useStore();
  return (
    <section className="chat">
      <div className="chat-heading">
        <LockKeyhole size={17} />
        <strong>Conversa com a equipe</strong>
        <span className="badge green">Reservada</span>
      </div>
      <div className="messages" aria-live="polite">
        {!request.messages.length && (
          <p className="chat-empty">
            Sua conversa começa aqui. A equipe poderá responder durante os
            horários da escola.
          </p>
        )}
        {request.messages.map((m) => (
          <div key={m.id} className={`message ${m.from === from ? "own" : ""}`}>
            <small>
              {m.from === "equipe" ? "Equipe escolar" : "Estudante"}
            </small>
            <p>{m.text}</p>
            <time>
              {new Date(m.date).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </time>
          </div>
        ))}
      </div>
      <form
        className="message-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          update(
            request.id,
            {
              messages: [
                ...request.messages,
                {
                  id: crypto.randomUUID(),
                  from,
                  text: text.trim(),
                  date: now(),
                },
              ],
            },
            from === "equipe"
              ? "Equipe enviou uma mensagem."
              : "Estudante enviou uma mensagem.",
          );
          setText("");
        }}
      >
        <label className="sr-only" htmlFor={`message-${from}`}>
          Sua mensagem
        </label>
        <textarea
          id={`message-${from}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={3000}
          placeholder="Escreva sua mensagem…"
          rows={2}
        />
        <button
          className="primary"
          type="submit"
          disabled={!text.trim()}
          aria-label="Enviar mensagem"
        >
          <Send size={19} />
          <span>Enviar</span>
        </button>
      </form>
    </section>
  );
}
