import React, { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { signOut } from "firebase/auth";
import { collection, doc, onSnapshot, query, setDoc } from "firebase/firestore";

const TodoTitle = () => {
  const [title, setTitle] = useState("");
  const [titles, setTitles] = useState<string[]>([]);

  // TodoのTitleをFirestoreのドキュメントとして格納
  const handleAddTitle = async () => {
    await setDoc(doc(db, "posts", title), {
      id: "",
      link: "",
      todo: "",
      status: "",
      detail: "",
      deadline: "",
      timestamp: "",
    });
    setTitle("");
  };

  // Firestoreのドキュメント(Title)を取得
  useEffect(() => {
    const q = query(collection(db, "posts"));
    const unsub = onSnapshot(q, (querySnapshot) => {
      setTitles(querySnapshot.docs.map((doc) => doc.id));
    });
    return unsub;
  }, [title]);

  // サインアウトの処理
  const signOutAction = () => {
    signOut(auth);
  };

  return (
    <div className="px-20">
      <div className="text-right">
        <button onClick={() => signOutAction()} className="bg-rose-300 h-10 w-20">
          signOut
        </button>
      </div>
      <div className=" my-10">
        <h1 className="text-4xl mb-10">Todo Title Page</h1>
        <input
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          className="border border-stone-300 mr-10 w-96 h-10 pl-3"
          type="text"
        />
        <button onClick={() => handleAddTitle()} className="bg-lime-300 h-10 w-20">
          追加
        </button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-7">
        {titles.map((todoTitle) => (
          <div
            key={todoTitle}
            className="bg-pink-200 h-48 w-48 text-center align-middle relative"
          >
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 tracking-widest text-lg">
              {todoTitle}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoTitle;
