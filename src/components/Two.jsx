export const Two5 = ({ text = "undefined", className, ...props }) => {
    return (
      <div className={"w-[110px] h-[110px] relative " + className}>
        <div className="bg-[#d9d9d9] rounded-[50%] w-[100%] h-[100%] absolute right-[0%] left-[0%] bottom-[0%] top-[0%]"></div>
        <div className="bg-[#e31212] rounded-[50%] w-[100%] h-[100%] absolute right-[0%] left-[0%] bottom-[0%] top-[0%]"></div>
        <div className="text-[#36454f] text-left font-['Roboto-SemiBold',_sans-serif] text-lg font-semibold absolute left-[calc(50%_-_16px)] top-[46px]">
          25%{" "}
        </div>
      </div>
    );
  };
  