"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { seedRequests, type Request, now } from "./model";
const KEY = "espaco-aluno-demo-v1";
type Store = {
  requests: Request[];
  ready: boolean;
  error: string;
  add: (r: Request) => void;
  update: (id: string, patch: Partial<Request>, event?: string) => void;
  reset: () => void;
};
const Context = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<Request[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      setRequests(
        Array.isArray(parsed) &&
          parsed.every((r) => r.id && Array.isArray(r.messages) && r.answers)
          ? parsed
          : seedRequests(),
      );
    } catch {
      setRequests(seedRequests());
      setError(
        "Não foi possível ler os dados salvos. Os exemplos foram restaurados.",
      );
    }
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(requests));
    } catch {
      setError(
        "O navegador não permitiu salvar os dados. Mantenha esta página aberta ou habilite o armazenamento local.",
      );
    }
  }, [requests, ready]);
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        try {
          const value = JSON.parse(e.newValue);
          if (Array.isArray(value)) setRequests(value);
        } catch {}
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const add = useCallback(
    (r: Request) => setRequests((items) => [r, ...items]),
    [],
  );
  const update = useCallback(
    (id: string, patch: Partial<Request>, event?: string) =>
      setRequests((items) =>
        items.map((r) =>
          r.id === id
            ? {
                ...r,
                ...patch,
                timeline: event
                  ? [...r.timeline, { date: now(), text: event }]
                  : r.timeline,
              }
            : r,
        ),
      ),
    [],
  );
  const reset = () => {
    sessionStorage.removeItem("student-draft");
    sessionStorage.removeItem("tracking-session");
    localStorage.removeItem("student-mood");
    localStorage.removeItem("school-tasks");
    localStorage.removeItem("school-hours");
    const seeds = seedRequests();
    try {
      localStorage.setItem(KEY, JSON.stringify(seeds));
    } catch {
      setError("Não foi possível restaurar os dados no armazenamento local.");
    }
    setRequests(seeds);
  };
  return (
    <Context.Provider value={{ requests, ready, error, add, update, reset }}>
      {children}
    </Context.Provider>
  );
}
export function useStore() {
  const s = useContext(Context);
  if (!s) throw new Error("StoreProvider ausente");
  return s;
}
