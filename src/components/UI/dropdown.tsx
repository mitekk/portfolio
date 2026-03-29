import { useState } from "react";

export const Dropdown: React.FC<{
  title: string;
  selected: string;
  options: string[];
  onSelect: (option: string) => void;
  className?: string;
}> = ({ title, selected, options, onSelect, className }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className={`relative ${className || ""}`}>
      <button
        className="header-nav-text cursor-pointer flex items-center gap-1"
        style={{
          outline: "none",
          background: "none",
          border: "none",
          padding: "0 1rem",
        }}
        onClick={() => setDropdownOpen((open) => !open)}
        tabIndex={0}
      >
        {title} <span>▾</span>
      </button>
      {dropdownOpen && (
        <div className="absolute left-0 w-40 bg-nav rounded shadow-lg z-3">
          {options.map((option) => (
            <div key={option}>
              <div
                className={`px-4 py-2 hover:bg-surround cursor-pointer align-middle ${
                  selected === option ? "bg-surround" : ""
                }`}
                onClick={() => {
                  setDropdownOpen(false);
                  onSelect(option);
                }}
              >
                {option}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
