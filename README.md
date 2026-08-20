# Workspace Hub

Task: Design and Implement an Enterprise Repository Workspace
Design and implement an enterprise-grade Repository Workspace and Repository Switcher for a CI/CD automation application.
The experience should feel like a modern developer tool / engineering workspace, not a generic chatbot interface.
The repository is the central context of the user's work. The UI should make it immediately obvious:
Which repository is active
Which branch is being worked on
Whether the repository is connected
What actions can be performed
How to switch repositories
How to add or remove repositories
Use:
React
TypeScript
Tailwind CSS
Shadcn UI
lucide-react
Sonner
Follow the application's existing design system and component architecture.
1. UX Direction
Do not design this as a typical AI chatbot UI.
Avoid:
Large floating chat bubbles
Generic "AI assistant" styling
Oversized context pills
Excessive rounded cards
Decorative AI gradients
ChatGPT-style conversation chrome
Instead, use a developer workspace aesthetic inspired by modern source-control and engineering tools.
Think:
Repository
     ↓
Branch
     ↓
CI/CD Operations
     ↓
Agent Actions
     ↓
Execution / Results
The repository should feel like the user's current workspace.
2. Overall Layout
The repository experience should have three conceptual areas:
┌──────────────────────────────────────────────────────────┐
│ SIDEBAR                                                  │
│                                                          │
│ Repository Workspace                                    │
│ ┌──────────────────────────────────────────────────────┐ │
│ │ GitHub  acme/payment-service                         │ │
│ │         main · Connected                         ˅   │ │
│ └──────────────────────────────────────────────────────┘ │
│                                                          │
│ Navigation                                               │
│ Dashboard                                                │
│ Pipelines                                                │
│ Changes                                                  │
│ Pull Requests                                            │
│ History                                                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
                    MAIN WORKSPACE
┌──────────────────────────────────────────────────────────┐
│ acme/payment-service                         Connected   │
│ main · GitHub                                            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│              Existing application content                │
│                                                          │
└──────────────────────────────────────────────────────────┘
The repository should be visible in both the sidebar and the main workspace where useful, but avoid unnecessary duplication.
3. Sidebar Repository Switcher
Create:
RepoSwitcher.tsx
Place it near the top of the navigation sidebar.
The component should behave more like a workspace selector than a generic dropdown.
4. Compact Workspace Trigger
The trigger should contain:
GitHub icon
acme/payment-service
main
Connected
Chevron
Suggested hierarchy:
┌───────────────────────────────────────┐
│  ◉  acme/payment-service           ˅ │
│     main · Connected                  │
└───────────────────────────────────────┘
The repository name should have stronger visual emphasis than the branch.
Use:
font-mono
for:
owner/repository
branch
The status should remain subtle.
5. Repository Switcher Popover
When opened, the UI should feel like a workspace picker.
Example:
┌────────────────────────────────────────────┐
│  Switch repository                         │
│                                            │
│  [ Search repositories...              ]   │
│                                            │
│  RECENT                                    │
│                                            │
│  ● acme/payment-service          main      │
│    GitHub · Connected                      │
│                                            │
│  ○ acme/order-service            dev       │
│    GitHub · Idle                           │
│                                            │
│  ○ platform/infrastructure       staging   │
│    GitLab · Connected                      │
│                                            │
├────────────────────────────────────────────┤
│  + Connect another repository              │
└────────────────────────────────────────────┘
Use grouping when useful:
Recent
All repositories
Do not overcomplicate the list if there are only a few repositories.
6. Repository Search
Provide real-time fuzzy search.
Search across:
repository name
owner
alias
URL
Example:
payment
should match:
acme/payment-service
acme/payment-worker
payments/api
Search should be case-insensitive.
7. Active Repository
The active repository should be visually distinct.
Use:
subtle accent background
checkmark
provider icon
branch indicator
Avoid excessive highlighting.
Example:
✓  acme/payment-service
   main · GitHub
8. Repository Actions
Do not clutter every repository item.
Actions should appear on:
hover
keyboard focus
Available actions:
Open Repository
Use:
ExternalLink
Tooltip:
Open repository
Open in a new browser tab.
Remove Repository
Use:
Trash2
Show confirmation before removal.
Example:
Remove repository?
This will remove the repository from
your saved workspaces.
[Cancel] [Remove]
Do not imply that removing the repository deletes it from GitHub.
The action only removes it from the application's saved repositories.
9. Add Repository
Use:
+ Connect Repository
instead of simply:
+ Add Repository
This better communicates that the repository is becoming a workspace.
The action should be visually distinct but not oversized.
10. AddRepoModal.tsx
Create a repository connection dialog.
The design should feel like an engineering configuration dialog, not a chatbot form.
Suggested layout:
┌────────────────────────────────────────────┐
│ Connect Repository                     ×   │
│                                            │
│ Repository URL                             │
│ ┌────────────────────────────────────────┐ │
│ │ https://github.com/acme/payment        │ │
│ └────────────────────────────────────────┘ │
│ ✓ GitHub repository detected              │
│                                            │
│ Display name (optional)                   │
│ ┌────────────────────────────────────────┐ │
│ │ Payment Service                         │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ Working branch                             │
│ ┌────────────────────────────────────────┐ │
│ │ main                                   │ │
│ └────────────────────────────────────────┘ │
│                                            │
│              Cancel   Connect Repository  │
└────────────────────────────────────────────┘
11. Repository URL Validation
Accept:
HTTPS
https://github.com/owner/repository
https://gitlab.com/owner/repository
SSH
git@github.com:owner/repository.git
git@gitlab.com:owner/repository.git
Validate in real time.
Show inline errors:
Invalid repository URL.
Use an HTTPS or SSH Git repository URL.
Once valid, provide positive feedback:
✓ GitHub repository detected
Do not overuse success messages.
12. Automatic Repository Metadata
When the URL is parsed, derive:
provider
owner
repository name
Example:
https://github.com/acme/payment-service
becomes:
Provider: GitHub
Owner: acme
Repository: payment-service
Do not require the user to manually select the provider.
13. Branch
Default:
main
Allow:
dev
staging
release/v2
Use monospace styling.
The field should communicate:
This is the branch the CI/CD workspace will operate against.
14. Connection Status
Use status consistently throughout the application.
Connected
● Connected
Idle
● Idle
Use color plus text.
Never communicate status using color alone.
15. Repository Header in Main Workspace
If the application's main workspace supports a repository header, use a compact developer-oriented header.
Example:
┌──────────────────────────────────────────────────────┐
│ GitHub                                               │
│ acme/payment-service                                 │
│                                                      │
│ main   ·   Connected                                 │
│                                                      │
│ [Changes] [Pipelines] [Pull Requests] [History]      │
└──────────────────────────────────────────────────────┘
Do not force this header onto every page.
Use it where repository context is important.
16. Repository Context for Agent Operations
Instead of showing:
Context: owner/repository (branch)
as a chatbot-style pill above the prompt, represent the repository context through the workspace itself.
For example:
Repository
acme/payment-service
Branch
main
or:
Working on
acme/payment-service · main
This information can appear near the CI/CD operation area.
The UI should communicate:
The agent is operating within this repository workspace.
rather than:
This is a chatbot context.
17. Optional Context Detach
If the application supports temporarily detaching the repository from a specific operation, do not use a generic X pill.
Instead provide an explicit action such as:
Clear workspace context
or:
Use without repository
This should be a deliberate operation rather than a casual dismiss action.
Important:
Clearing operational context must not remove the repository from saved repositories.
18. Global Repository Store
Create:
useRepoStore.ts
Use the application's existing state-management approach.
If none exists, use Zustand or React Context.
Store:
type Repository = {
  id: string;
  name: string;
  owner: string;
  url: string;
  branch: string;
  provider: "github" | "gitlab" | "git";
  addedAt: number;
  alias?: string;
};
State:
activeRepoId: string | null;
repositories: Repository[];
Actions:
addRepository()
removeRepository()
setActiveRepository()
clearActiveRepository()
19. Persistence
Persist repository state using:
localStorage
Persist:
repositories
activeRepoId
On application startup:
Application
     ↓
Hydrate repository store
     ↓
Restore active workspace
Handle invalid or corrupted localStorage safely.
20. Duplicate Repository Detection
Prevent duplicate saved repositories.
Normalize URLs before comparison.
For example:
https://github.com/acme/payment-service
and:
https://github.com/acme/payment-service.git
should be treated as the same repository where appropriate.
Show:
Repository already connected.
instead of creating another entry.
21. Keyboard Shortcut
Support:
Ctrl + K
Cmd + K
Use this shortcut to open:
Connect Repository
Do not hijack the shortcut while the user is typing in an input/textarea unless the application's global shortcut architecture explicitly supports that behavior.
Clean up event listeners correctly.
22. Accessibility
The repository workspace must be fully keyboard accessible.
Requirements:
Proper button semantics
Accessible repository selector
Keyboard navigation
Visible focus states
ARIA labels
Accessible modal
Escape-to-close
Focus restoration
Accessible error messages
Icon-only buttons with accessible names
Tooltips for unfamiliar actions
Do not depend only on color for:
Connected
Idle
Active
Error
23. Design System
Use Shadcn semantic tokens:
bg-sidebar
bg-background
bg-muted
bg-accent
border-border
text-foreground
text-muted-foreground
Avoid hardcoded colors.
The component must support:
Light mode
Dark mode
without special-case styling hacks.
24. Visual Language
The design should communicate:
Developer Tool
     +
Repository Workspace
     +
CI/CD Operations
It should feel:
precise
compact
professional
technical
information-dense but readable
calm
enterprise-ready
Avoid making every element a card.
Use borders and spacing to establish hierarchy.
25. Icons
Use lucide-react.
Preferred icons:
Github
GitBranch
FolderGit2
Check
ChevronsUpDown
Plus
Trash2
ExternalLink
X
Use icons primarily to reinforce meaning rather than as decoration.
26. Micro-Interactions
Use subtle transitions for:
repository switching
popover opening
hover actions
active repository state
loading state
confirmation state
Respect reduced-motion preferences.
Avoid excessive animation.
27. Toast Notifications
Use Sonner for meaningful state changes.
Examples:
Connected to acme/payment-service
Switched to acme/payment-service
Repository removed from workspace
Repository already connected
Do not show toasts for every UI interaction.
28. Empty State
If there are no saved repositories:
┌──────────────────────────────────────┐
│ Repository Workspace                │
│                                      │
│ No repositories connected            │
│                                      │
│ Connect a repository to start        │
│ working with your CI/CD workflow.    │
│                                      │
│ [ + Connect Repository ]             │
└──────────────────────────────────────┘
The empty state should clearly explain what the user needs to do next.
29. Repository Removal Behavior
If removing the active repository:
Remove confirmation
       ↓
Remove repository
       ↓
If other repositories exist:
    select next appropriate repository
Otherwise:
    activeRepoId = null
       ↓
Persist
       ↓
Update workspace
Never silently delete repository data from the actual Git provider.
30. Component Structure
Recommended:
components/
│
├── repository/
│   ├── RepoSwitcher.tsx
│   ├── RepoList.tsx
│   ├── RepoListItem.tsx
│   ├── AddRepoModal.tsx
│   ├── RemoveRepoDialog.tsx
│   ├── RepositoryHeader.tsx
│   └── RepositoryStatus.tsx
│
└── ...
    
store/
└── useRepoStore.ts
lib/
└── repository-utils.ts
Do not create every component if the existing project is small. Split components only where it improves maintainability.
31. Implementation Rules
Before implementing:
Inspect the existing application.
Identify the existing sidebar implementation.
Identify existing Shadcn components.
Identify existing state management.
Identify existing toast configuration.
Identify existing typography and spacing conventions.
Reuse existing primitives.
Avoid introducing duplicate abstractions.
Do not hardcode repositories.
Keep repository parsing and validation outside JSX.
32. Acceptance Criteria
The feature is complete when:
Workspace
 Repository is clearly visible near the top of the sidebar.
 Active repository is immediately identifiable.
 Branch is visible.
 Provider is visible.
 Connection status is visible.
 Repository can be switched quickly.
 Search works across repository metadata.
Connection
 HTTPS URLs work.
 SSH URLs work.
 Provider is automatically detected.
 Owner/name are automatically extracted.
 Branch defaults to main.
 Custom branches work.
 Duplicate repositories are prevented.
 Loading state is displayed.
Repository Management
 Repository can be opened externally.
 Repository can be removed with confirmation.
 Removing a repository does not affect the actual Git provider.
 Active repository updates correctly.
 State persists across refresh.
CI/CD Workspace
 Active repository is available to CI/CD operations.
 Branch is available to CI/CD operations.
 Repository context is represented as workspace state rather than generic chatbot UI.
 Temporary context clearing does not remove the saved repository.
Accessibility
 Keyboard navigation works.
 Focus states are visible.
 Modal focus management works.
 Icon buttons have accessible labels.
 Errors are accessible.
 Status does not depend only on color.
Visual
 Matches existing Shadcn design system.
 Supports dark mode.
 Uses semantic theme tokens.
 Uses monospace typography for repository identifiers.
 Does not look like a generic chatbot.
 Does not use excessive cards, gradients, or decorative AI styling.
33. Design Goal
The final experience should communicate:
"This is my current engineering workspace."
Not:
"This is a chatbot with a repository attached."
The repository, branch, and CI/CD state should feel like first-class application state.
The agent is an operational capability inside that workspace, not the visual identity of the workspace.
Prioritize:
Developer ergonomics → clarity → safety → accessibility → consistency → visual polish.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/92519563-25df-47bc-8cab-35c1bf50f9fe).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
