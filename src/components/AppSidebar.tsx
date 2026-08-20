import { Link, useRouterState } from "@tanstack/react-router";
import { GitBranch, GitPullRequest, History, LayoutDashboard, Workflow } from "lucide-react";

import { RepoSwitcher } from "@/components/repository/RepoSwitcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { repoFullName } from "@/lib/repository-utils";
import { useRepoStore } from "@/store/useRepoStore";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Pipelines", url: "/pipelines", icon: Workflow },
  { title: "Changes", url: "/changes", icon: GitBranch },
  { title: "Pull Requests", url: "/pull-requests", icon: GitPullRequest },
  { title: "History", url: "/history", icon: History },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { activeRepo } = useRepoStore();

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader className="gap-0 p-0">
        <div className="flex items-center gap-2 border-b border-sidebar-border px-4 py-3">
          <Workflow className="size-4 text-primary" aria-hidden="true" />
          <span className="text-sm font-semibold tracking-tight">Pipeline Control</span>
        </div>
        <RepoSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] tracking-widest uppercase">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="size-4" aria-hidden="true" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {activeRepo ? (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] tracking-widest uppercase">
              Working on
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="space-y-1 px-2 py-1 text-xs">
                <p className="truncate font-mono text-foreground">{repoFullName(activeRepo)}</p>
                <p className="font-mono text-muted-foreground">{activeRepo.branch}</p>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : null}
      </SidebarContent>
    </Sidebar>
  );
}
