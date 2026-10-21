"use client";
import { useEffect, useState } from "react";
import { LockKeyhole, ArrowRight, ShieldCheck, LogOut } from "lucide-react";
import { StudentShell } from "@/components/shell";
import { Chat } from "@/components/chat";
import { useStore } from "@/lib/store";
export default function Tracking() {
  const { requests, ready, update } = useStore();
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [access, setAccess] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("tracking-session");
      if (raw) {
        const saved = JSON.parse(raw);
        if (requests.some((r) => r.id === saved.id && r.pin === saved.pin))
          setAccess(saved.id);
      }
    } catch {}
  }, [requests]);
  const r = requests.find((r) => r.id === access);
  return (
    <StudentShell>
      {!r ? (
        <section className="tracking-login">
          <span className="large-icon blue">
            <LockKeyhole size={30} />
          </span>
          <span className="eyebrow">Seu espaço, no seu tempo</span>
          <h1>Acompanhe seu pedido</h1>
          <p>Use o código e o PIN que você guardou.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const found = requests.find(
                (x) => x.id === code.trim().toUpperCase() && x.pin === pin,
              );
              if (!found) {
                setError("Código ou PIN incorreto. Confira os dois campos.");
                return;
              }
              setError("");
              setAccess(found.id);
              sessionStorage.setItem(
                "tracking-session",
                JSON.stringify({ id: found.id, pin: found.pin }),
              );
            }}
          >
            <label>
              Código do pedido
              <input
                autoComplete="off"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Ex.: AZUL-4827"
                required
              />
            </label>
            <label>
              PIN de quatro números
              <input
                autoComplete="off"
                inputMode="numeric"
                type="password"
                maxLength={4}
                pattern="[0-9]{4}"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="••••"
                required
              />
            </label>
            {error && (
              <p role="alert" className="error">
                {error}
              </p>
            )}
            <button className="primary full" disabled={!ready}>
              Acessar conversa
              <ArrowRight size={17} />
            </button>
          </form>
          <p className="privacy-note">
            <ShieldCheck size={17} />
            Seu nome só aparece para a equipe se você tiver escolhido
            informá-lo.
          </p>
          <details className="demo-credentials">
            <summary>Acesso de demonstração</summary>
            <p>
              Código: <strong>AZUL-4827</strong>
              <br />
              PIN: <strong>1234</strong>
              <br />
              Use somente dados fictícios.
            </p>
          </details>
        </section>
      ) : (
        <>
          <div className="row-between">
            <span className="eyebrow">{r.id}</span>
            <button
              className="text-button"
              onClick={() => {
                setAccess("");
                setPin("");
                sessionStorage.removeItem("tracking-session");
              }}
            >
              <LogOut size={15} />
              Sair da conversa
            </button>
          </div>
          <h1>Você tem com quem contar.</h1>
          <div className="tracking-summary">
            <span className="badge blue">{r.status}</span>
            <span>
              Responsável: <strong>{r.adult}</strong>
            </span>
          </div>
          {r.appointment && (
            <p className="notice">
              Conversa marcada:{" "}
              {new Date(r.appointment).toLocaleString("pt-BR")} · local
              combinado com a equipe.
            </p>
          )}
          <Chat request={r} from="aluno" />
          <section className="feedback panel">
            <h2>Depois do atendimento, você está se sentindo mais seguro?</h2>
            <p>Como você está hoje também importa.</p>
            <div className="feedback-options">
              {["Sim", "Um pouco", "Ainda não"].map((v) => (
                <button
                  key={v}
                  aria-pressed={r.feedback === v}
                  className={r.feedback === v ? "chosen" : ""}
                  onClick={() =>
                    update(
                      r.id,
                      {
                        feedback: v,
                        ...(v === "Ainda não"
                          ? {
                              priority:
                                r.priority === "Urgente"
                                  ? ("Urgente" as const)
                                  : ("Alta" as const),
                              status: "Em acompanhamento" as const,
                            }
                          : {}),
                      },
                      v === "Ainda não"
                        ? "Estudante ainda não se sente seguro. Prioridade aumentada e acompanhamento reaberto."
                        : `Retorno do estudante: ${v}.`,
                    )
                  }
                >
                  {v}
                </button>
              ))}
            </div>
            {r.feedback && (
              <p role="status" className="muted">
                {r.feedback === "Ainda não"
                  ? "Obrigado por contar. A equipe verá seu pedido com prioridade maior."
                  : "Obrigado por compartilhar como você está."}
              </p>
            )}
          </section>
          <p className="notice">
            Este canal é acompanhado nos horários definidos pela escola. Em uma
            emergência imediata, procure um adulto próximo ou o serviço de
            emergência da sua região.
          </p>
        </>
      )}
    </StudentShell>
  );
}
