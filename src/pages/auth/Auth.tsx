import React, { useState } from "react";
import { auth } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginAction = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  const createUserAction = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      })
      .catch((error) => {
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form className="shadow-xl px-20 py-20 bg-slate-50">
        <h1 className="px-10 py-8 text-4xl">
          {isLogin ? "Authentication screen" : "Register screen"}
        </h1>
        <div className="py-2">
          <label htmlFor="address" className="block text-2xl py-2">
            mail address
          </label>
          <input
            type="mail"
            placeholder="test@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-md w-full h-10 p-2"
          />
        </div>
        <div className="py-2">
          <label htmlFor="password" className="block text-2xl py-2">
            password
          </label>
          <input
            type="password"
            placeholder="123456"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-md w-full h-10 p-2"
          />
        </div>
        <div className="flex flex-col pt-5">
          {isLogin ? (
            <button
              type="button"
              onClick={async () => await loginAction()}
              className="bg-lime-300 py-2 px-5 mx-10 rounded-lg"
            >
              Login
            </button>
          ) : (
            <button
              type="button"
              onClick={async () => await createUserAction()}
              className="bg-rose-400 py-2 px-5 mx-10 rounded-lg"
            >
              Register
            </button>
          )}

          <span onClick={() => setIsLogin(!isLogin)} className="text-center pt-5">
            {isLogin ? "新規登録はこちら" : "ログイン画面に戻る"}
          </span>
        </div>
      </form>
    </div>
  );
};

export default Auth;
