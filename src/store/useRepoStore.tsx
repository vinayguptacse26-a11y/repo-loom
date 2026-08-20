import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  createId,
  normalizeRepoUrl,
  type Repository,
} from "@/lib/repository-utils";

const STORAGE_KEY = "cicd.repository-workspace.v1";

type PersistedState = {
  repositories: Repository[];
  activeRepoId: string | null;
};

type RepoStore = PersistedState & {
  hydrated: boolean;
  /** operational context can be detached without unsaving the repository */
  contextEnabled: boolean;
  activeRepo: Repository | null;
  addRepository: (repo: Omit<Repository, "id" | "addedAt">) => { ok: boolean; repo?: Repository };
  removeRepository: (id: string) => void;
  setActiveRepository: (id: string) => void;
  clearActiveRepository: () => void;
  setContextEnabled: (enabled: boolean) => void;
};

const RepoStoreContext = createContext<RepoStore | null>(null);

function isRepository(value: unknown): value is Repository {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r["id"] === "string" &&
    typeof r["name"] === "string" &&
    typeof r["owner"] === "string" &&
    typeof r["url"] === "string" &&
    typeof r["branch"] === "string" &&
    (r["provider"] === "github" || r["provider"] === "gitlab" || r["provider"] === "git")
  );
}

function readStorage(): PersistedState {
  const empty: PersistedState = { repositories: [], activeRepoId: null };
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return empty;
    const candidate = parsed as Partial<PersistedState>;
    const repositories = Array.isArray(candidate.repositories)
      ? candidate.repositories.filter(isRepository)
      : [];
    const activeRepoId =
      typeof candidate.activeRepoId === "string" &&
      repositories.some((r) => r.id === candidate.activeRepoId)
        ? candidate.activeRepoId
        : (repositories[0]?.id ?? null);
    return { repositories, activeRepoId };
  } catch {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    return empty;
  }
}

export function RepoStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PersistedState>({ repositories: [], activeRepoId: null });
  const [hydrated, setHydrated] = useState(false);
  const [contextEnabled, setContextEnabled] = useState(true);

  useEffect(() => {
    setState(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable — keep working in memory */
    }
  }, [state, hydrated]);

  const addRepository = useCallback<RepoStore["addRepository"]>((input) => {
    let result: { ok: boolean; repo?: Repository } = { ok: false };
    setState((prev) => {
      const key = normalizeRepoUrl(input.url);
      const existing = prev.repositories.find((r) => normalizeRepoUrl(r.url) === key);
      if (existing) {
        result = { ok: false, repo: existing };
        return prev;
      }
      const repo: Repository = { ...input, id: createId(), addedAt: Date.now() };
      result = { ok: true, repo };
      return { repositories: [repo, ...prev.repositories], activeRepoId: repo.id };
    });
    return result;
  }, []);

  const removeRepository = useCallback((id: string) => {
    setState((prev) => {
      const repositories = prev.repositories.filter((r) => r.id !== id);
      const activeRepoId =
        prev.activeRepoId === id ? (repositories[0]?.id ?? null) : prev.activeRepoId;
      return { repositories, activeRepoId };
    });
  }, []);

  const setActiveRepository = useCallback((id: string) => {
    setState((prev) =>
      prev.repositories.some((r) => r.id === id) ? { ...prev, activeRepoId: id } : prev,
    );
    setContextEnabled(true);
  }, []);

  const clearActiveRepository = useCallback(() => {
    setState((prev) => ({ ...prev, activeRepoId: null }));
  }, []);

  const value = useMemo<RepoStore>(() => {
    const activeRepo = state.repositories.find((r) => r.id === state.activeRepoId) ?? null;
    return {
      ...state,
      hydrated,
      contextEnabled,
      activeRepo,
      addRepository,
      removeRepository,
      setActiveRepository,
      clearActiveRepository,
      setContextEnabled,
    };
  }, [
    state,
    hydrated,
    contextEnabled,
    addRepository,
    removeRepository,
    setActiveRepository,
    clearActiveRepository,
  ]);

  return <RepoStoreContext.Provider value={value}>{children}</RepoStoreContext.Provider>;
}

export function useRepoStore(): RepoStore {
  const ctx = useContext(RepoStoreContext);
  if (!ctx) throw new Error("useRepoStore must be used inside <RepoStoreProvider>");
  return ctx;
}
