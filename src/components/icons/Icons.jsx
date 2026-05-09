const baseProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
};

export const Sparkle = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...baseProps} {...props}>
    <path d="M8 1.5l1.6 4.9 4.9 1.6-4.9 1.6L8 14.5l-1.6-4.9L1.5 8l4.9-1.6L8 1.5Z" />
  </svg>
);

export const Folder = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...baseProps} {...props}>
    <path d="M2 4.5C2 3.7 2.7 3 3.5 3h2.7c.4 0 .8.16 1.06.44L8.5 4.7H12.5c.83 0 1.5.67 1.5 1.5v6c0 .83-.67 1.5-1.5 1.5h-9c-.83 0-1.5-.67-1.5-1.5V4.5Z" />
  </svg>
);

export const BookOpen = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...baseProps} {...props}>
    <path d="M2 3.5h4c.83 0 1.5.67 1.5 1.5v8c0-.83-.67-1.5-1.5-1.5H2v-8Z" />
    <path d="M14 3.5h-4c-.83 0-1.5.67-1.5 1.5v8c0-.83.67-1.5 1.5-1.5h4v-8Z" />
  </svg>
);

export const Check = ({ size = 12, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" {...baseProps} {...props}>
    <path d="M2.5 6.25 5 8.75 9.5 3.75" />
  </svg>
);

export const Cross = ({ size = 12, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 12 12" {...baseProps} {...props}>
    <path d="M3 3 9 9" />
    <path d="M9 3 3 9" />
  </svg>
);

export const Close = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...baseProps} {...props}>
    <path d="M4 4 12 12" />
    <path d="M12 4 4 12" />
  </svg>
);

export const ArrowUp = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...baseProps} {...props}>
    <path d="M8 13V3" />
    <path d="M3.5 7.5 8 3l4.5 4.5" />
  </svg>
);

export const Highlight = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...baseProps} {...props}>
    <path d="m9 2.5 4.5 4.5-7 7H2.5V10l6.5-7.5Z" />
    <path d="M8 3.5 12.5 8" />
    <path d="M2.5 14h6" />
  </svg>
);
