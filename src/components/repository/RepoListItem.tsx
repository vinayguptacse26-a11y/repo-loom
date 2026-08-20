import { Check, ExternalLink, GitBranch, Trash2 } from "lucide-react";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { providerLabel, repoFullName, type Repository } from "@/lib/repository-utils";

import { ProviderIcon } from "./ProviderIcon";
import { RepositoryStatus } from "./RepositoryStatus";

export function RepoListItem({
  repo,
  active,
  onSelect,
  onRemove,
}: {
  repo: Repository;
  active: boolean;
  onSelect: () => void;
  onRemove: () => void;
}) {
  const fullName = repoFullName(repo);

  return (
    <div
      className={cn(
        "group relative flex items-start gap-2.5 border-l-2 px-3 py-2 transition-colors",
        active ? "border-l-primary bg-accent/60" : "border-l-transparent hover:bg-accent/40",
      )}
    >
      <button
        type="button"
        onClick={onSelect}
        aria-current={active ? "true" : undefined}
        className="flex min-w-0 flex-1 items-start gap-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      >
        <span className="mt-0.5 flex size-4 items-center justify-center">
          {active ? (
            <Check className="size-3.5 text-primary" aria-hidden="true" />
          ) : (
            <ProviderIcon provider={repo.provider} className="size-3.5" />
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-baseline justify-between gap-2">
            <span className="truncate font-mono text-[13px] font-medium text-foreground">
              {fullName}
            </span>
            <span className="flex shrink-0 items-center gap-1 font-mono text-[11px] text-muted-foreground">
              <GitBranch className="size-3" aria-hidden="true" />
              {repo.branch}
            </span>
          </span>
          <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{providerLabel(repo.provider)}</span>
            <span aria-hidden="true">·</span>
            <RepositoryStatus status={repo.status ?? "connected"} />
          </span>
          {active ? <span className="sr-only">Active repository</span> : null}
        </span>
      </button>

      <span className="flex items-center gap-0.5 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`Open repository ${fullName} in a new tab`}
              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </TooltipTrigger>
          <TooltipContent side="top">Open repository</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove repository ${fullName} from workspaces`}
              className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-destructive focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Trash2 className="size-3.5" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">Remove from workspaces</TooltipContent>
        </Tooltip>
      </span>
    </div>
  );
}
