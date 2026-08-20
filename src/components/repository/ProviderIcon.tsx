import { FolderGit2, Github, Gitlab } from "lucide-react";

import { cn } from "@/lib/utils";
import { providerLabel, type RepoProvider } from "@/lib/repository-utils";

export function ProviderIcon({
  provider,
  className,
}: {
  provider: RepoProvider;
  className?: string;
}) {
  const Icon = provider === "github" ? Github : provider === "gitlab" ? Gitlab : FolderGit2;
  return (
    <Icon
      className={cn("size-4 shrink-0 text-muted-foreground", className)}
      aria-label={providerLabel(provider)}
    />
  );
}
