import React from "react";

const Register = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <form className="shadow-xl px-20 py-20 bg-slate-50">
        <h1 className="py-8 text-4xl">Authentication screen</h1>
        <div className="py-2">
          <label htmlFor="address" className="block text-2xl py-2">
            mail address
          </label>
          <input
            type="mail"
            placeholder="test@example.com"
            className="border rounded-md w-full h-10 p-2"
          />
        </div>
        <div className="py-2">
          <label htmlFor="password" className="block text-2xl py-2">
            password
          </label>
          <input
            type="text"
            placeholder="123456"
            className="border rounded-md w-full h-10 p-2"
          />
        </div>
        <div className="flex justify-center pt-5">
          <button className="bg-rose-600 py-2 px-5 mx-10 rounded-lg">Register</button>
          <button className="bg-lime-300 py-2 px-5 mx-10 rounded-lg">Login</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
