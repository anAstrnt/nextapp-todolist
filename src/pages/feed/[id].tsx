import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DeleteButton from "../../../public/delete.svg";
import ArrowUturn from "../../../public/arrowUturn.svg";
import Link from "next/link";
import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { nanoid } from "nanoid";

interface TodosTypes {
  todoId: string;
  todo: string;
  state: string;
  detail: string;
  deadline: string;
  timestamp: string;
}

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [linkId, setLinkId] = useState<string>("");
  const [todo, setTodo] = useState("");
  const [detail, setDetail] = useState("");
  const [deadline, setDeadline] = useState("");
  const [todos, setTodos] = useState<TodosTypes[]>([
    { todoId: "", todo: "", state: "未着", detail: "", deadline: "", timestamp: "" },
  ]);
  const [titleDocId, setTitleDocId] = useState("");

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
        setTitleDocId(doc.id);
      });
      return () => unsub();
    });
  }, [linkId]);

  // TodoのTitleをFirestoreのドキュメントとして格納
  // useEffect(() => {
  //   const titleData = collection(db, "title");
  //   const q = query(titleData);
  //   const unSub=onSnapshot(q,(querys))
  // });

  const addNewTodo = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault;
    const shortId = nanoid(10);
    const collectionTodoRef = collection(db, "title", titleDocId, "todo");
    await addDoc(collectionTodoRef, {
      linkId: linkId,
      todoId: shortId,
      todo: todo,
      state: "未着",
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
    // const q = query(collection(db, "todo"), where("linkId", "==", linkId));
    const q = query(todoData, orderBy("timestamp", "desc"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setTodos(
        querySnapshot.docs.map((doc) => ({
          todoId: doc.data().todoId,
          todo: doc.data().todo,
          state: doc.data().state,
          detail: doc.data().detail,
          deadline: doc.data().deadline,
          timestamp: doc.data().timestamp,
        }))
      );
    });
    return () => unsub();
  }, [titleDocId]);

  return (
    <>
      <div className="mx-20">
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(12rem,1fr))] gap-7">
          {todos.map((fetchedTodo) => (
            <div className="bg-rose-300 h-52 w-52 relative">
              <div className="p-4">
                <div className="flex justify-center">
                  <button className="rounded-lg text-sm bg-slate-50 p-2 mr-2">
                    着手
                  </button>
                  <button className="rounded-lg text-sm bg-slate-50 p-2 mr-2">
                    未着
                  </button>
                  <button className="rounded-lg text-sm bg-slate-50 p-2 mr-2">
                    完了
                  </button>
                </div>
                <p className="tracking-widest text-base">{fetchedTodo.todo}</p>
                <p className="tracking-widest text-base">{fetchedTodo.deadline}</p>
                <p className="tracking-widest text-base">{fetchedTodo.detail}</p>
              </div>
              <button className="p-2 absolute right-0 bottom-0 m-5 rounded-full bg-slate-50">
                <DeleteButton className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
