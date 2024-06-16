import Auth from "./auth/Auth";
import TodoTitle from "./feed/TodoTitle";
import { useAuthContext } from "./auth/AuthContext";

export default function Home() {
  const { user } = useAuthContext();

  return (
    <>
      {!user ? (
        <div className="bg-slate-200">
          <Auth />
        </div>
      ) : (
        <TodoTitle />
      )}
    </>
  );
}
