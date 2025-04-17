import React, { useState, useEffect, useRef } from "react";

const Dropdown = ({
  label,
  options = [],
  selected,
  setSelected,
  extraOption,
  placeholder = "Select an option",
  noOption = "No options",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full sm:w-36" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-white text-sm font-semibold flex items-center justify-between w-full px-4 py-2 bg-[#1E1E24] rounded-md border border-gray-600"
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {selected?.name || placeholder}
        </span>
        <span>⏷</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-full bg-[#1E1E24] text-white border border-gray-600 rounded-md shadow-lg z-20">
          {options.length > 0 ? (
            options.map((option) => (
              <button
                key={option.id}
                className={`w-full px-3 py-2 text-left hover:bg-gray-700 ${
                  selected?.id === option.id ? "bg-gray-800" : ""
                }`}
                onClick={() => {
                  setSelected(option);
                  setIsOpen(false);
                }}
              >
                {option.name}
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-gray-400 text-sm">{noOption}</div>
          )}
          {extraOption && (
            <div className="border-t border-gray-700 p-2">{extraOption}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
