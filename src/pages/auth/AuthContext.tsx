import { auth } from "@/lib/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";

// authデータをコンポーネント配下に渡せるようにする処理
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  // 後のreturnした値にundefinedの可能性が残り、useAuthContextの読み込み先（index.tsx）のuserでエラーが発生するため、undefinedの可能性を排除
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}

// firebaseのauth情報が更新された際に、onAuthStateChangedが呼び出されuser・loadingの状態をそれぞれ更新。AuthProviderが再レンダリングされることで、useAuthContextを使用している他のコンポーネント（index.tsx）が変更を検知し、再レンダリングされる。

interface AuthProviderTypes {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderTypes): JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const value: AuthContextType = {
    user,
    loading,
  };

  useEffect(() => {
    const unsubscribed = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribed();
  }, []);

  return (
    <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
  );
}
