export const adults = [
  {
    name: "Ana",
    role: "Orientadora",
    initials: "AN",
    available: "Na escola hoje",
    color: "green",
  },
  {
    name: "Marcos",
    role: "Professor",
    initials: "MA",
    available: "Próximo intervalo",
    color: "blue",
  },
  {
    name: "Carla",
    role: "Psicóloga escolar",
    initials: "CA",
    available: "A partir das 13h",
    color: "peach",
  },
  {
    name: "Juliana",
    role: "Coordenação",
    initials: "JU",
    available: "Na escola hoje",
    color: "lilac",
  },
];
export const statuses = [
  "Novo",
  "Em atendimento",
  "Aguardando retorno",
  "Em acompanhamento",
  "Concluído",
] as const;
export type Status = (typeof statuses)[number];
export type Message = {
  id: string;
  from: "equipe" | "aluno";
  text: string;
  date: string;
};
export type Entry = { date: string; text: string };
export type Request = {
  id: string;
  pin: string;
  created: string;
  category: string;
  identity: "anonymous" | "name" | "nickname";
  displayName: string;
  adult: string;
  status: Status;
  priority: "Normal" | "Alta" | "Urgente";
  answers: Record<string, string>;
  attachment: string;
  messages: Message[];
  timeline: Entry[];
  measures: Entry[];
  note: string;
  nextCheck: string;
  appointment: string;
  feedback: string;
  closure?: { checks: boolean[]; reason: string };
};
export type Draft = {
  step: number;
  category: string;
  adult: string;
  answers: Record<string, string>;
  identity: Request["identity"];
  displayName: string;
  pin: string;
  attachment: string;
  urgent: boolean;
};
export const blankDraft: Draft = {
  step: 0,
  category: "",
  adult: "",
  answers: {},
  identity: "anonymous",
  displayName: "",
  pin: "",
  attachment: "",
  urgent: false,
};
export const categories = [
  "Quero conversar pessoalmente",
  "Quero contar o que aconteceu",
  "Estou preocupado com outra pessoa",
  "Não sei explicar, só preciso de ajuda.",
];
export const questions = [
  {
    key: "pessoa",
    title: "Isso aconteceu com você ou com outra pessoa?",
    options: ["Comigo", "Com outra pessoa", "Prefiro não responder"],
  },
  {
    key: "local",
    title: "Onde aconteceu?",
    options: [
      "Sala de aula",
      "Pátio",
      "Internet",
      "Caminho da escola",
      "Outro lugar",
    ],
  },
  {
    key: "quando",
    title: "Quando aconteceu?",
    options: ["Hoje", "Esta semana", "Há mais tempo", "Não lembro"],
  },
  {
    key: "repeticao",
    title: "Isso já aconteceu outras vezes?",
    options: ["Sim", "Não", "Não sei"],
  },
  {
    key: "sentimento",
    title: "Como você se sente agora?",
    options: [
      "Triste",
      "Com medo",
      "Confuso",
      "Mais tranquilo",
      "Prefiro não responder",
    ],
  },
  {
    key: "perigo",
    title: "Você acha que está em perigo neste momento?",
    options: ["Sim, estou em perigo agora", "Não", "Não sei"],
  },
  {
    key: "relato",
    title: "Quer contar com suas palavras o que aconteceu?",
    options: [],
  },
];
export const studentName = (r: Request) =>
  r.identity === "anonymous"
    ? "Estudante anônimo"
    : r.identity === "nickname"
      ? `Apelido: ${r.displayName}`
      : r.displayName;
export const now = () => new Date().toISOString();
export const dateLabel = (value: string) =>
  new Date(value).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
export function seedRequests(): Request[] {
  const names = [
    "AZUL-4827",
    "VERDE-1047",
    "SOL-1046",
    "AZUL-1045",
    "LUA-1044",
    "SOL-1043",
    "VERDE-1042",
    "LUA-1041",
  ];
  return names.map((id, i) => ({
    id,
    pin: "1234",
    created: new Date(Date.now() - i * 86400000).toISOString(),
    category: categories[i % 4],
    identity: i === 2 ? "nickname" : "anonymous",
    displayName: i === 2 ? "Sol" : "",
    adult: adults[i % 4].name,
    status: statuses[i % 5],
    priority: i === 0 ? "Urgente" : i === 3 ? "Alta" : "Normal",
    answers: {
      pessoa: "Comigo",
      local: ["Sala de aula", "Pátio", "Internet", "Pátio"][i % 4],
      quando: "Esta semana",
      repeticao: i % 2 ? "Não" : "Sim",
      sentimento: "Confuso",
      perigo: i === 0 ? "Sim, estou em perigo agora" : "Não",
      relato:
        "Gostaria de conversar em um lugar reservado. Tenho passado por situações que me deixam desconfortável.",
    },
    attachment: i === 2 ? "registro-demonstrativo.png" : "",
    messages: [
      {
        id: `${i}a`,
        from: "equipe",
        text: "Recebemos seu pedido. Obrigado por confiar na gente. Você gostaria de conversar no intervalo?",
        date: now(),
      },
      {
        id: `${i}b`,
        from: "aluno",
        text: "Sim, mas prefiro que ninguém da minha turma saiba.",
        date: now(),
      },
      {
        id: `${i}c`,
        from: "equipe",
        text: "Tudo bem. Vamos organizar de maneira discreta.",
        date: now(),
      },
    ],
    timeline: [{ date: now(), text: "Pedido recebido pela escola." }],
    measures:
      i > 2
        ? [
            {
              date: now(),
              text: "Conversa reservada realizada com o estudante.",
            },
          ]
        : [],
    note: "",
    nextCheck:
      i > 1 ? new Date(Date.now() + 86400000).toISOString().slice(0, 16) : "",
    appointment:
      i === 1 ? "2026-10-21T10:30" : i === 2 ? "2026-10-21T14:00" : "",
    feedback: i > 3 ? "Sim" : "",
  }));
}
export function createRequest(d: Draft, existing: Request[]): Request {
  let id = "";
  do {
    id = `AZUL-${Math.floor(1000 + Math.random() * 9000)}`;
  } while (existing.some((r) => r.id === id));
  return {
    id,
    pin: d.pin,
    created: now(),
    category: d.category,
    identity: d.identity,
    displayName: d.identity === "anonymous" ? "" : d.displayName.trim(),
    adult: d.adult || "Ana",
    status: "Novo",
    priority: d.urgent ? "Urgente" : "Normal",
    answers: d.answers,
    attachment: d.attachment,
    messages: [],
    timeline: [
      { date: now(), text: "Pedido recebido. Aguardando análise da equipe." },
    ],
    measures: [],
    note: "",
    nextCheck: "",
    appointment: "",
    feedback: "",
  };
}
