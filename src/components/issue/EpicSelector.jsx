import { useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { assignParentEpic } from "../../redux/currentworkspace/currentWorkspaceThunk";
import { FaPlus, FaTimes } from "react-icons/fa"; // React Icons for modern icons

export default function EpicSelector({
  issue,
  showEpicDropdownFor,
  setShowEpicDropdownFor,
  epicDropdownRef,
}) {
  const dispatch = useDispatch();
  const epics = useSelector((state) => state.currentWorkspace.epics);

  const epicMap = useMemo(() => {
    if (!Array.isArray(epics)) return {};
    return epics.reduce((map, epic) => {
      map[epic.id] = epic.title;
      return map;
    }, {});
  }, [epics]);

  const isOpen = showEpicDropdownFor === issue.id;

  const toggleDropdown = () => {
    setShowEpicDropdownFor(isOpen ? null : issue.id);
  };

  const handleSelectEpic = (epicId) => {
    dispatch(assignParentEpic({ issueId: issue.id, epicId }));
    setShowEpicDropdownFor(null);
  };


  return (
    <div className="relative w-44" ref={isOpen ? epicDropdownRef : null}>
      {issue.parent ? (
        <div
  onClick={toggleDropdown}
  className="flex items-center justify-center bg-indigo-600 text-white text-xs px-2 py-1 rounded-full hover:bg-indigo-500 transition duration-300 w-32"
>
  <span className="truncate text-center" title={epicMap[issue.parent] || issue.parent}>
    {epicMap[issue.parent] || "Unknown Epic"}
  </span>
</div>

      ) : (
        <button
          onClick={toggleDropdown}
          className="h-8 w-8 flex items-center justify-center text-green-500 hover:text-green-400 hover:bg-gray-700 rounded-full transition duration-200"
          title="Assign Epic"
        >
          <FaPlus size={14} />
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 max-h-60 overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-lg animate-fade-in z-20">
          {epics && epics.length > 0 ? (
            epics.map((epic) => (
              <div
                key={epic.id}
                onClick={() => handleSelectEpic(epic.id)}
                className="px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer truncate border-b border-gray-600 last:border-none"
                title={epic.title}
              >
                {epic.title}
              </div>
            ))
          ) : (
            <div className="p-3 text-gray-400 text-sm text-center">
              No epics available
            </div>
          )}
        </div>
      )}
    </div>
  );
}
