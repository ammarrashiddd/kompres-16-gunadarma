"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import UserMenu from "./UserMenu";

export default function NavDashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Pengguna");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userImage, setUserImage] = useState<string | null>(null);

  useEffect(() => {
    const localUser = localStorage.getItem("auth_user");
    if (localUser) {
      try {
        const u = JSON.parse(localUser);
        if (u.nama || u.name) setUserName(u.nama || u.name);
        if (u.email) setUserEmail(u.email);
        if (u.image) setUserImage(u.image);
      } catch {}
    }

    fetch("/api/auth/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          const name = data.user.name || data.user.email?.split("@")[0];
          setUserName(name);
          setUserEmail(data.user.email || null);
          setUserImage(data.user.image || null);
        }
      })
      .catch(() => {});
  }, []);

  async function handleLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    // Hapus cookie auth agar middleware redirect ke login
    document.cookie = "auth_token=; path=/; max-age=0; SameSite=Lax";
    try {
      await signOut({ redirect: false });
    } catch {
      // ignore
    }
    router.push("/login");
  }

  return (
    <div className="flex items-center">
      <UserMenu
        userName={userName}
        userEmail={userEmail}
        userImage={userImage}
        onLogout={handleLogout}
      />
    </div>
  );
}

