import type { ReactNode } from "react";

export function WorkspaceSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border px-6 py-5 last:border-b-0">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      {description ? (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}

export function EmptyWorkspaceNotice({ label }: { label: string }) {
  return (
    <div className="border border-dashed border-border px-4 py-8 text-center">
      <p className="text-sm font-medium text-foreground">No repository workspace selected</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Connect or activate a repository to view {label}.
      </p>
    </div>
  );
}
