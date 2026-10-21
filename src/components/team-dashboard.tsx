"use client";
import { useEffect, useState } from "react";
import {
  Home,
  MessageSquare,
  CalendarDays,
  ChartNoAxesColumn,
  Settings,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ArrowUpRight,
  Users,
  Check,
  Clock,
  ArrowUp,
  LogOut,
  RotateCcw,
  Menu,
  X,
  Notebook,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { Brand } from "./shell";
import { useStore } from "@/lib/store";
import { adults, dateLabel, studentName } from "@/lib/model";
import { CaseDetail } from "./team-detail";
import { Indicators } from "./team-indicators";
const sections = [
  { name: "Visão geral", icon: Home },
  { name: "Pedidos", icon: MessageSquare },
  { name: "Agenda", icon: CalendarDays },
  { name: "Indicadores", icon: ChartNoAxesColumn },
  { name: "Configurações", icon: Settings },
];
export function TeamDashboard() {
  const { requests, ready, error, reset } = useStore();
  const [filterTime] = useState(() => Date.now());
  const [entered, setEntered] = useState(false);
  const [section, setSection] = useState("Visão geral");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");
  const [adult, setAdult] = useState("Todos");
  const [period, setPeriod] = useState("Todos");
  const [filters, setFilters] = useState(false);
  const [selected, setSelected] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [hours, setHours] = useState("Segunda a sexta, das 7h às 17h");
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setEntered(sessionStorage.getItem("team-demo") === "true");
    setHours(
      localStorage.getItem("school-hours") || "Segunda a sexta, das 7h às 17h",
    );
  }, []);
  const r = requests.find((x) => x.id === selected);
  const filtered = requests.filter(
    (r) =>
      (filter === "Todos" ||
        (filter === "Urgentes"
          ? r.priority === "Urgente"
          : r.status === filter)) &&
      (adult === "Todos" || r.adult === adult) &&
      (period === "Todos" ||
        filterTime - new Date(r.created).getTime() <
          Number(period) * 86400000) &&
      `${r.id} ${studentName(r)} ${r.category} ${r.status}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const switchSection = (s: string) => {
    setSection(s);
    setSelected("");
    setMobileMenu(false);
  };
  if (!entered)
    return (
      <main className="team-login-wrap">
        <Brand team />
        <section className="team-login panel">
          <span className="large-icon blue">
            <Notebook size={32} />
          </span>
          <span className="eyebrow">Apresentação do protótipo</span>
          <h1>
            Um olhar atento.
            <br />
            Uma escola que acolhe.
          </h1>
          <p>
            Conheça o espaço da equipe escolar e acompanhe cada pedido com
            cuidado.
          </p>
          <div className="login-person">
            <span className="avatar green">AN</span>
            <span>
              <strong>Ana Martins</strong>
              <small>Orientadora · Escola Horizonte</small>
            </span>
            <span className="badge blue">Demo</span>
          </div>
          <button
            className="primary full"
            onClick={() => {
              sessionStorage.setItem("team-demo", "true");
              setEntered(true);
            }}
          >
            Entrar na demonstração
            <ArrowUpRight size={18} />
          </button>
          <p className="privacy-note">
            Acesso demonstrativo, sem autenticação real. Todos os dados
            apresentados são fictícios.
          </p>
          <Link href="/aluno" className="text-link">
            Ver experiência do estudante →
          </Link>
        </section>
      </main>
    );
  const stats = [
    {
      label: "Novos pedidos",
      value: requests.filter((r) => r.status === "Novo").length,
      icon: MessageSquare,
      color: "blue",
      target: "Novo",
    },
    {
      label: "Em atendimento",
      value: requests.filter((r) => r.status === "Em atendimento").length,
      icon: Users,
      color: "green",
      target: "Em atendimento",
    },
    {
      label: "Acompanhamento",
      value: requests.filter(
        (r) =>
          r.status === "Em acompanhamento" || r.status === "Aguardando retorno",
      ).length,
      icon: ChartNoAxesColumn,
      color: "peach",
      target: "Em acompanhamento",
    },
    {
      label: "Concluídos",
      value: requests.filter((r) => r.status === "Concluído").length,
      icon: Check,
      color: "green",
      target: "Concluído",
    },
  ];
  return (
    <div className="team-shell">
      <aside className={`sidebar ${mobileMenu ? "open" : ""}`}>
        <Brand team />
        <button
          aria-label="Fechar menu"
          className="mobile-close"
          onClick={() => setMobileMenu(false)}
        >
          <X />
        </button>
        <nav aria-label="Navegação da equipe">
          {sections.map((s) => (
            <button
              className={section === s.name ? "active" : ""}
              key={s.name}
              onClick={() => switchSection(s.name)}
            >
              <s.icon size={21} />
              {s.name}
              {s.name === "Pedidos" && (
                <span className="nav-count">
                  {requests.filter((r) => r.status === "Novo").length}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="school-stamp">
            <span className="mini-icon green">
              <ShieldCheck size={19} />
            </span>
            <span>
              <strong>Escola Horizonte</strong>
              <small>Piloto de acolhimento</small>
            </span>
          </div>
          <Link href="/aluno">
            Experiência do estudante <ArrowUpRight size={15} />
          </Link>
          <button onClick={() => setResetOpen(true)}>
            <RotateCcw size={16} />
            Reiniciar demonstração
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("team-demo");
              setEntered(false);
            }}
          >
            <LogOut size={16} />
            Sair do painel
          </button>
        </div>
      </aside>
      <div className="team-content">
        <header className="team-topbar">
          <button
            aria-label="Abrir menu"
            aria-expanded={mobileMenu}
            className="mobile-menu"
            onClick={() => setMobileMenu(true)}
          >
            <Menu />
          </button>
          <span>
            Escola Horizonte <ChevronRight size={14} /> {section}
          </span>
          <span className="topbar-right">
            <span className="demo-dot" />
            Ambiente de demonstração
            <span className="avatar blue small">AM</span>
          </span>
        </header>
        <main className="team-main">
          {error && (
            <p role="alert" className="notice warning">
              {error}
            </p>
          )}
          {!ready ? (
            <p>Preparando painel…</p>
          ) : r ? (
            <CaseDetail request={r} onBack={() => setSelected("")} />
          ) : (
            <>
              <div className="team-heading">
                <div>
                  <span className="eyebrow">
                    {section === "Visão geral"
                      ? "Cuidado que faz a diferença"
                      : "Espaço da equipe escolar"}
                  </span>
                  <h1>
                    {section === "Visão geral" ? "Bom dia, Ana" : section}
                  </h1>
                  <p>
                    {section === "Visão geral"
                      ? "Vamos cuidar de quem precisa."
                      : section === "Pedidos"
                        ? "Cada pedido merece uma escuta atenta."
                        : section === "Agenda"
                          ? "Um tempo reservado para cada conversa."
                          : section === "Indicadores"
                            ? "Um olhar para o coletivo, com cuidado com cada pessoa."
                            : "Organize o funcionamento deste espaço."}
                  </p>
                </div>
                <div className="today">
                  <CalendarDays size={17} />
                  {new Date().toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "long",
                  })}
                </div>
              </div>
              {(section === "Visão geral" || section === "Pedidos") && (
                <>
                  <div className="stat-grid">
                    {stats.map((s) => (
                      <button
                        className="stat-card"
                        key={s.label}
                        onClick={() => {
                          setFilter(s.target);
                          setSection("Pedidos");
                        }}
                      >
                        <span className={`mini-icon ${s.color}`}>
                          <s.icon size={21} />
                        </span>
                        <span>{s.label}</span>
                        <strong className={`text-${s.color}`}>
                          {String(s.value).padStart(2, "0")}
                        </strong>
                        <ArrowUpRight className="stat-arrow" size={17} />
                      </button>
                    ))}
                  </div>
                  <div className="quick-stats">
                    <button
                      onClick={() => {
                        setFilter("Todos");
                        setSection("Pedidos");
                      }}
                    >
                      <span className="dot blue" />
                      {
                        requests.filter((r) => r.status !== "Concluído").length
                      }{" "}
                      pedidos abertos
                    </button>
                    <button
                      onClick={() => {
                        setFilter("Urgentes");
                        setSection("Pedidos");
                      }}
                    >
                      <span className="dot red" />
                      {
                        requests.filter(
                          (r) =>
                            r.priority === "Urgente" &&
                            r.status !== "Concluído",
                        ).length
                      }{" "}
                      urgentes
                    </button>
                    <button
                      onClick={() => {
                        setFilter("Novo");
                        setSection("Pedidos");
                      }}
                    >
                      <span className="dot blue" />
                      {requests.filter((r) => r.status === "Novo").length}{" "}
                      aguardando atendimento
                    </button>
                    <span>
                      <Clock size={14} />
                      1h 24min · primeira resposta simulada
                    </span>
                  </div>
                  <section className="panel requests-panel">
                    <div className="requests-toolbar">
                      <div>
                        <h2>Pedidos de apoio</h2>
                        <small className="muted">
                          Acolher começa com ouvir.
                        </small>
                      </div>
                      <div className="search-actions">
                        <label className="search-box">
                          <Search size={17} />
                          <input
                            aria-label="Buscar pedidos"
                            placeholder="Buscar por código, estudante ou status…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                          />
                        </label>
                        <button
                          className="secondary"
                          aria-expanded={filters}
                          onClick={() => setFilters(!filters)}
                        >
                          <SlidersHorizontal size={16} />
                          Filtrar
                        </button>
                      </div>
                    </div>
                    <div
                      className="filter-tabs"
                      aria-label="Status dos pedidos"
                    >
                      {[
                        "Todos",
                        "Urgentes",
                        "Novo",
                        "Em atendimento",
                        "Aguardando retorno",
                        "Em acompanhamento",
                        "Concluído",
                      ].map((f) => (
                        <button
                          className={filter === f ? "active" : ""}
                          key={f}
                          onClick={() => setFilter(f)}
                        >
                          {f === "Novo"
                            ? "Novos"
                            : f === "Concluído"
                              ? "Concluídos"
                              : f}
                        </button>
                      ))}
                    </div>
                    {filters && (
                      <div className="extra-filters">
                        <label>
                          Responsável
                          <select
                            value={adult}
                            onChange={(e) => setAdult(e.target.value)}
                          >
                            <option>Todos</option>
                            {adults.map((a) => (
                              <option key={a.name}>{a.name}</option>
                            ))}
                          </select>
                        </label>
                        <label>
                          Período
                          <select
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                          >
                            <option value="Todos">Todo o período</option>
                            <option value="1">Últimas 24 horas</option>
                            <option value="7">Últimos 7 dias</option>
                            <option value="30">Últimos 30 dias</option>
                          </select>
                        </label>
                        <button
                          className="text-button"
                          onClick={() => {
                            setFilter("Todos");
                            setAdult("Todos");
                            setPeriod("Todos");
                            setSearch("");
                          }}
                        >
                          Limpar filtros
                        </button>
                      </div>
                    )}
                    <div className="table-scroll">
                      <table>
                        <thead>
                          <tr>
                            <th>Pedido / categoria</th>
                            <th>Estudante</th>
                            <th>Prioridade</th>
                            <th>Status</th>
                            <th>Responsável</th>
                            <th>Data</th>
                            <th>
                              <span className="sr-only">Abrir</span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <button
                                  className="request-open"
                                  onClick={() => setSelected(item.id)}
                                >
                                  {item.id}
                                  <small>
                                    {item.category
                                      .replace("Quero ", "")
                                      .replace("Estou ", "")}
                                  </small>
                                </button>
                              </td>
                              <td>{studentName(item)}</td>
                              <td>
                                <span
                                  className={`badge ${item.priority === "Urgente" ? "red" : item.priority === "Alta" ? "peach" : "sage"}`}
                                >
                                  {item.priority === "Normal" ? (
                                    <span className="dot" />
                                  ) : (
                                    <ArrowUp size={14} />
                                  )}{" "}
                                  {item.priority}
                                </span>
                              </td>
                              <td>
                                <span
                                  className={`badge ${item.status === "Concluído" ? "green" : item.status === "Em acompanhamento" ? "sage" : "blue"}`}
                                >
                                  {item.status}
                                </span>
                              </td>
                              <td>
                                <span className="responsible">
                                  <span className="avatar small neutral">
                                    {item.adult.slice(0, 2).toUpperCase()}
                                  </span>
                                  {item.adult}
                                </span>
                              </td>
                              <td className="nowrap muted">
                                {dateLabel(item.created)}
                              </td>
                              <td>
                                <button
                                  aria-label={`Abrir ${item.id}`}
                                  className="icon-button"
                                  onClick={() => setSelected(item.id)}
                                >
                                  <ChevronRight size={18} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {!filtered.length && (
                        <div className="empty-state">
                          <Search size={26} />
                          <h3>Nenhum pedido com estes filtros</h3>
                          <p>
                            Altere a busca ou limpe os filtros para ver outros
                            pedidos.
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="table-footer">
                      <span>{filtered.length} pedidos encontrados</span>
                      <span>
                        Identidades preservadas por escolha do estudante{" "}
                        <ShieldCheck size={13} />
                      </span>
                    </div>
                  </section>
                </>
              )}
              {section === "Visão geral" && (
                <div className="dashboard-bottom">
                  <section className="panel">
                    <div className="row-between">
                      <h2>
                        <CalendarDays size={19} />
                        Próximas conversas
                      </h2>
                      <button
                        className="text-button"
                        onClick={() => setSection("Agenda")}
                      >
                        Ver agenda
                      </button>
                    </div>
                    {requests
                      .filter((r) => r.appointment)
                      .slice(0, 2)
                      .map((r) => (
                        <button
                          key={r.id}
                          className="appointment-row"
                          onClick={() => setSelected(r.id)}
                        >
                          <strong>
                            {new Date(r.appointment).toLocaleTimeString(
                              "pt-BR",
                              { hour: "2-digit", minute: "2-digit" },
                            )}
                          </strong>
                          <span className="dot blue" />
                          <span>
                            <strong>Conversa reservada</strong>
                            <small>
                              {r.adult} · {dateLabel(r.appointment)}
                            </small>
                          </span>
                          <ChevronRight size={17} />
                        </button>
                      ))}
                    {!requests.some((r) => r.appointment) && (
                      <p className="muted">
                        Nenhuma conversa marcada. Abra um pedido para agendar.
                      </p>
                    )}
                  </section>
                  <section className="panel">
                    <div className="row-between">
                      <h2>
                        <ChartNoAxesColumn size={19} />
                        Como estão os estudantes?
                      </h2>
                      <button
                        className="text-button"
                        onClick={() => setSection("Indicadores")}
                      >
                        Ver detalhes
                      </button>
                    </div>
                    <MiniChart />
                    <small className="muted">
                      Retorno após o atendimento · exemplo ilustrativo
                    </small>
                  </section>
                </div>
              )}
              {section === "Agenda" && (
                <section className="panel agenda-panel">
                  <div className="row-between">
                    <h2>Conversas e acompanhamentos</h2>
                    <span className="badge blue">Agenda demonstrativa</span>
                  </div>
                  {requests
                    .filter((r) => r.appointment || r.nextCheck)
                    .sort((a, b) =>
                      (a.appointment || a.nextCheck).localeCompare(
                        b.appointment || b.nextCheck,
                      ),
                    )
                    .map((r) => (
                      <button
                        className="agenda-item"
                        key={r.id}
                        onClick={() => setSelected(r.id)}
                      >
                        <span className="date-block">
                          <strong>
                            {new Date(r.appointment || r.nextCheck).getDate()}
                          </strong>
                          <small>
                            {new Date(
                              r.appointment || r.nextCheck,
                            ).toLocaleDateString("pt-BR", { month: "short" })}
                          </small>
                        </span>
                        <div>
                          <h3>
                            {r.appointment
                              ? "Conversa reservada"
                              : "Checagem de acompanhamento"}
                          </h3>
                          <p>
                            {r.id} · {r.adult} ·{" "}
                            {new Date(
                              r.appointment || r.nextCheck,
                            ).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <ChevronRight size={20} />
                      </button>
                    ))}
                  {!requests.some((r) => r.appointment || r.nextCheck) && (
                    <p>
                      Sem compromissos. Abra um pedido e escolha “Marcar
                      conversa”.
                    </p>
                  )}
                </section>
              )}
              {section === "Indicadores" && <Indicators requests={requests} />}
              {section === "Configurações" && (
                <section className="panel settings-panel">
                  <h2>Funcionamento do piloto</h2>
                  <p className="muted">
                    Preferências locais desta demonstração.
                  </p>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      localStorage.setItem("school-hours", hours);
                      setSaved(true);
                    }}
                  >
                    <label>
                      Horários definidos pela escola
                      <input
                        value={hours}
                        required
                        onChange={(e) => {
                          setHours(e.target.value);
                          setSaved(false);
                        }}
                      />
                    </label>
                    <button className="primary">Salvar configurações</button>
                    {saved && (
                      <p role="status">Horários salvos neste navegador.</p>
                    )}
                  </form>
                  <h3>Equipe de referência</h3>
                  {adults.map((a) => (
                    <div className="settings-person" key={a.name}>
                      <span className={`avatar ${a.color}`}>{a.initials}</span>
                      <span>
                        <strong>{a.name}</strong>
                        <small>{a.role}</small>
                      </span>
                    </div>
                  ))}
                </section>
              )}
            </>
          )}
          <footer className="team-footer">
            <p>
              Protótipo demonstrativo. Uma implementação real exige autenticação
              segura, criptografia, política de retenção de dados, definição de
              responsáveis, protocolo de atendimento e adequação à LGPD e às
              normas de proteção de crianças e adolescentes.
            </p>
            <span>
              Dados fictícios · Aqui Você Pode Falar · Piloto sem fins
              lucrativos
            </span>
          </footer>
        </main>
      </div>
      {resetOpen && (
        <div className="modal-backdrop">
          <section
            className="modal panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-title"
            onKeyDown={(event) => {
              if (event.key === "Escape") setResetOpen(false);
              if (event.key === "Tab") {
                const buttons =
                  event.currentTarget.querySelectorAll<HTMLButtonElement>(
                    "button",
                  );
                const first = buttons[0];
                const last = buttons[buttons.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }
            }}
          >
            <h2 id="reset-title">Reiniciar demonstração?</h2>
            <p>
              Os pedidos, as conversas e as tarefas deste navegador voltarão aos
              exemplos iniciais.
            </p>
            <div className="button-row">
              <button
                autoFocus
                className="secondary"
                onClick={() => setResetOpen(false)}
              >
                Cancelar
              </button>
              <button
                className="primary"
                onClick={() => {
                  reset();
                  setResetOpen(false);
                  setSelected("");
                  setFilter("Todos");
                  setAdult("Todos");
                  setPeriod("Todos");
                  setSearch("");
                  setHours("Segunda a sexta, das 7h às 17h");
                  setSaved(false);
                }}
              >
                Restaurar dados fictícios
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
export function MiniChart() {
  return (
    <div className="mini-chart">
      <svg
        viewBox="0 0 500 125"
        role="img"
        aria-label="Exemplo ilustrativo de evolução positiva ao longo de sete dias"
      >
        <defs>
          <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#83b597" stopOpacity=".3" />
            <stop offset="100%" stopColor="#83b597" stopOpacity=".03" />
          </linearGradient>
        </defs>
        {[20, 55, 90].map((y) => (
          <line key={y} x1="12" y1={y} x2="488" y2={y} stroke="#edf0ed" />
        ))}
        <path
          d="M15 88 C45 80 62 66 92 66 S140 80 170 80 S218 56 248 56 S296 72 326 72 S374 53 404 53 S455 35 485 30 L485 112 L15 112Z"
          fill="url(#area)"
        />
        <path
          d="M15 88 C45 80 62 66 92 66 S140 80 170 80 S218 56 248 56 S296 72 326 72 S374 53 404 53 S455 35 485 30"
          fill="none"
          stroke="#70a582"
          strokeWidth="2"
        />
        {[
          [15, 88],
          [92, 66],
          [170, 80],
          [248, 56],
          [326, 72],
          [404, 53],
          [485, 30],
        ].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="4" fill="#70a582" />
        ))}
      </svg>
      <div className="chart-labels">
        {[
          "14 out",
          "15 out",
          "16 out",
          "17 out",
          "18 out",
          "19 out",
          "20 out",
        ].map((v) => (
          <span key={v}>{v}</span>
        ))}
      </div>
    </div>
  );
}
