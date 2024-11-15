"use client";
import React from "react";
import imgrb from "../../../public/img/imgrb.png";
import imgrt from "../../../public/img/imgrt.png";
import imglb from "../../../public/img/imglb.png";
import imglt from "../../../public/img/imglt.png";
import Image from "next/image";
import { apiClient } from "@/app/services/base_api";
import { useRouter } from "next/navigation";

// export interface GetLoginResponseProps {
//   token: string;
//   id: string;
//   username: string;
//   role: string[];
//   message?: string;
// }

function Login() {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await apiClient.post(
        "/account/login",
        JSON.stringify({
          username,
          password,
        })
      );

      const data = response.data;
      console.log("Phản hồi API:", data);

      if (data) {
        // console.log(40, data.token)
        localStorage.setItem("accessToken", data.data.token);
        // const userResponse = await fetch(
        //   "https://apiweb.bankings.vnrsoftware.vn/account/find-role-by-account",
        //   {
        //     method: "GET",
        //     headers: {
        //       "x-access-token": `${data.accessToken}`,
        //     },
        //   }
        // );

        // if (!userResponse.ok) {
        //   throw new Error("Không thể lấy thông tin vai trò người dùng");
        // }
        // console.log("Đang điều hướng...");
        router.push("/");
      } else {
        alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert(
        "Đăng nhập thất bại: " +
          (error.response?.data?.message || error.message)
      );
      console.error("Đã xảy ra lỗi:", error);
    }
  };

  return (
    <div className="bg-[#4880FF] w-full min-h-screen flex justify-center items-center relative">
      <div className="w-full max-w-[90%] sm:max-w-[630px] bg-white p-6 sm:p-8 rounded-lg shadow-md flex flex-col z-10">
        <h2 className="text-center text-lg sm:text-xl font-semibold">
          Đăng nhập tài khoản
        </h2>
        <div className="mb-4 text-center">
          Vui lòng điền email đăng nhập và mật khẩu để đăng nhập hệ thống
        </div>

        <label htmlFor="email" className="mb-2">
          Email
        </label>
        <input
          // type="email"
          id="email"
          placeholder="Nhập email của bạn"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
        />

        <label htmlFor="password" className="mb-2">
          Mật khẩu
        </label>
        <input
          type="password"
          id="password"
          placeholder="Nhập mật khẩu của bạn"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 rounded p-2 mb-4 focus:outline-none focus:ring focus:ring-blue-300"
        />

        <div className="flex items-center mb-4">
          <input type="checkbox" id="remember" className="mr-2" />
          <label htmlFor="remember">Lưu đăng nhập</label>
        </div>

        <div className="flex flex-col justify-center items-center">
          <button
            // type="submit"
            onClick={() => handleLogin()}
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition duration-200 w-full sm:w-[418px] h-[48px] sm:h-[56px] m-0 font-bold text-lg sm:text-xl"
          >
            Đăng nhập
          </button>

          <div className="mt-4">
            Bạn chưa có tài khoản đăng nhập
            <a href="/" className="text-[#5A8CFF] underline">
              Tạo tài khoản
            </a>
          </div>
        </div>
      </div>

      <div>
        <Image
          alt="img"
          src={imgrb}
          className="absolute"
          style={{
            right: 0,
            bottom: 0,
            opacity: 0.6,
            width: "30%",
          }}
        />
        <Image
          alt="img"
          src={imgrt}
          className="absolute"
          style={{
            right: 0,
            top: 0,
            width: "30%",
          }}
        />
        <Image
          alt="img"
          src={imglb}
          className="absolute"
          style={{
            left: 0,
            bottom: 0,
            opacity: 0.6,
            width: "30%",
          }}
        />
        <Image
          alt="img"
          src={imglt}
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: "30%",
          }}
        />
      </div>
    </div>
  );
}

export default Login;
