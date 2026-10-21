"use client";
import { useState } from "react";
import {
  ArrowLeft,
  UserCheck,
  CalendarDays,
  ClipboardCheck,
  CheckCircle2,
  Paperclip,
  Clock,
  ShieldCheck,
  MessageSquare,
  Save,
} from "lucide-react";
import {
  adults,
  now,
  questions,
  studentName,
  type Request,
  type Status,
} from "@/lib/model";
import { useStore } from "@/lib/store";
import { Chat } from "./chat";
export function CaseDetail({
  request: r,
  onBack,
}: {
  request: Request;
  onBack: () => void;
}) {
  const { update } = useStore();
  const [action, setAction] = useState("");
  const [value, setValue] = useState("");
  const [note, setNote] = useState(r.note);
  const [checks, setChecks] = useState([false, false, false, false]);
  const [reason, setReason] = useState("");
  const [notice, setNotice] = useState("");
  const start = (a: string) => {
    setAction(a);
    setValue(a === "Encaminhar atendimento" ? r.adult : "");
    setNotice("");
  };
  const saveAction = () => {
    if (!value.trim()) return;
    if (action === "Encaminhar atendimento")
      update(r.id, { adult: value }, `Atendimento encaminhado para ${value}.`);
    if (action === "Marcar conversa")
      update(
        r.id,
        { appointment: value },
        `Conversa marcada para ${new Date(value).toLocaleString("pt-BR")}.`,
      );
    if (action === "Agendar acompanhamento")
      update(
        r.id,
        { nextCheck: value, status: "Em acompanhamento" },
        `Acompanhamento agendado para ${new Date(value).toLocaleString("pt-BR")}.`,
      );
    if (action === "Registrar providência")
      update(
        r.id,
        { measures: [...r.measures, { date: now(), text: value }] },
        "Nova providência registrada.",
      );
    setAction("");
    setNotice("Registro salvo.");
  };
  return (
    <>
      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={16} />
        Todos os pedidos
      </button>
      <div className="case-heading">
        <div>
          <span className="eyebrow">Pedido de apoio · {r.id}</span>
          <h1>{studentName(r)}</h1>
          <p>
            {r.category} · {new Date(r.created).toLocaleString("pt-BR")}
          </p>
        </div>
        <span
          className={`badge ${r.priority === "Urgente" ? "red" : r.priority === "Alta" ? "peach" : "sage"}`}
        >
          {r.priority}
        </span>
      </div>
      <div className="case-layout">
        <div className="case-primary">
          <section className="panel">
            <div className="row-between">
              <h2>
                <MessageSquare size={19} />O que o estudante compartilhou
              </h2>
              <span className="badge blue">{r.status}</span>
            </div>
            <dl className="answers">
              {Object.entries(r.answers)
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt>
                      {questions.find((q) => q.key === k)?.title ||
                        {
                          momento: "Melhor momento",
                          preferenciaLocal: "Preferência de local",
                          outroMomento: "Outro momento",
                        }[k] ||
                        k}
                    </dt>
                    <dd>{v}</dd>
                  </div>
                ))}
            </dl>
            {r.attachment && (
              <div className="notice">
                <Paperclip size={17} />
                {r.attachment}
                <small> · Anexo simulado, sem arquivo armazenado.</small>
              </div>
            )}
            <p className="privacy-note">
              <ShieldCheck size={16} />
              Não solicite informações pessoais desnecessárias.
            </p>
          </section>
          <Chat request={r} from="equipe" />
          <section className="panel">
            <div className="row-between">
              <h2>
                <ClipboardCheck size={19} />
                Medidas já tomadas
              </h2>
              <button
                className="text-button"
                onClick={() => start("Registrar providência")}
              >
                Registrar providência
              </button>
            </div>
            {r.measures.length ? (
              r.measures.map((m, i) => (
                <div className="measure" key={i}>
                  <CheckCircle2 size={17} />
                  <span>
                    {m.text}
                    <small>{new Date(m.date).toLocaleString("pt-BR")}</small>
                  </span>
                </div>
              ))
            ) : (
              <p className="muted">Nenhuma providência registrada ainda.</p>
            )}
          </section>
          <section className="panel">
            <h2>Observação interna</h2>
            <p className="muted">Visível somente neste painel demonstrativo.</p>
            <label className="sr-only" htmlFor="internal-note">
              Observação interna
            </label>
            <textarea
              id="internal-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Registre informações necessárias para a equipe…"
            />
            <button
              className="secondary"
              onClick={() => {
                update(r.id, { note }, "Observação interna atualizada.");
                setNotice("Observação salva.");
              }}
            >
              <Save size={16} />
              Salvar observação
            </button>
          </section>
        </div>
        <aside className="case-aside">
          <section className="panel">
            <h2>Organizar atendimento</h2>
            <label>
              Responsável atual
              <select
                aria-label="Responsável atual"
                value={r.adult}
                onChange={(e) =>
                  update(
                    r.id,
                    { adult: e.target.value },
                    `Responsável alterado para ${e.target.value}.`,
                  )
                }
              >
                {adults.map((a) => (
                  <option key={a.name}>{a.name}</option>
                ))}
              </select>
            </label>
            <label>
              Nível de prioridade
              <select
                value={r.priority}
                onChange={(e) =>
                  update(
                    r.id,
                    { priority: e.target.value as Request["priority"] },
                    `Prioridade alterada para ${e.target.value}.`,
                  )
                }
              >
                {["Normal", "Alta", "Urgente"].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <label>
              Status
              <select
                value={r.status}
                onChange={(e) =>
                  update(
                    r.id,
                    { status: e.target.value as Status },
                    `Status alterado para ${e.target.value}.`,
                  )
                }
              >
                {[
                  "Novo",
                  "Em atendimento",
                  "Aguardando retorno",
                  "Em acompanhamento",
                  ...(r.status === "Concluído" ? ["Concluído"] : []),
                ].map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </label>
            <div className="case-actions">
              <button
                className="primary"
                onClick={() => {
                  update(
                    r.id,
                    { adult: "Ana", status: "Em atendimento" },
                    "Ana assumiu o atendimento.",
                  );
                  setNotice("Você assumiu este atendimento.");
                }}
              >
                <UserCheck size={17} />
                Assumir atendimento
              </button>
              <button
                className="secondary"
                onClick={() => start("Encaminhar atendimento")}
              >
                Encaminhar para outro responsável
              </button>
              <button
                className="secondary"
                onClick={() =>
                  document.getElementById("message-equipe")?.focus()
                }
              >
                <MessageSquare size={17} />
                Enviar mensagem
              </button>
              <button
                className="secondary"
                onClick={() => start("Marcar conversa")}
              >
                <CalendarDays size={17} />
                Marcar conversa
              </button>
              <button
                className="secondary"
                onClick={() => start("Agendar acompanhamento")}
              >
                <Clock size={17} />
                Agendar acompanhamento
              </button>
              <button
                className="secondary"
                onClick={() => start("Registrar providência")}
              >
                <ClipboardCheck size={17} />
                Registrar providência
              </button>
              <button
                className="text-button close-case"
                disabled={r.status === "Concluído"}
                onClick={() => {
                  setChecks([false, false, false, false]);
                  setReason("");
                  start("Encerrar caso");
                }}
              >
                <CheckCircle2 size={17} />
                Encerrar caso
              </button>
            </div>
            {r.appointment && (
              <p className="notice">
                Conversa: {new Date(r.appointment).toLocaleString("pt-BR")}
              </p>
            )}
            {r.nextCheck && (
              <p className="notice">
                Próxima checagem:{" "}
                {new Date(r.nextCheck).toLocaleString("pt-BR")}
              </p>
            )}
            {r.closure && (
              <div className="notice">
                <strong>Justificativa do encerramento</strong>
                <p>{r.closure.reason}</p>
                <small>
                  {r.closure.checks.filter(Boolean).length} de 4 verificações
                  confirmadas.
                </small>
              </div>
            )}
          </section>
          <section className="panel">
            <h2>Linha do tempo</h2>
            <ol className="timeline">
              {r.timeline
                .slice()
                .reverse()
                .map((event, i) => (
                  <li key={i}>
                    <span>{event.text}</span>
                    <time>{new Date(event.date).toLocaleString("pt-BR")}</time>
                  </li>
                ))}
            </ol>
          </section>
        </aside>
      </div>
      {notice && (
        <div className="toast" role="status">
          <CheckCircle2 size={17} />
          {notice}
          <button aria-label="Fechar aviso" onClick={() => setNotice("")}>
            ×
          </button>
        </div>
      )}
      {action && (
        <div className="modal-backdrop">
          <section
            className="modal panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="action-title"
            onKeyDown={(e) => {
              if (e.key === "Escape") setAction("");
              if (e.key === "Tab") {
                const items = Array.from(
                  e.currentTarget.querySelectorAll<HTMLElement>(
                    "button:not(:disabled),input,select,textarea",
                  ),
                );
                if (e.shiftKey && document.activeElement === items[0]) {
                  e.preventDefault();
                  items.at(-1)?.focus();
                } else if (
                  !e.shiftKey &&
                  document.activeElement === items.at(-1)
                ) {
                  e.preventDefault();
                  items[0]?.focus();
                }
              }
            }}
          >
            <h2 id="action-title">{action}</h2>
            {action === "Encerrar caso" ? (
              <>
                <p>
                  Revise o cuidado oferecido e registre o motivo do
                  encerramento.
                </p>
                {[
                  "A criança foi ouvida?",
                  "Foram combinadas medidas de proteção?",
                  "Foi feita uma checagem posterior?",
                  "O estudante informou sentir-se mais seguro?",
                ].map((q, i) => (
                  <label className="checkbox-label" key={q}>
                    <input
                      type="checkbox"
                      autoFocus={i === 0}
                      checked={checks[i]}
                      onChange={(e) =>
                        setChecks((old) =>
                          old.map((v, j) => (j === i ? e.target.checked : v)),
                        )
                      }
                    />
                    {q}
                  </label>
                ))}
                <label>
                  Justificativa do encerramento
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    placeholder="Registre o motivo e explique as verificações ainda não confirmadas, se houver."
                  />
                </label>
                <p className="muted">
                  A justificativa é obrigatória. As verificações ficam
                  registradas.
                </p>
                <div className="button-row">
                  <button className="secondary" onClick={() => setAction("")}>
                    Cancelar
                  </button>
                  <button
                    className="primary"
                    disabled={!reason.trim()}
                    onClick={() => {
                      update(
                        r.id,
                        {
                          status: "Concluído",
                          closure: { checks, reason: reason.trim() },
                        },
                        "Caso encerrado com justificativa e verificações registradas.",
                      );
                      setAction("");
                      setNotice("Encerramento registrado.");
                    }}
                  >
                    Confirmar encerramento
                  </button>
                </div>
              </>
            ) : (
              <>
                <label>
                  {action === "Encaminhar atendimento"
                    ? "Responsável"
                    : action === "Registrar providência"
                      ? "Providência realizada"
                      : "Data e hora"}
                  {action === "Encaminhar atendimento" ? (
                    <select
                      autoFocus
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    >
                      {adults.map((a) => (
                        <option key={a.name}>{a.name}</option>
                      ))}
                    </select>
                  ) : action === "Registrar providência" ? (
                    <textarea
                      autoFocus
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  ) : (
                    <input
                      autoFocus
                      type="datetime-local"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                  )}
                </label>
                <div className="button-row">
                  <button className="secondary" onClick={() => setAction("")}>
                    Cancelar
                  </button>
                  <button
                    className="primary"
                    disabled={!value.trim()}
                    onClick={saveAction}
                  >
                    Salvar registro
                  </button>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </>
  );
}
