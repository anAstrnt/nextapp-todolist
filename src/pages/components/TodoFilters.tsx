import React from "react";

interface TodoFiltersTypes {
  setSearchStateTodo: React.Dispatch<React.SetStateAction<string>>
}

const TodoFilters: React.FC<TodoFiltersTypes> = ({ setSearchStateTodo}) => {
  return (
    <div className="my-5">
      <button onClick={() => setSearchStateTodo("全て")}>
        <span className="bg-stone-300 inline-block h-10 w-20 text-center content-center mr-5">
          全て
        </span>
      </button>
      <button onClick={() => setSearchStateTodo("着手中")}>
        <span className="bg-rose-300 inline-block h-10 w-20 text-center content-center mr-5">
          着手中
        </span>
      </button>
      <button onClick={() => setSearchStateTodo("未着手")}>
        <span className="bg-yellow-300 inline-block h-10 w-20 text-center content-center mr-5">
          未着手
        </span>
      </button>
      <button onClick={() => setSearchStateTodo("完了")}>
        <span className="bg-blue-300 inline-block h-10 w-20 text-center content-center">
          完了
        </span>
      </button>
    </div>
  );
};

export default TodoFilters;
