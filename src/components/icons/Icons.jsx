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

export const ArrowDownRight = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...baseProps} {...props}>
    <path d="M4.5 4.5 12 12" />
    <path d="M12 5V12H5" />
  </svg>
);

export const ChevronDown = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...baseProps} {...props}>
    <path d="M4 6.5 8 10.5l4-4" />
  </svg>
);

export const Highlight = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...baseProps} {...props}>
    <path d="m9 2.5 4.5 4.5-7 7H2.5V10l6.5-7.5Z" />
    <path d="M8 3.5 12.5 8" />
  </svg>
);

export const Copy = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...baseProps} {...props}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5" />
  </svg>
);

export const CheckMark = ({ size = 16, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" {...baseProps} {...props}>
    <path d="m3.5 8.5 3 3 6-7" />
  </svg>
);

export const Microphone = ({ size = 20, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" {...baseProps} {...props}>
    <path d="M10 1.667C8.159 1.667 6.667 3.159 6.667 5v5c0 1.841 1.492 3.333 3.333 3.333S13.333 11.841 13.333 10V5c0-1.841-1.492-3.333-3.333-3.333Z" />
    <path d="M17.5 10c0 4.142-3.358 7.5-7.5 7.5M10 17.5c-4.142 0-7.5-3.358-7.5-7.5M10 17.5V20" />
  </svg>
);

export const Pin = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} strokeWidth={2} {...props}>
    <path d="M18 10V3.6c0-.56 0-.84-.109-1.054a1 1 0 0 0-.437-.437C17.24 2 16.96 2 16.4 2H7.6c-.56 0-.84 0-1.054.109a1 1 0 0 0-.437.437C6 2.76 6 3.04 6 3.6V10m12 0H6m12 0v.2c0 1.68 0 2.52-.327 3.162a3 3 0 0 1-1.311 1.311C15.72 15 14.88 15 13.2 15h-2.4c-1.68 0-2.52 0-3.162-.327a3 3 0 0 1-1.311-1.311C6 12.72 6 11.88 6 10.2V10m8.5 5v4.5a2.5 2.5 0 0 1-5 0V15" />
  </svg>
);

export const Expand = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...baseProps} strokeWidth={2} {...props}>
    <path d="m14 10 7-7m0 0h-6m6 0v6m-11 5-7 7m0 0h6m-6 0v-6" />
  </svg>
);
