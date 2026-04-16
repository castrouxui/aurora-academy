# Skill Registry — Aurora Academy

Generated: 2026-04-16

## User Skills

| Skill | Triggers |
|-------|----------|
| `banner-design` | designing banners, social media ads, promotional graphics |
| `branch-pr` | creating pull requests, PR workflow |
| `brand` | brand voice, visual identity, messaging |
| `design` | UI design, brand identity, visual design |
| `design-system` | design tokens, component specs, design system |
| `go-testing` | Go tests, Bubbletea TUI testing |
| `issue-creation` | creating GitHub issues |
| `judgment-day` | adversarial review, parallel review protocol |
| `skill-creator` | creating new AI skills |
| `slides` | HTML presentations, slide decks |
| `ui-styling` | UI styling, beautiful interfaces, accessible UI |
| `ui-ux-pro-max` | UI/UX design, web and mobile design intelligence |

## SDD Skills (Orchestrator)

| Skill | Purpose |
|-------|---------|
| `sdd-explore` | Investigate ideas before committing |
| `sdd-propose` | Create change proposal |
| `sdd-spec` | Write specifications |
| `sdd-design` | Technical design document |
| `sdd-tasks` | Break down into implementation tasks |
| `sdd-apply` | Implement tasks |
| `sdd-verify` | Validate implementation against specs |
| `sdd-archive` | Close change and persist final state |

## Project Conventions

- Conventional commits (feat:, fix:, refactor:)
- No build after changes
- TypeScript strict mode
- Next.js App Router patterns
- Server Components for data, Client Components for interactivity

## Compact Rules

```
STACK: Next.js 16 App Router + React 19 + TypeScript + Tailwind v4 + Prisma + PostgreSQL
AUTH: NextAuth v4 (Credentials + Google)
PAYMENTS: MercadoPago (preferences for courses, subscriptions for memberships)
ACCESS: purchase(approved/COMPLETED) OR active subscription OR company bundle
COMMITS: conventional commits — feat:, fix:, refactor:, no Co-Authored-By
NO BUILD: never run build after changes
COMPONENTS: Server Components for data fetching, Client Components ("use client") for interactivity
API: Next.js route handlers in src/app/api/
CSP: headers configured in next.config.ts — add new domains there
DEPLOY: push to main → Vercel auto-deploys to auroracademy.net
```
