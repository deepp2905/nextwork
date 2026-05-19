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
];

// status is derived: all tasks done → completed, otherwise in-progress
export const statusOf = (p) => (p.done >= p.total ? 'completed' : 'in-progress');

// totals as shown in the reference's filter pills
export const STATUS_FILTERS = [
  { id: 'in-progress', label: 'In progress', count: 17 },
  { id: 'completed', label: 'Completed', count: 18 },
];
