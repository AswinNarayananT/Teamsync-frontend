import React from "react";
import { useDrag } from "react-dnd";

const SprintItem = ({ issue }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "issue",
    item: { id: issue.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [issue.id]);

  return (
    <div
      ref={drag}
      className={`bg-[#3a3a3a] p-3 rounded shadow transition-colors ${
        isDragging ? "opacity-50" : "hover:bg-[#4a4a4a]"
      }`}
    >
      <h3 className="text-sm font-medium">{issue.title}</h3>
      <p className="text-xs text-gray-400 capitalize">{issue.type}</p>
    </div>
  );
};

export default SprintItem;
