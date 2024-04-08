'use client'

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const router = useRouter();
  const [name, setName] = useState("");

  const onLoginClick = () => {
    if (name !== "") {
      localStorage.setItem("name", name);
      router.push("/chat");
    }
  }

  return (
    <main className="p-20">
      <form className="flex flex-col">
        <input className="text-black" type="text" onChange={(e) => setName(e.target.value)} />
        <button type="button" onClick={onLoginClick}>
          Login
        </button>
      </form>
    </main>
  );
}
