"use client";
import { useEffect } from "react";
import BarChart from "./BarChart";
import Statistics from "./statistics";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/login");
    }
  }, []);
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      <div style={{ flex: 3 }}>
        <BarChart />
      </div>
      <div style={{ flex: 1 }}>
        <Statistics />
      </div>
    </div>
  );
}
