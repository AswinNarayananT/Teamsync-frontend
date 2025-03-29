import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

const Dropdown = ({ label, options, selected, setSelected }) => {
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
    <div className="relative w-33" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white text-sm font-semibold flex items-center justify-between w-full px-4 py-1.5 bg-[#1E1E24] rounded-md border border-gray-600"
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{selected.name }</span>
        <span>⏷</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-36 bg-[#1E1E24] text-white border border-gray-600 rounded-md shadow-lg z-20">
          {options.map((option) => (
            <button
              key={option.id}
              className={`w-full px-3 py-1 text-left hover:bg-gray-700 ${
                selected.id === option.id ? "bg-gray-800" : ""
              }`}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
            >
              {option.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
