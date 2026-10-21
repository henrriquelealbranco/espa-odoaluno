"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Copy,
  MessageSquare,
  Paperclip,
  ShieldCheck,
  CheckCircle2,
  Clock,
  UserRound,
  HeartHandshake,
} from "lucide-react";
import {
  adults,
  blankDraft,
  categories,
  createRequest,
  questions,
  type Draft,
  type Request,
} from "@/lib/model";
import { useStore } from "@/lib/store";
export function HelpFlow({ onClose }: { onClose: () => void }) {
  const [d, setD] = useState<Draft>(blankDraft);
  const [loaded, setLoaded] = useState(false);
  const [sent, setSent] = useState<Request | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const { requests, add } = useStore();
  const router = useRouter();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("student-draft");
      if (raw) {
        const v = JSON.parse(raw);
        if (typeof v.step === "number" && v.answers)
          setD({ ...blankDraft, ...v });
      }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded && !sent)
      sessionStorage.setItem("student-draft", JSON.stringify(d));
  }, [d, loaded, sent]);
  useEffect(() => {
    heading.current?.focus();
  }, [d.step, sent]);
  const patch = (value: Partial<Draft>) => {
    setError("");
    setD((old) => ({ ...old, ...value }));
  };
  const answer = (key: string, value: string) =>
    patch({ answers: { ...d.answers, [key]: value } });
  const go = (step: number) => patch({ step });
  const guided = d.category !== categories[0] && d.category !== categories[3];
  const back = () => {
    if (d.step === 0) onClose();
    else if (d.step === 9) go(guided ? 8 : 2);
    else if (d.step === 20) go(7);
    else go(d.step - 1);
  };
  const send = () => {
    if (!/^\d{4}$/.test(d.pin)) {
      setError("Crie um PIN com exatamente quatro números.");
      return;
    }
    if (d.identity !== "anonymous" && !d.displayName.trim()) {
      setError("Informe um nome ou apelido fictício.");
      return;
    }
    const r = createRequest(d, requests);
    add(r);
    sessionStorage.removeItem("student-draft");
    setSent(r);
  };
  if (!loaded) return <p role="status">Preparando seu espaço…</p>;
  if (sent)
    return (
      <section className="flow confirmation">
        <div className="success-mark">
          <CheckCircle2 size={36} />
        </div>
        <h1 tabIndex={-1} ref={heading}>
          Seu pedido foi recebido.
        </h1>
        <p>Você não precisa resolver isso sozinho.</p>
        <div className="code-card">
          <span>Guarde seu código de acompanhamento</span>
          <strong data-testid="request-code">{sent.id}</strong>
          <button
            className="text-button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(sent.id);
                setCopied(true);
              } catch {
                setError("Selecione o código acima para copiá-lo.");
              }
            }}
          >
            <Copy size={15} />
            {copied ? "Código copiado" : "Copiar código"}
          </button>
        </div>
        <dl className="confirmation-list">
          <div>
            <dt>Status atual</dt>
            <dd>
              <span className="badge blue">Novo</span>
            </dd>
          </div>
          <div>
            <dt>Adulto escolhido</dt>
            <dd>{sent.adult}</dd>
          </div>
          <div>
            <dt>Previsão de análise</dt>
            <dd>Próximo período escolar · simulada</dd>
          </div>
        </dl>
        <p className="notice">
          <Clock size={17} />
          Este canal é acompanhado nos horários definidos pela escola. Em uma
          emergência imediata, procure um adulto próximo ou o serviço de
          emergência da sua região.
        </p>
        {error && <p role="alert">{error}</p>}
        <button
          className="primary full"
          onClick={() => router.push("/acompanhar")}
        >
          Acompanhar depois <ArrowRight size={17} />
        </button>
        <button
          className="secondary full"
          onClick={() => router.replace("/atividades")}
        >
          Ir para minhas atividades
        </button>
      </section>
    );
  return (
    <section className="flow">
      <button className="back-button" onClick={back}>
        <ArrowLeft size={16} />
        Voltar
      </button>
      <div className="flow-kicker">
        <span className="mini-icon blue">
          <MessageSquare size={18} />
        </span>
        <span>Um espaço de escuta</span>
        <span className="right-text">No seu tempo</span>
      </div>
      {d.step === 0 && (
        <>
          <h1 ref={heading} tabIndex={-1}>
            Como podemos ajudar?
          </h1>
          <p>Você escolhe por onde começar.</p>
          <div className="options">
            {categories.map((c, i) => (
              <button
                className="option"
                key={c}
                onClick={() => patch({ category: c, step: 1 })}
              >
                <span className="option-number">
                  {["01", "02", "03", "04"][i]}
                </span>
                <span>{c}</span>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>
          <p className="flow-note">
            <HeartHandshake size={18} />
            Você não precisa ter todas as respostas para pedir ajuda.
          </p>
        </>
      )}
      {d.step === 1 && (
        <>
          <h1 ref={heading} tabIndex={-1}>
            Com quem você quer conversar?
          </h1>
          <p>Escolha alguém com quem se sinta à vontade.</p>
          <div className="adults">
            {adults.map((a) => (
              <button
                className={`adult-card ${d.adult === a.name ? "chosen" : ""}`}
                key={a.name}
                onClick={() => patch({ adult: a.name, step: 2 })}
              >
                <span className={`avatar ${a.color}`}>{a.initials}</span>
                <span>
                  <strong>{a.name}</strong>
                  <small>{a.role}</small>
                  <span className="availability">● {a.available}</span>
                </span>
                <ChevronRight size={18} />
              </button>
            ))}
          </div>
          <button
            className="option no-preference"
            onClick={() => patch({ adult: "", step: 2 })}
          >
            Não tenho preferência. Pode ser alguém preparado para me ajudar.
            <ChevronRight size={18} />
          </button>
          <small className="muted">Disponibilidades demonstrativas.</small>
        </>
      )}
      {d.step === 2 && !guided && (
        <>
          <h1 ref={heading} tabIndex={-1}>
            Vamos combinar uma conversa?
          </h1>
          <p>Você não precisa escrever detalhes agora.</p>
          <label>
            Melhor momento
            <select
              value={d.answers.momento || "Intervalo"}
              onChange={(e) => answer("momento", e.target.value)}
            >
              {["Agora", "Intervalo", "Depois da aula", "Outro"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          {d.answers.momento === "Outro" && (
            <label>
              Qual momento?
              <input
                value={d.answers.outroMomento || ""}
                onChange={(e) => answer("outroMomento", e.target.value)}
              />
            </label>
          )}
          <label>
            Preferência de local
            <select
              value={d.answers.preferenciaLocal || "Um lugar reservado"}
              onChange={(e) => answer("preferenciaLocal", e.target.value)}
            >
              {[
                "Um lugar reservado",
                "Sala de orientação",
                "Biblioteca",
                "Não tenho preferência",
              ].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label>
            Quer contar alguma coisa antes da conversa?{" "}
            <span className="muted">(opcional)</span>
            <textarea
              value={d.answers.relato || ""}
              onChange={(e) => answer("relato", e.target.value)}
              placeholder="Você pode escrever do seu jeito. Não precisa contar tudo agora."
            />
          </label>
          <button
            className="primary full"
            onClick={() => {
              patch({
                answers: {
                  momento: "Intervalo",
                  preferenciaLocal: "Um lugar reservado",
                  ...d.answers,
                },
                step: 9,
              });
            }}
          >
            Continuar
            <ArrowRight size={17} />
          </button>
        </>
      )}
      {guided &&
        d.step >= 2 &&
        d.step <= 8 &&
        (() => {
          const q = questions[d.step - 2];
          return (
            <>
              <div className="progress-label">
                <span>Uma pergunta de cada vez</span>
                <span>{d.step - 1} de 7</span>
              </div>
              <div className="progress">
                <span style={{ width: `${((d.step - 1) / 7) * 100}%` }} />
              </div>
              <h1 ref={heading} tabIndex={-1}>
                {q.title}
              </h1>
              <p>Compartilhe apenas o que você se sentir à vontade.</p>
              {q.options.length ? (
                <div className="options">
                  {q.options.map((v) => (
                    <button
                      className={`option ${d.answers[q.key] === v ? "chosen" : ""}`}
                      aria-pressed={d.answers[q.key] === v}
                      key={v}
                      onClick={() => {
                        if (q.key === "perigo" && v.startsWith("Sim"))
                          patch({
                            answers: { ...d.answers, perigo: v },
                            urgent: true,
                            step: 20,
                          });
                        else
                          patch({
                            answers: { ...d.answers, [q.key]: v },
                            ...(q.key === "perigo" ? { urgent: false } : {}),
                          });
                      }}
                    >
                      {v}
                      {d.answers[q.key] === v ? (
                        <Check size={18} />
                      ) : (
                        <span className="radio-circle" />
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <label>
                    Seu relato <span className="muted">(opcional)</span>
                    <textarea
                      value={d.answers.relato || ""}
                      onChange={(e) => answer("relato", e.target.value)}
                      placeholder="Você pode escrever do seu jeito. Não precisa contar tudo agora."
                    />
                  </label>
                  <label className="file-picker">
                    <Paperclip size={18} />
                    Anexar imagem (simulado)
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        patch({ attachment: e.target.files?.[0]?.name || "" })
                      }
                    />
                  </label>
                  {d.attachment && (
                    <p>
                      {d.attachment}{" "}
                      <button
                        className="text-button"
                        onClick={() => patch({ attachment: "" })}
                      >
                        Remover
                      </button>
                    </p>
                  )}
                  <small className="muted">
                    Somente o nome é guardado. Nenhuma imagem é enviada.
                  </small>
                </>
              )}
              <button
                className="primary full"
                onClick={() => go(d.step === 8 ? 9 : d.step + 1)}
              >
                Continuar <ArrowRight size={17} />
              </button>
              <button
                className="text-button centered"
                onClick={() => {
                  if (q.key === "perigo")
                    patch({
                      answers: { ...d.answers, perigo: "" },
                      urgent: false,
                      step: 8,
                    });
                  else go(d.step === 8 ? 9 : d.step + 1);
                }}
              >
                Pular esta pergunta
              </button>
            </>
          );
        })()}
      {d.step === 20 && (
        <div className="urgent-screen">
          <span className="large-icon peach">
            <HeartHandshake size={34} />
          </span>
          <h1 ref={heading} tabIndex={-1}>
            Você fez certo em pedir ajuda.
          </h1>
          <p>
            Procure agora um adulto de confiança que esteja próximo. Seu pedido
            será marcado como urgente para a equipe responsável.
          </p>
          <button className="primary full" onClick={() => go(9)}>
            Enviar pedido urgente
            <ArrowRight size={17} />
          </button>
          <button
            className="secondary full"
            onClick={() => router.replace("/atividades")}
          >
            Voltar para a tela discreta
          </button>
          <p className="notice">
            Este canal é acompanhado nos horários definidos pela escola. Em uma
            emergência imediata, procure um adulto próximo ou o serviço de
            emergência da sua região.
          </p>
        </div>
      )}
      {d.step === 9 && (
        <>
          <span className="large-icon green">
            <ShieldCheck size={28} />
          </span>
          <h1 ref={heading} tabIndex={-1}>
            Como quer se identificar?
          </h1>
          <p>
            Você pode escolher. Use apenas informações fictícias nesta
            demonstração.
          </p>
          <div className="options">
            {(
              [
                ["anonymous", "Enviar anonimamente"],
                ["name", "Informar meu nome"],
                ["nickname", "Usar um apelido para acompanhar"],
              ] as const
            ).map(([v, label]) => (
              <button
                key={v}
                className={`option ${d.identity === v ? "chosen" : ""}`}
                aria-pressed={d.identity === v}
                onClick={() => patch({ identity: v })}
              >
                <UserRound size={18} />
                <span>{label}</span>
                {d.identity === v && <Check size={18} />}
              </button>
            ))}
          </div>
          {d.identity !== "anonymous" && (
            <label>
              {d.identity === "name" ? "Nome fictício" : "Apelido"}
              <input
                maxLength={60}
                autoComplete="off"
                value={d.displayName}
                onChange={(e) => patch({ displayName: e.target.value })}
              />
            </label>
          )}
          <p className="privacy-note">
            Se você enviar anonimamente, a equipe não verá seu nome. Algumas
            situações podem ser mais difíceis de verificar sem informações
            adicionais.
          </p>
          <label>
            PIN de quatro números
            <input
              className="pin-input"
              type="password"
              inputMode="numeric"
              autoComplete="new-password"
              maxLength={4}
              value={d.pin}
              onChange={(e) =>
                patch({ pin: e.target.value.replace(/\D/g, "") })
              }
              placeholder="••••"
            />
          </label>
          <small className="muted">
            Guarde seu PIN. Ele protege o acesso à conversa neste protótipo.
          </small>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button className="primary full" onClick={send}>
            {d.urgent ? "Enviar pedido urgente" : "Enviar pedido"}
            <ArrowRight size={17} />
          </button>
        </>
      )}
    </section>
  );
}
