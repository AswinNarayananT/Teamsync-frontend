import React from "react";
import { useLocation } from "react-router-dom";
import { ImEnlarge2 } from "react-icons/im";
import { BsThreeDots } from "react-icons/bs";

const BreadCrumb = ({ pageName, buttonText, onButtonClick, ButtonIcon, isBackLog }) => {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);

  return (
    <div className="flex justify-between items-center p-4">
      <div>
        <h2 className="text-xl font-semibold text-gray-200">{pageName}</h2>
        <nav className="text-sm text-gray-400">
          {paths.map((path, index) => (
            <span key={index}>
              {index > 0 && " / "}
              <span>{path.charAt(0).toUpperCase() + path.slice(1)}</span>
            </span>
          ))}
        </nav>
      </div>

      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          className="flex items-center bg-gray-600 text-white px-2.5 py-1.5 rounded-sm shadow hover:bg-gray-500 transition text-sm"
        >
          {buttonText}
          {ButtonIcon && <ButtonIcon size={20} className="ml-2" />}
        </button>
      )}

      {isBackLog && (
        <div className="flex gap-3">
          <button className="text-gray-200">
            <ImEnlarge2 size={15} />
          </button>
          <button className="text-gray-200 bg-gray-600 p-1 rounded-xs">
            <BsThreeDots size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default BreadCrumb;
