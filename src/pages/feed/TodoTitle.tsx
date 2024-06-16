import React from "react";
import { auth } from "../../lib/firebase";
import { signOut } from "firebase/auth";

const TodoTitle = () => {
  const signOutAction = () => {
    signOut(auth);
  };

  return (
    <div>
      <button onClick={() => signOutAction()}>signOut</button>
    </div>
  );
};

export default TodoTitle;
