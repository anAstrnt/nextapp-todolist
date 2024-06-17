import React from "react";
import { useRouter } from "next/router";
import DeleteButton from "../../../public/delete.svg";

export default function Page() {
  const router = useRouter();
  return (
    <>
      <div className="mx-20">
        <h1 className="text-6xl">Title : {router.query.todoId}</h1>
        <div className="flex justify-center my-10">
          <input className="border border-stone-300 mr-10 w-96 h-10 pl-3" type="text" />
          <button className="bg-stone-300 h-10 w-20">追加</button>
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-7">
          <div className="bg-rose-300 h-52 w-52 relative">
            <div className="p-4 ">
              <div className="flex justify-center">
                <button className="rounded-lg text-sm bg-slate-50 p-2 mr-2">着手</button>
                <button className="rounded-lg text-sm bg-slate-50 p-2 mr-2">未着</button>
                <button className="rounded-lg text-sm bg-slate-50 p-2 mr-2">完了</button>
              </div>
              <p className="tracking-widest text-base">todo</p>
              <p className="tracking-widest text-base">deadline</p>
              <p className="tracking-widest text-base">detail</p>
            </div>
            <button className="p-2 absolute right-0 bottom-0 m-5 rounded-full bg-slate-50">
              <DeleteButton className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
