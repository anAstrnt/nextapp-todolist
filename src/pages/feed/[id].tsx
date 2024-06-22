import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DeleteButton from "../../../public/delete.svg";
import ArrowUturn from "../../../public/arrowUturn.svg";
import Pencil from "../../../public/pencil.svg";
import Link from "next/link";
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { nanoid } from "nanoid";

interface TodosTypes {
  todoDocId: string;
  todoId: string;
  todo: string;
  state: string;
  detail: string;
  deadline: string;
  timestamp: string;
  isTodoEditable: boolean;
  isDeadlineEditable: boolean;
  isDetailEditable: boolean;
}

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [linkId, setLinkId] = useState<string>("");
  const [todo, setTodo] = useState("");
  const [deadline, setDeadline] = useState("");
  const [detail, setDetail] = useState("");
  const [todos, setTodos] = useState<TodosTypes[]>([
    {
      todoDocId: "",
      todoId: "",
      todo: "",
      state: "未着",
      detail: "",
      deadline: "",
      timestamp: "",
      isTodoEditable: true,
      isDeadlineEditable: true,
      isDetailEditable: true,
    },
  ]);
  const [titleDocId, setTitleDocId] = useState("");
  const [todoDocId, setTodoDocId] = useState("");

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
    const q = query(todoData, orderBy("timestamp", "desc"));
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
  }, [titleDocId]);

  // todoを削除する処理
  const handleTodoDelete = async (todoDocId: string) => {
    await deleteDoc(doc(db, "title", titleDocId, "todo", todoDocId));
  };

  const handleEditTodo = (todoDocId: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.todoDocId === todoDocId
          ? { ...todo, isTodoEditable: !todo.isTodoEditable }
          : todo
      )
    );
  };

  const handleEditDeadline = (todoDocId: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.todoDocId === todoDocId
          ? { ...todo, isDeadlineEditable: !todo.isDeadlineEditable }
          : todo
      )
    );
  };

  const handleEditDetail = (todoDocId: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.todoDocId === todoDocId
          ? { ...todo, isDetailEditable: !todo.isDetailEditable }
          : todo
      )
    );
  };

  const updateDeadline = () => {};

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
        <div className="flex justify-center my-10">
          <input
            value={todo}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTodo(e.target.value)}
            className="border border-stone-300 mr-10 w-96 h-10 pl-3"
            type="text"
          />
          <button onClick={(e) => addNewTodo(e)} className="bg-stone-300 h-10 w-20">
            追加
          </button>
        </div>
        <div className="my-5">
          <span className="bg-rose-300 inline-block h-10 w-20 text-center content-center mr-5">
            着手中
          </span>
          <span className="bg-yellow-300 inline-block h-10 w-20 text-center content-center mr-5">
            未着手
          </span>
          <span className="bg-blue-300 inline-block h-10 w-20 text-center content-center">
            完了
          </span>
        </div>

        {/* todo表示欄 */}
        <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-7">
          {todos.map((fetchedTodo) => (
            <div className="bg-rose-300 h-88 w-56">
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <button className="border rounded-full text-sm bg-rose-300 h-5 w-5 mr-2" />
                    <button className="border rounded-full text-sm bg-yellow-300 h-5 w-5 mr-2" />
                    <button className="border rounded-full text-sm bg-blue-300 h-5 w-5 mr-2" />
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

                <div className="flex items-center">
                  <span className="m-2 inline-block">todo_..</span>
                  <button onClick={() => handleEditTodo(fetchedTodo.todoDocId)}>
                    <Pencil className="h-3 w-3" />
                  </button>
                </div>
                {fetchedTodo.isTodoEditable ? (
                  <p className="tracking-widest text-sm p-2 bg-slate-50 rounded-lg w-full h-8">
                    {fetchedTodo.todo}
                  </p>
                ) : (
                  <input className="text-sm p-2 rounded-lg w-full h-8 border border-stone-400" />
                )}

                <div className="flex items-center">
                  <span className="m-2 inline-block">deadline_..</span>
                  <button onClick={() => handleEditDeadline(fetchedTodo.todoDocId)}>
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
                    value={deadline}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateDeadline()
                    }
                    className="text-sm p-2 rounded-lg w-full h-8 border border-stone-400"
                  />
                )}

                <div className="flex items-center">
                  <span className="m-2 inline-block">detail_..</span>
                  <button onClick={() => handleEditDetail(fetchedTodo.todoDocId)}>
                    <Pencil className="h-3 w-3" />
                  </button>
                </div>
                {fetchedTodo.isDetailEditable ? (
                  <p className="tracking-widest text-sm p-2 bg-slate-50 rounded-lg w-full h-20">
                    {fetchedTodo.detail}
                  </p>
                ) : (
                  <input className="text-sm p-2 rounded-lg w-full h-8 border border-stone-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
