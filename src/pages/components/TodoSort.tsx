import React from "react";

interface TodoSortType {
  handleSortChange: (sortOption: "timestamp" | "deadline", sort: "desc" | "asc") => void;
}

const TodoSort: React.FC<TodoSortType> = ({ handleSortChange }) => {
  return (
    <div>
      <button
        onClick={() => handleSortChange("deadline", "asc")}
        className="bg-stone-300 rounded-full h-10 w-32 mr-5"
      >
        締切順
      </button>
      <button
        onClick={() => handleSortChange("timestamp", "desc")}
        className="bg-stone-300 rounded-full h-10 w-32"
      >
        作成順
      </button>
    </div>
  );
};

export default TodoSort;
