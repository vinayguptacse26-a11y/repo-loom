export type RepoProvider = "github" | "gitlab" | "git";

export type Repository = {
  id: string;
  name: string;
  owner: string;
  url: string;
  branch: string;
  provider: RepoProvider;
  addedAt: number;
  alias?: string;
  status?: "connected" | "idle";
};

export type ParsedRepo = {
  provider: RepoProvider;
  owner: string;
  name: string;
  url: string;
};

const HTTPS_RE = /^https:\/\/([\w.-]+)\/([\w.~-]+(?:\/[\w.~-]+)*)\/([\w.~-]+?)(?:\.git)?\/?$/i;
const SSH_RE = /^git@([\w.-]+):([\w.~-]+(?:\/[\w.~-]+)*)\/([\w.~-]+?)(?:\.git)?\/?$/i;

function providerFromHost(host: string): RepoProvider {
  const h = host.toLowerCase();
  if (h.includes("github")) return "github";
  if (h.includes("gitlab")) return "gitlab";
  return "git";
}

export function providerLabel(provider: RepoProvider): string {
  if (provider === "github") return "GitHub";
  if (provider === "gitlab") return "GitLab";
  return "Git";
}

/** Parse an HTTPS or SSH git URL into provider/owner/name. Returns null when invalid. */
export function parseRepoUrl(input: string): ParsedRepo | null {
  const raw = input.trim();
  if (!raw) return null;

  const match = HTTPS_RE.exec(raw) ?? SSH_RE.exec(raw);
  if (!match) return null;

  const [, host, owner, name] = match;
  if (!owner || !name) return null;

  const provider = providerFromHost(host);
  return {
    provider,
    owner,
    name,
    url: `https://${host.toLowerCase()}/${owner}/${name}`,
  };
}

/** Normalized comparison key so `.git`, trailing slashes and case don't create duplicates. */
export function normalizeRepoUrl(input: string): string {
  const parsed = parseRepoUrl(input);
  if (parsed) return `${parsed.provider}:${parsed.owner.toLowerCase()}/${parsed.name.toLowerCase()}`;
  return input.trim().toLowerCase().replace(/\.git$/, "").replace(/\/+$/, "");
}

export function repoFullName(repo: Repository): string {
  return `${repo.owner}/${repo.name}`;
}

/** Case-insensitive fuzzy match across name, owner, alias and URL. */
export function matchesQuery(repo: Repository, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [repoFullName(repo), repo.owner, repo.name, repo.alias ?? "", repo.url, repo.branch]
    .join(" ")
    .toLowerCase();
  if (haystack.includes(q)) return true;

  // loose subsequence match
  let i = 0;
  for (const char of haystack) {
    if (char === q[i]) i++;
    if (i === q.length) return true;
  }
  return false;
}

export function createId(): string {
  return `repo_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function isValidBranch(branch: string): boolean {
  return /^[\w.\-/]+$/.test(branch.trim());
}
