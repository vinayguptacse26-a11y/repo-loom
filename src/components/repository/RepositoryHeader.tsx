import { Link, useRouterState } from "@tanstack/react-router";
import { ExternalLink, GitBranch } from "lucide-react";

import { cn } from "@/lib/utils";
import { providerLabel, repoFullName } from "@/lib/repository-utils";
import { useRepoStore } from "@/store/useRepoStore";

import { ProviderIcon } from "./ProviderIcon";
import { RepositoryStatus } from "./RepositoryStatus";

const tabs = [
  { label: "Dashboard", to: "/" },
  { label: "Changes", to: "/changes" },
  { label: "Pipelines", to: "/pipelines" },
  { label: "Pull Requests", to: "/pull-requests" },
  { label: "History", to: "/history" },
] as const;

export function RepositoryHeader({ showTabs = true }: { showTabs?: boolean }) {
  const { activeRepo } = useRepoStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="border-b border-border bg-background">
      <div className="flex flex-wrap items-start justify-between gap-3 px-6 pt-4 pb-3">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-[11px] tracking-wide text-muted-foreground uppercase">
            {activeRepo ? (
              <>
                <ProviderIcon provider={activeRepo.provider} className="size-3.5" />
                {providerLabel(activeRepo.provider)}
              </>
            ) : (
              "No workspace"
            )}
          </p>
          <h1 className="mt-1 truncate font-mono text-lg font-semibold text-foreground">
            {activeRepo ? repoFullName(activeRepo) : "Select a repository"}
          </h1>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            {activeRepo ? (
              <>
                <span className="flex items-center gap-1 font-mono text-foreground">
                  <GitBranch className="size-3" aria-hidden="true" />
                  {activeRepo.branch}
                </span>
                <span aria-hidden="true">·</span>
                <RepositoryStatus status={activeRepo.status ?? "connected"} />
              </>
            ) : (
              <span>Connect a repository to run CI/CD operations.</span>
            )}
          </div>
        </div>

        {activeRepo ? (
          <a
            href={activeRepo.url}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1.5 rounded-sm border border-border px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ExternalLink className="size-3.5" aria-hidden="true" />
            Open repository
          </a>
        ) : null}
      </div>

      {showTabs ? (
        <nav aria-label="Repository sections" className="flex gap-1 overflow-x-auto px-4">
          {tabs.map((tab) => {
            const active = pathname === tab.to;
            return (
              <Link
                key={tab.to}
                to={tab.to}
                className={cn(
                  "-mb-px border-b-2 px-2.5 py-2 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active
                    ? "border-primary font-medium text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </header>
  );
}
