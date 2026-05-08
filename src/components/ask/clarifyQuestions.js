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
];

export const formatAnswer = (q, value, custom) => {
  const extra = custom && custom.trim() ? custom.trim() : '';
  if (q.type === 'multi') {
    const arr = Array.isArray(value) ? value : [];
    const all = extra ? [...arr, extra] : arr;
    return all.length ? all.join(', ') : '—';
  }
  if (extra) return extra;
  return value || '—';
};
