import React from "react";
import { TodosTypes } from "../types/TodosTypes";
import TodoItem from "./TodoItem";

interface TodoListTypes {
  todoStateFilter: TodosTypes[];
  handleTodoStateChange: (todoDocId: string, newState: string) => Promise<void>;
  handleTodoDelete: (todoDocId: string) => Promise<void>;
  handleTodoChange: (
    todoDocId: string,
    field: string,
    newValue: string | boolean
  ) => void;
  handleTodoUpdate: (todoDocId: string, field: string, newValue: string) => Promise<void>;
}

const TodoList: React.FC<TodoListTypes> = ({
  todoStateFilter,
  handleTodoStateChange,
  handleTodoDelete,
  handleTodoChange,
  handleTodoUpdate,
}) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-7">
      {todoStateFilter.map((fetchedTodo) => (
        <TodoItem
          key={fetchedTodo.todoDocId}
          fetchedTodo={fetchedTodo}
          handleTodoStateChange={handleTodoStateChange}
          handleTodoDelete={handleTodoDelete}
          handleTodoChange={handleTodoChange}
          handleTodoUpdate={handleTodoUpdate}
        />
      ))}
    </div>
  );
};

export default TodoList;
