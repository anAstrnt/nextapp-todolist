import React from "react";
import DeleteButton from "../../../public/delete.svg";
import Pencil from "../../../public/pencil.svg";
import { TodosTypes } from "../types/TodosTypes";

interface TodoItemType {
  fetchedTodo: TodosTypes;
  handleTodoStateChange: (todoDocId: string, newState: string) => Promise<void>;
  handleTodoDelete: (todoDocId: string) => Promise<void>;
  handleTodoChange: (
    todoDocId: string,
    field: string,
    newValue: string | boolean
  ) => void;
  handleTodoUpdate: (todoDocId: string, field: string, newValue: string) => Promise<void>;
}

const TodoItem: React.FC<TodoItemType> = ({
  fetchedTodo,
  handleTodoStateChange,
  handleTodoDelete,
  handleTodoChange,
  handleTodoUpdate,
}) => {
  return (
    <div
      className={
        fetchedTodo.state === "着手中"
          ? "bg-rose-300 h-88 w-56"
          : fetchedTodo.state === "未着手"
          ? "bg-yellow-300 h-88 w-56"
          : fetchedTodo.state === "完了"
          ? "bg-blue-300 h-88 w-56"
          : ""
      }
    >
      <div className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <button
              onClick={() => handleTodoStateChange(fetchedTodo.todoDocId, "着手中")}
              className="border rounded-full text-sm bg-rose-300 h-5 w-5 mr-2"
            />
            <button
              onClick={() => handleTodoStateChange(fetchedTodo.todoDocId, "未着手")}
              className="border rounded-full text-sm bg-yellow-300 h-5 w-5 mr-2"
            />
            <button
              onClick={() => handleTodoStateChange(fetchedTodo.todoDocId, "完了")}
              className="border rounded-full text-sm bg-blue-300 h-5 w-5 mr-2"
            />
          </div>
          <div>
            <button
              onClick={() => handleTodoDelete(fetchedTodo.todoDocId)}
              className="p-2 rounded-full bg-slate-50"
            >
              <DeleteButton className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Todo欄 */}
        <div className="flex items-center">
          <span className="m-2 inline-block">todo_..</span>
          <button
            onClick={() =>
              handleTodoChange(
                fetchedTodo.todoDocId,
                "isTodoEditable",
                !fetchedTodo.isTodoEditable
              )
            }
          >
            <Pencil className="h-3 w-3" />
          </button>
        </div>
        {fetchedTodo.isTodoEditable ? (
          <p className="tracking-widest text-sm p-2 bg-slate-50 rounded-lg w-full h-8">
            {fetchedTodo.todo}
          </p>
        ) : (
          <input
            type="text"
            value={fetchedTodo.todo}
            onChange={(e) => {
              handleTodoChange(fetchedTodo.todoDocId, "todo", e.target.value);
            }}
            onBlur={(e) =>
              handleTodoUpdate(fetchedTodo.todoDocId, "todo", e.target.value)
            }
            className="text-sm p-2 rounded-lg w-full h-8 border border-stone-400"
          />
        )}

        {/* deadline欄 */}
        <div className="flex items-center">
          <span className="m-2 inline-block">deadline_..</span>
          <button
            onClick={() =>
              handleTodoChange(
                fetchedTodo.todoDocId,
                "isDeadlineEditable",
                !fetchedTodo.isDeadlineEditable
              )
            }
          >
            <Pencil className="h-3 w-3" />
          </button>
        </div>
        {fetchedTodo.isDeadlineEditable ? (
          <p className="tracking-widest text-sm p-2 bg-slate-50 rounded-lg w-full h-8">
            {fetchedTodo.deadline}
          </p>
        ) : (
          <input
            type="date"
            min="2024-06-01"
            max="2030-3-31"
            value={fetchedTodo.deadline}
            onChange={(e) => {
              handleTodoChange(fetchedTodo.todoDocId, "deadline", e.target.value);
            }}
            onBlur={(e) =>
              handleTodoUpdate(fetchedTodo.todoDocId, "deadline", e.target.value)
            }
            className="text-sm p-2 rounded-lg w-full h-8 border border-stone-400"
          />
        )}

        {/* detail欄 */}
        <div className="flex items-center">
          <span className="m-2 inline-block">detail_..</span>
          <button
            onClick={() =>
              handleTodoChange(
                fetchedTodo.todoDocId,
                "isDetailEditable",
                !fetchedTodo.isDetailEditable
              )
            }
          >
            <Pencil className="h-3 w-3" />
          </button>
        </div>
        {fetchedTodo.isDetailEditable ? (
          <p className="tracking-widest text-sm p-2 bg-slate-50 rounded-lg w-full h-20">
            {fetchedTodo.detail}
          </p>
        ) : (
          <textarea
            value={fetchedTodo.detail}
            onChange={(e) => {
              handleTodoChange(fetchedTodo.todoDocId, "detail", e.target.value);
            }}
            onBlur={(e) => {
              handleTodoUpdate(fetchedTodo.todoDocId, "detail", e.target.value);
            }}
            className="text-sm p-2 rounded-lg w-full h-20 border border-stone-400 whitespace-pre-line"
          />
        )}
      </div>
    </div>
  );
};

export default TodoItem;
