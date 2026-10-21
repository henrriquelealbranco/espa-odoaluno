"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import {
  Notebook,
  RefreshCw,
  Home,
  ClipboardList,
  UserRound,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import { useStore } from "@/lib/store";
export function Brand({ team = false }: { team?: boolean }) {
  return (
    <Link href={team ? "/equipe" : "/aluno"} className="brand">
      <span className="brand-icon">
        <Notebook size={29} />
      </span>
      <span>Espaço do Aluno{team && <small>Equipe escolar</small>}</span>
    </Link>
  );
}
export function DiscreetButton() {
  const router = useRouter();
  return (
    <button
      className="switch"
      onClick={() => {
        document.title = "Minhas Atividades";
        router.replace("/atividades");
      }}
    >
      <RefreshCw size={16} />
      Trocar de tela
    </button>
  );
}
export function StudentShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  const router = useRouter();
  const path = usePathname();
  const escape = useRef(0);
  const { error } = useStore();
  useEffect(() => {
    document.title =
      path === "/atividades" ? "Minhas Atividades" : "Espaço do Aluno";
    const listener = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const time = Date.now();
      if (time - escape.current < 650) {
        document.title = "Minhas Atividades";
        router.replace("/atividades");
        escape.current = 0;
      } else escape.current = time;
    };
    window.addEventListener("keydown", listener);
    return () => window.removeEventListener("keydown", listener);
  }, [path, router]);
  return (
    <div className="student-wrap">
      <header className="student-header">
        <Brand />
        <DiscreetButton />
      </header>
      <main id="main" className={`student-main ${wide ? "wide" : ""}`}>
        {error && (
          <p role="alert" className="notice warning">
            {error}
          </p>
        )}
        {children}
      </main>
      <nav aria-label="Navegação do aluno" className="student-nav">
        {[
          { href: "/aluno", label: "Início", icon: Home },
          { href: "/atividades", label: "Atividades", icon: ClipboardList },
          { href: "/acompanhar", label: "Meu espaço", icon: UserRound },
        ].map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={path === href ? "active" : ""}
          >
            <Icon size={22} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
export function DemoBar() {
  const { reset } = useStore();
  const router = useRouter();
  return (
    <footer className="demo-bar">
      <span className="eyebrow">Apresentação do protótipo</span>
      <div>
        <Link href="/aluno">
          Ver experiência do estudante <ArrowUpRight size={14} />
        </Link>
        <Link href="/equipe">
          Ver painel demonstrativo da escola <ArrowUpRight size={14} />
        </Link>
        <button
          onClick={() => {
            reset();
            router.replace("/aluno");
            window.location.reload();
          }}
        >
          <RotateCcw size={14} />
          Reiniciar demonstração
        </button>
      </div>
      <small>Dados fictícios · Piloto sem fins lucrativos</small>
    </footer>
  );
}
export function SectionHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="section-heading">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
