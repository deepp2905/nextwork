export const CLARIFY_QUESTIONS = [
  {
    id: 'topic',
    prompt: 'What kind of help are you looking for?',
    type: 'single',
    options: ['Concept explanation', 'Debugging an error', 'Step-by-step guidance'],
  },
  {
    id: 'level',
    prompt: 'How would you describe your experience level?',
    type: 'single',
    options: ['Beginner', 'Some experience', 'Advanced'],
  },
  {
    id: 'services',
    prompt: 'Which AWS services are you using in this project?',
    type: 'multi',
    options: ['Amplify', 'S3', 'Lambda', 'CloudFront'],
  },
  {
    id: 'tried',
    prompt: 'What have you already tried?',
    type: 'multi',
    options: [
      'Read the docs',
      'Searched online',
      'Asked a teammate',
      'Restarted the build',
    ],
  },
  {
    id: 'urgency',
    prompt: 'How urgent is this for you?',
    type: 'single',
    options: ['Just curious', 'Working on it now', 'Blocking something important'],
  },
  {
    id: 'env',
    prompt: 'Where are you running into this?',
    type: 'single',
    options: ['Local dev', 'Staging', 'Production', 'Not sure yet'],
  },
  {
    id: 'stack',
    prompt: 'Which parts of the stack are involved?',
    type: 'multi',
    options: ['Frontend', 'Backend / API', 'Database', 'Build / CI', 'Infra / DNS'],
  },
  {
    id: 'format',
    prompt: 'How would you like the answer formatted?',
    type: 'single',
    options: ['Quick summary', 'Step-by-step walkthrough', 'Code example', 'Conceptual explanation'],
  },
  {
    id: 'depth',
    prompt: 'How deep should we go?',
    type: 'single',
    options: ['High level', 'Practical detail', 'Everything you can tell me'],
  },
  {
    id: 'goal',
    prompt: 'What does success look like for you?',
    type: 'multi',
    options: [
      'Understand the concept',
      'Unblock my current task',
      'Ship to production',
      'Learn for next time',
    ],
  },
];

export const pickRandomQuestions = () => {
  const count = 2 + Math.floor(Math.random() * 3); // 2, 3, or 4
  const pool = [...CLARIFY_QUESTIONS];
  const picked = [];
  for (let i = 0; i < count && pool.length; i += 1) {
    const idx = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return picked;
};

export const formatAnswer = (q, value, custom) => {
  const extra = custom && custom.trim() ? custom.trim() : '';
  if (q.type === 'multi') {
    const arr = Array.isArray(value) ? value : [];
    const all = extra ? [...arr, extra] : arr;
    return all.length ? all.join(', ') : 'Not answered';
  }
  if (extra) return extra;
  return value || 'Not answered';
};
