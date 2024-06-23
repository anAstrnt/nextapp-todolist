import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ArrowUturn from "../../../public/arrowUturn.svg";
import Link from "next/link";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { nanoid } from "nanoid";
import { TodosTypes } from "@/pages/types/TodosTypes";
import TodoInput from "../components/TodoInput";
import TodoFilters from "../components/TodoFilters";
import TodoList from "../components/TodoList";
import TodoSort from "../components/TodoSort";

export default function Page() {
  const router = useRouter();
  const [searchStateTodo, setSearchStateTodo] = useState("");
  const [sort, setSort] = useState<"desc" | "asc">("desc");
  const [sortOption, setSortOption] = useState<"timestamp" | "deadline">("timestamp");
  const [title, setTitle] = useState("");
  const [titleDocId, setTitleDocId] = useState("");
  const [linkId, setLinkId] = useState<string>("");
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState<TodosTypes[]>([
    {
      todoDocId: "",
      todoId: "",
      todo: "",
      state: "未着手",
      detail: "",
      deadline: "",
      timestamp: "",
      isTodoEditable: true,
      isDeadlineEditable: true,
      isDetailEditable: true,
    },
  ]);

  // タイトルを画面左上に表示させる処理
  useEffect(() => {
    if (router.query.id === undefined) {
      return;
    }
    const linkIdFromRouters = router.query.id.toString();
    setLinkId(linkIdFromRouters);
  }, [router.query.id]);

  useEffect(() => {
    if (!linkId) return;
    const q = query(collection(db, "title"), where("linkId", "==", linkId));
    const unsub = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        setTitle(doc.data().title);
        // 次の処理でTitle毎にサブコレクションTodoを追加したいため、ついでにdoc.idを取得しとく
        setTitleDocId(doc.id);
      });
      return () => unsub();
    });
  }, [linkId]);

  // 現在開いているドキュメントのサブコレクションにTodoを追加する処理
  const addNewTodo = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault;
    const shortId = nanoid(10);
    const collectionTodoRef = collection(db, "title", titleDocId, "todo");
    await addDoc(collectionTodoRef, {
      linkId: linkId,
      todoId: shortId,
      todo: todo,
      state: "未着手",
      detail: "",
      deadline: "",
      timestamp: Timestamp.now(),
    });
    setTodo("");
  };

  // Titleに合わせたTodoを表示させる処理
  useEffect(() => {
    if (!titleDocId) return;
    const todoData = collection(db, "title", titleDocId, "todo");
    const q = query(todoData, orderBy(sortOption, sort));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setTodos(
        querySnapshot.docs.map((doc) => ({
          todoDocId: doc.id,
          todoId: doc.data().todoId,
          todo: doc.data().todo,
          state: doc.data().state,
          detail: doc.data().detail,
          deadline: doc.data().deadline,
          timestamp: doc.data().timestamp,
          isTodoEditable: true,
          isDeadlineEditable: true,
          isDetailEditable: true,
        }))
      );
    });
    return () => unsub();
  }, [titleDocId, sortOption]);

  // ソート機能（timestampかdeadlineを早い順に表示）
  const handleSortChange = (
    sortOption: "timestamp" | "deadline",
    sort: "desc" | "asc"
  ) => {
    setSortOption(sortOption);
    setSort(sort);
  };

  // フィルター機能（state毎のTodoを表示）
  const todoStateFilter = () => {
    if (searchStateTodo === "全て") {
      return todos;
    }
    if (searchStateTodo === "着手中") {
      return todos.filter((todo) => todo.state === "着手中");
    }
    if (searchStateTodo === "未着手") {
      return todos.filter((todo) => todo.state === "未着手");
    }
    if (searchStateTodo === "完了") {
      return todos.filter((todo) => todo.state === "完了");
    }
    return todos;
  };

  // todo内でステータスを変更
  const handleTodoStateChange = async (todoDocId: string, newState: string) => {
    const todoRef = doc(db, "title", titleDocId, "todo", todoDocId);
    const docSnap = await getDoc(todoRef);
    docSnap.exists()
      ? await updateDoc(todoRef, { state: newState })
      : console.error(todoDocId);
  };

  // todoを削除する処理
  const handleTodoDelete = async (todoDocId: string) => {
    await deleteDoc(doc(db, "title", titleDocId, "todo", todoDocId));
  };

  // Todoの編集画面を表示
  const handleTodoChange = (
    todoDocId: string,
    field: string,
    newValue: string | boolean
  ) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.todoDocId === todoDocId ? { ...todo, [field]: newValue } : todo
      )
    );
  };

  // todoを編集
  const handleTodoUpdate = async (todoDocId: string, field: string, newValue: string) => {
    const todoRef = doc(db, "title", titleDocId, "todo", todoDocId);
    await updateDoc(todoRef, { [field]: newValue });
  };

  return (
    <>
      <div className="mx-20">
        {/* todo入力欄 */}
        <div className="flex justify-between items-center">
          <h1 className="text-5xl">{title}</h1>
          <Link href="/" className="p-2 m-5 rounded-full bg-slate-50">
            <ArrowUturn className="h-8 w-8" />
          </Link>
        </div>
        <TodoInput todo={todo} setTodo={setTodo} addNewTodo={addNewTodo} />
        <div className="flex justify-between items-center">
          {/* todoの作成日、締切日毎の並べ替え */}
          <TodoSort handleSortChange={handleSortChange} />
          {/* todoのステータス毎の絞り込み */}
          <TodoFilters setSearchStateTodo={setSearchStateTodo} />
        </div>

        {/* todoの表示欄 */}
        <TodoList
          todoStateFilter={todoStateFilter()}
          handleTodoStateChange={handleTodoStateChange}
          handleTodoDelete={handleTodoDelete}
          handleTodoChange={handleTodoChange}
          handleTodoUpdate={handleTodoUpdate}
        />
      </div>
    </>
  );
}
