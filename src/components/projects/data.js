/* Static content + helpers for the Projects overlay. */

export const VIEWS = [
  { id: 'explore', label: 'Explore' },
  { id: 'mine', label: 'My Projects' },
];

/* ─────────────── Explore ─────────────── */

export const FILTERS = [
  { id: 'all', label: 'All', count: 75 },
  { id: 'roadmaps', label: 'Roadmaps', count: 9 },
  { id: 'specialty', label: 'Specialty', count: 28 },
  { id: 'tools', label: 'Tools', count: 38 },
];

export const CATEGORIES = [
  {
    id: 'all-projects',
    title: 'All projects',
    count: 75,
    blurb: 'Everything across roadmaps, specialties and tools.',
    featured: true,
    filter: 'all',
  },
  {
    id: 'new-this-week',
    title: 'New this week',
    count: 13,
    blurb: 'Fresh roadmaps and tools added in the last 7 days.',
    filter: 'all',
  },
  {
    id: 'ai-ml',
    title: 'AI / ML',
    count: 37,
    blurb: 'Agents, RAG, embeddings, fine-tuning, evals.',
    filter: 'specialty',
  },
  {
    id: 'claude-code',
    title: 'Claude Code',
    count: 21,
    blurb: 'Hooks, sub-agents, MCP servers, slash commands.',
    filter: 'tools',
  },
  {
    id: 'second-brain',
    title: 'AI Second Brain',
    count: 9,
    blurb: 'Capture, retrieve and act on your own knowledge.',
    filter: 'roadmaps',
  },
  {
    id: 'productivity',
    title: 'Productivity',
    count: 15,
    blurb: 'Automate the small stuff so the big stuff ships.',
    filter: 'tools',
  },
  {
    id: 'web-fundamentals',
    title: 'Web Fundamentals',
    count: 18,
    blurb: 'HTML, CSS, accessibility and the modern browser.',
    filter: 'roadmaps',
  },
  {
    id: 'backend-engineering',
    title: 'Backend Engineering',
    count: 24,
    blurb: 'APIs, databases, queues and service design.',
    filter: 'roadmaps',
  },
  {
    id: 'devops-cloud',
    title: 'DevOps & Cloud',
    count: 19,
    blurb: 'CI/CD, containers, infra-as-code and observability.',
    filter: 'specialty',
  },
  {
    id: 'data-engineering',
    title: 'Data Engineering',
    count: 16,
    blurb: 'Pipelines, warehouses, streaming and orchestration.',
    filter: 'specialty',
  },
  {
    id: 'security',
    title: 'Security',
    count: 12,
    blurb: 'Threat modelling, secrets, auth and hardening.',
    filter: 'specialty',
  },
  {
    id: 'mcp-servers',
    title: 'MCP Servers',
    count: 14,
    blurb: 'Connect Claude to your tools, data and APIs.',
    filter: 'tools',
  },
  {
    id: 'design-engineering',
    title: 'Design Engineering',
    count: 11,
    blurb: 'Design tokens, component libraries and design-to-code.',
    filter: 'tools',
  },
  {
    id: 'mobile',
    title: 'Mobile',
    count: 13,
    blurb: 'React Native, Expo and shipping to the app stores.',
    filter: 'roadmaps',
  },
];

export const RECOMMENDATIONS = [
  'Build a Claude app with tool use',
  'Secure a Postgres database',
  'Ship a Next.js side project',
];

/* ─────────────── My Projects ─────────────── */

export const MY_PROJECTS = [
  {
    id: 'micro-interactions',
    title: 'Micro Interactions with Motion + Rive',
    tag: 'React Animation',
    source: 'Created by you',
    when: '2h ago',
    done: 2,
    total: 6,
  },
  {
    id: 'design-to-code',
    title: 'Design to Code: Paper + Claude Code via MCP',
    tag: 'AI Design (Part 1)',
    source: 'NextWork',
    when: 'Yesterday',
    done: 3,
    total: 5,
  },
  {
    id: 'automate-second-brain',
    title: 'Automate Your AI Second Brain',
    tag: 'AI Second Brain (Part 2)',
    source: 'NextWork',
    when: '5d ago',
    done: 0,
    total: 7,
  },
  {
    id: 'build-second-brain',
    title: 'Build an AI Second Brain with Claude Code',
    tag: 'AI Second Brain (Part 1)',
    source: 'NextWork',
    when: '2w ago',
    done: 8,
    total: 8,
  },
  {
    id: 'git-worktrees',
    title: 'Claude Code with Git Worktrees',
    tag: 'Claude Code',
    source: 'NextWork',
    when: '3w ago',
    done: 1,
    total: 4,
  },
  {
    id: 'guardrails',
    title: 'Set Up Claude Code Guardrails',
    tag: 'Claude Code',
    source: 'NextWork',
    when: '1mo ago',
    done: 8,
    total: 10,
  },
  {
    id: 'rag-pipeline',
    title: 'Build a RAG Pipeline with Embeddings',
    tag: 'AI / ML',
    source: 'NextWork',
    when: '4d ago',
    done: 4,
    total: 9,
  },
  {
    id: 'design-tokens',
    title: 'Ship a Design Token System',
    tag: 'Design Engineering',
    source: 'Created by you',
    when: '6d ago',
    done: 5,
    total: 5,
  },
  {
    id: 'postgres-hardening',
    title: 'Harden a Postgres Database',
    tag: 'Security',
    source: 'NextWork',
    when: '1w ago',
    done: 2,
    total: 8,
  },
  {
    id: 'azure-pipeline',
    title: 'Azure DevOps CI/CD Pipeline',
    tag: 'DevOps & Cloud',
    source: 'NextWork',
    when: '2w ago',
    done: 6,
    total: 6,
  },
  {
    id: 'nextjs-side-project',
    title: 'Ship a Next.js Side Project',
    tag: 'Web Fundamentals',
    source: 'Created by you',
    when: '3w ago',
    done: 7,
    total: 12,
  },
  {
    id: 'linear-mcp',
    title: 'An MCP Server for Linear Tickets',
    tag: 'MCP Servers',
    source: 'NextWork',
    when: '1mo ago',
    done: 3,
    total: 3,
  },
  {
    id: 'streaming-etl',
    title: 'Streaming ETL with Orchestration',
    tag: 'Data Engineering',
    source: 'NextWork',
    when: '2mo ago',
    done: 9,
    total: 9,
  },
];

// status is derived: all tasks done → completed, otherwise in-progress
export const statusOf = (p) => (p.done >= p.total ? 'completed' : 'in-progress');

// totals as shown in the reference's filter pills
export const STATUS_FILTERS = [
  { id: 'in-progress', label: 'In progress', count: 17 },
  { id: 'completed', label: 'Completed', count: 18 },
];
