import { cn } from "@/lib/utils";

type Status = "connected" | "idle";

export function RepositoryStatus({
  status = "connected",
  className,
}: {
  status?: Status;
  className?: string;
}) {
  const connected = status === "connected";
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs", className)}>
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          connected ? "bg-status-connected" : "bg-status-idle",
        )}
      />
      <span className={connected ? "text-status-connected" : "text-muted-foreground"}>
        {connected ? "Connected" : "Idle"}
      </span>
    </span>
  );
}
