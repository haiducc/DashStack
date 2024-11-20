"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken"); // Kiểm tra accessToken trong localStorage

    if (accessToken) {
      // Nếu có accessToken, chuyển hướng đến dashboard
      router.push("/pages/dashboard");
    } else {
      // Nếu không có accessToken, chuyển hướng đến login
      router.push("/pages/login");
    }
  }, [router]);

  return null; // Không cần render gì ở đây vì trang này chỉ dùng để chuyển hướng
}
