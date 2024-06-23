import React from "react";

interface TodoInputTypes{
  todo: string,
  setTodo: React.Dispatch<React.SetStateAction<string>>,
  addNewTodo: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void>
}

const TodoInput: React.FC<TodoInputTypes> = ({ todo, setTodo, addNewTodo }) => {
  return (
    <div className="flex justify-center my-10">
      <input
        value={todo}
        placeholder="todoを追加してください"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTodo(e.target.value)}
        className="border border-stone-300 mr-10 w-96 h-10 pl-3"
        type="text"
      />
      <button onClick={(e) => addNewTodo(e)} className="bg-stone-300 h-10 w-20">
        追加
      </button>
    </div>
  );
};

export default TodoInput;
