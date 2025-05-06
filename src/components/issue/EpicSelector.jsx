import { useMemo, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { assignParentEpic } from "../../redux/currentworkspace/currentWorkspaceThunk";
import { FaPlus } from "react-icons/fa";
import { MdSearch as SearchIcon } from "react-icons/md";
import { IoClose as CloseIcon } from "react-icons/io5";

export default function EpicSelector({ issue }) {
  const dispatch = useDispatch();
  const epics = useSelector((state) => state.currentWorkspace.epics);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEpics, setFilteredEpics] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef();
  const buttonRef = useRef();

  const epicMap = useMemo(() => {
    if (!Array.isArray(epics)) return {};
    return epics.reduce((map, epic) => {
      map[epic.id] = epic.title;
      return map;
    }, {});
  }, [epics]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
    setSearchTerm("");
  };

  const handleSelectEpic = (epicId) => {
    dispatch(assignParentEpic({ issueId: issue.id, epicId }));
    setIsOpen(false);
    setSearchTerm("");
  };

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredEpics(epics);
    } else {
      setFilteredEpics(
        epics.filter((epic) =>
          epic.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, epics]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getInitials = (text) => {
    return text
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative w-44">
      {issue.parent ? (
        <div
          ref={buttonRef}
          onClick={toggleDropdown}
          className="flex items-center justify-center bg-indigo-600 text-white text-xs px-2 py-1 rounded-full hover:bg-indigo-500 transition duration-300 w-32 cursor-pointer"
        >
          <span className="truncate text-center" title={epicMap[issue.parent] || issue.parent}>
            {epicMap[issue.parent] || "Unknown Epic"}
          </span>
        </div>
      ) : (
        <button
          ref={buttonRef}
          onClick={toggleDropdown}
          className="h-8 w-8 flex items-center justify-center text-green-500 hover:text-green-400 hover:bg-gray-700 rounded-full transition duration-200"
          title="Assign Epic"
        >
          <FaPlus size={10} />
        </button>
      )}

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-20 animate-fade-in"
          ref={dropdownRef}
        >
          {/* Search Bar */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-700 border-b border-gray-600">
            <SearchIcon className="text-gray-300" />
            <input
              type="text"
              placeholder="Search epics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 text-sm outline-none min-w-0"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")}>
                <CloseIcon className="text-gray-400 hover:text-white transition" />
              </button>
            )}
          </div>

          {/* Epic Results */}
          <div className="max-h-56 overflow-y-auto custom-scrollbar">
            {filteredEpics && filteredEpics.length > 0 ? (
              filteredEpics.map((epic) => (
                <div
                  key={epic.id}
                  onClick={() => handleSelectEpic(epic.id)}
                  className="flex items-center gap-3 px-3 py-2 hover:bg-gray-600 cursor-pointer border-b border-gray-700 last:border-0 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                    {getInitials(epic.title)}
                  </div>
                  <span className="text-white text-sm truncate">{epic.title}</span>
                </div>
              ))
            ) : (
              <div className="p-3 text-gray-400 text-center text-sm">No matching epics</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
