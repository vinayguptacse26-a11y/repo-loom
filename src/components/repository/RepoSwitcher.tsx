import { ChevronsUpDown, FolderGit2, GitBranch, Plus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { repoFullName, type Repository } from "@/lib/repository-utils";
import { useRepoStore } from "@/store/useRepoStore";

import { AddRepoModal } from "./AddRepoModal";
import { ProviderIcon } from "./ProviderIcon";
import { RemoveRepoDialog } from "./RemoveRepoDialog";
import { RepoList } from "./RepoList";
import { RepositoryStatus } from "./RepositoryStatus";

export function RepoSwitcher() {
  const {
    repositories,
    activeRepoId,
    activeRepo,
    hydrated,
    setActiveRepository,
    removeRepository,
  } = useRepoStore();

  const [open, setOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<Repository | null>(null);

  const openConnect = useCallback(() => {
    setOpen(false);
    setAddOpen(true);
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== "k" || !(event.metaKey || event.ctrlKey)) return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      event.preventDefault();
      openConnect();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openConnect]);

  function handleSelect(id: string) {
    setOpen(false);
    if (id === activeRepoId) return;
    setActiveRepository(id);
    const repo = repositories.find((r) => r.id === id);
    if (repo) toast.success(`Switched to ${repoFullName(repo)}`);
  }

  function handleConfirmRemoval() {
    if (!pendingRemoval) return;
    removeRepository(pendingRemoval.id);
    toast.success("Repository removed from workspace", {
      description: repoFullName(pendingRemoval),
    });
    setPendingRemoval(null);
  }

  return (
    <div className="border-b border-sidebar-border px-3 py-3">
      <p className="mb-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
        Repository Workspace
      </p>

      {!hydrated ? (
        <div className="h-12 animate-pulse rounded-sm border border-sidebar-border bg-muted/50" />
      ) : repositories.length === 0 ? (
        <div className="rounded-sm border border-dashed border-sidebar-border px-3 py-3">
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
            <FolderGit2 className="size-3.5 text-muted-foreground" aria-hidden="true" />
            No repositories connected
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Connect a repository to start working with your CI/CD workflow.
          </p>
          <Button size="sm" className="mt-3 h-7 w-full text-xs" onClick={openConnect}>
            <Plus className="size-3.5" aria-hidden="true" />
            Connect Repository
          </Button>
        </div>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label={
                activeRepo
                  ? `Active repository ${repoFullName(activeRepo)} on branch ${activeRepo.branch}. Switch repository`
                  : "Select a repository"
              }
              className="flex w-full items-center gap-2.5 rounded-sm border border-sidebar-border bg-background px-2.5 py-2 text-left transition-colors hover:bg-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {activeRepo ? (
                <ProviderIcon provider={activeRepo.provider} />
              ) : (
                <FolderGit2 className="size-4 text-muted-foreground" aria-hidden="true" />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-[13px] font-medium text-foreground">
                  {activeRepo ? repoFullName(activeRepo) : "Select repository"}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                  {activeRepo ? (
                    <>
                      <span className="flex items-center gap-1 font-mono">
                        <GitBranch className="size-3" aria-hidden="true" />
                        {activeRepo.branch}
                      </span>
                      <span aria-hidden="true">·</span>
                      <RepositoryStatus status={activeRepo.status ?? "connected"} />
                    </>
                  ) : (
                    <span>No active workspace</span>
                  )}
                </span>
              </span>
              <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            </button>
          </PopoverTrigger>

          <PopoverContent align="start" className="w-[22rem] rounded-md p-0">
            <RepoList
              repositories={repositories}
              activeRepoId={activeRepoId}
              onSelect={handleSelect}
              onRemove={(repo) => {
                setOpen(false);
                setPendingRemoval(repo);
              }}
            />
            <div className="border-t border-border p-1.5">
              <button
                type="button"
                onClick={openConnect}
                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-[13px] font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Plus className="size-3.5" aria-hidden="true" />
                Connect another repository
                <kbd className="ml-auto font-mono text-[10px] text-muted-foreground">⌘K</kbd>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      )}

      <AddRepoModal open={addOpen} onOpenChange={setAddOpen} />
      <RemoveRepoDialog
        repo={pendingRemoval}
        open={pendingRemoval !== null}
        onOpenChange={(next) => {
          if (!next) setPendingRemoval(null);
        }}
        onConfirm={handleConfirmRemoval}
      />
    </div>
  );
}
