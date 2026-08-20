import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { matchesQuery, type Repository } from "@/lib/repository-utils";

import { RepoListItem } from "./RepoListItem";

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-3 pt-3 pb-1 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        {label}
      </p>
      {children}
    </div>
  );
}

export function RepoList({
  repositories,
  activeRepoId,
  onSelect,
  onRemove,
}: {
  repositories: Repository[];
  activeRepoId: string | null;
  onSelect: (id: string) => void;
  onRemove: (repo: Repository) => void;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(
    () => repositories.filter((repo) => matchesQuery(repo, query)),
    [repositories, query],
  );

  const grouped = useMemo(() => {
    if (query.trim() || results.length <= 4) return null;
    const sorted = [...results].sort((a, b) => b.addedAt - a.addedAt);
    return { recent: sorted.slice(0, 3), rest: sorted.slice(3) };
  }, [results, query]);

  return (
    <div>
      <div className="border-b border-border px-3 py-2.5">
        <p className="mb-2 text-xs font-medium text-foreground">Switch repository</p>
        <div className="flex items-center gap-2 rounded-sm border border-input bg-background px-2 focus-within:ring-2 focus-within:ring-ring">
          <Search className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search repositories..."
            aria-label="Search repositories"
            className="h-7 w-full bg-transparent font-mono text-[13px] text-foreground outline-none placeholder:font-sans placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div
        role="listbox"
        aria-label="Saved repositories"
        className="max-h-72 overflow-y-auto py-1"
      >
        {results.length === 0 ? (
          <p className="px-3 py-6 text-center text-xs text-muted-foreground">
            No repositories match{" "}
            <span className="font-mono text-foreground">{query.trim()}</span>
          </p>
        ) : grouped ? (
          <>
            <Group label="Recent">
              {grouped.recent.map((repo) => (
                <RepoListItem
                  key={repo.id}
                  repo={repo}
                  active={repo.id === activeRepoId}
                  onSelect={() => onSelect(repo.id)}
                  onRemove={() => onRemove(repo)}
                />
              ))}
            </Group>
            {grouped.rest.length > 0 ? (
              <Group label="All repositories">
                {grouped.rest.map((repo) => (
                  <RepoListItem
                    key={repo.id}
                    repo={repo}
                    active={repo.id === activeRepoId}
                    onSelect={() => onSelect(repo.id)}
                    onRemove={() => onRemove(repo)}
                  />
                ))}
              </Group>
            ) : null}
          </>
        ) : (
          results.map((repo) => (
            <RepoListItem
              key={repo.id}
              repo={repo}
              active={repo.id === activeRepoId}
              onSelect={() => onSelect(repo.id)}
              onRemove={() => onRemove(repo)}
            />
          ))
        )}
      </div>
    </div>
  );
}
