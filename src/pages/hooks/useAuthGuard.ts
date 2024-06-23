import { useEffect } from "react";
import { useAuthContext } from "../auth/AuthContext";
import { useRouter } from "next/router";

const useAuthGuard = () => {
  const { user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);
};

export default useAuthGuard;
