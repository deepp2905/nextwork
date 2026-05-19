import { ChevronDown, SortLines } from '../icons/Icons';
import './SortButton.css';

/** Toolbar sort control. `label` is the full text, e.g. "Sort: Popular". */
export default function SortButton({ label }) {
  return (
    <button type="button" className="projects-sort type-subheading">
      <SortLines size={12} />
      {label}
      <ChevronDown size={14} />
    </button>
  );
}
