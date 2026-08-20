import { AlertCircle, Check, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  isValidBranch,
  parseRepoUrl,
  providerLabel,
  repoFullName,
} from "@/lib/repository-utils";
import { useRepoStore } from "@/store/useRepoStore";

export function AddRepoModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addRepository } = useRepoStore();
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [branch, setBranch] = useState("main");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setUrl("");
      setAlias("");
      setBranch("main");
      setSubmitting(false);
    }
  }, [open]);

  const parsed = useMemo(() => parseRepoUrl(url), [url]);
  const urlError = url.trim().length > 0 && !parsed;
  const branchError = branch.trim().length > 0 && !isValidBranch(branch);
  const canSubmit = Boolean(parsed) && branch.trim().length > 0 && !branchError && !submitting;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!parsed || !canSubmit) return;

    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 450));

    const result = addRepository({
      name: parsed.name,
      owner: parsed.owner,
      url: parsed.url,
      provider: parsed.provider,
      branch: branch.trim(),
      status: "connected",
      ...(alias.trim() ? { alias: alias.trim() } : {}),
    });

    setSubmitting(false);

    if (!result.ok) {
      toast.error("Repository already connected", {
        description: result.repo ? repoFullName(result.repo) : undefined,
      });
      return;
    }

    toast.success(`Connected to ${parsed.owner}/${parsed.name}`, {
      description: `Working branch ${branch.trim()}`,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Connect Repository</DialogTitle>
          <DialogDescription>
            Connect a Git repository as a CI/CD workspace. HTTPS and SSH URLs are supported.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="repo-url" className="text-xs">
              Repository URL
            </Label>
            <input
              id="repo-url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://github.com/acme/payment-service"
              autoComplete="off"
              spellCheck={false}
              aria-invalid={urlError}
              aria-describedby="repo-url-help"
              className="h-9 w-full rounded-sm border border-input bg-background px-2.5 font-mono text-[13px] text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive"
            />
            <p
              id="repo-url-help"
              role={urlError ? "alert" : undefined}
              aria-live="polite"
              className="flex items-start gap-1.5 text-xs"
            >
              {urlError ? (
                <>
                  <AlertCircle
                    className="mt-px size-3.5 shrink-0 text-destructive"
                    aria-hidden="true"
                  />
                  <span className="text-destructive">
                    Invalid repository URL. Use an HTTPS or SSH Git repository URL.
                  </span>
                </>
              ) : parsed ? (
                <>
                  <Check
                    className="mt-px size-3.5 shrink-0 text-status-connected"
                    aria-hidden="true"
                  />
                  <span className="text-status-connected">
                    {providerLabel(parsed.provider)} repository detected —{" "}
                    <span className="font-mono">
                      {parsed.owner}/{parsed.name}
                    </span>
                  </span>
                </>
              ) : (
                <span className="text-muted-foreground">
                  Provider, owner and repository name are detected automatically.
                </span>
              )}
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="repo-alias" className="text-xs">
              Display name <span className="text-muted-foreground">(optional)</span>
            </Label>
            <input
              id="repo-alias"
              value={alias}
              onChange={(event) => setAlias(event.target.value)}
              placeholder="Payment Service"
              className="h-9 w-full rounded-sm border border-input bg-background px-2.5 text-[13px] text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="repo-branch" className="text-xs">
              Working branch
            </Label>
            <input
              id="repo-branch"
              value={branch}
              onChange={(event) => setBranch(event.target.value)}
              placeholder="main"
              autoComplete="off"
              spellCheck={false}
              aria-invalid={branchError}
              aria-describedby="repo-branch-help"
              className="h-9 w-full rounded-sm border border-input bg-background px-2.5 font-mono text-[13px] text-foreground outline-none transition-shadow placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive"
            />
            <p
              id="repo-branch-help"
              role={branchError ? "alert" : undefined}
              className={branchError ? "text-xs text-destructive" : "text-xs text-muted-foreground"}
            >
              {branchError
                ? "Branch names may contain letters, numbers, dots, dashes and slashes."
                : "CI/CD operations run against this branch (main, dev, staging, release/v2)."}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={!canSubmit}>
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                  Connecting...
                </>
              ) : (
                "Connect Repository"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
