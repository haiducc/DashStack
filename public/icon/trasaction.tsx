import { Transaction1Props } from "@/src/common/type";
import React from "react";

export const TransactionIcon: React.FC<Transaction1Props> = ({
  className = "",
  color = "#fff",
  ...props
}) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <g clipPath="url(#clip0_2768_3010)">
        <path
          d="M5.17969 6.17813C6.825 4.24219 9.25781 3 12 3C16.9734 3 21 7.02656 21 12H24C24 5.37188 18.6281 0 12 0C8.42813 0 5.23594 1.56562 3.04219 4.04062L0 0.998437V9H8.00156L5.17969 6.17813ZM18.8203 17.8219C17.1703 19.7578 14.7422 21 12 21C7.02656 21 3 16.9734 3 12H0C0 18.6281 5.37188 24 12 24C15.5719 24 18.7641 22.4344 20.9578 19.9594L24 23.0016V15H15.9984L18.8203 17.8219Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_2768_3010">
          <rect width="24" height="24" fill={color} />
        </clipPath>
      </defs>
    </svg>
  );
};
