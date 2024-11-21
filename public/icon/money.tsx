import { Transaction1Props } from "@/app/common/type";
import React from "react";

export const MoneyIcon: React.FC<Transaction1Props> = ({
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
    >
      <path
        d="M12 12.5C11.0717 12.5 10.1815 12.8687 9.52513 13.5251C8.86875 14.1815 8.5 15.0717 8.5 16C8.5 16.9283 8.86875 17.8185 9.52513 18.4749C10.1815 19.1313 11.0717 19.5 12 19.5C12.9283 19.5 13.8185 19.1313 14.4749 18.4749C15.1313 17.8185 15.5 16.9283 15.5 16C15.5 15.0717 15.1313 14.1815 14.4749 13.5251C13.8185 12.8687 12.9283 12.5 12 12.5ZM10.5 16C10.5 15.6022 10.658 15.2206 10.9393 14.9393C11.2206 14.658 11.6022 14.5 12 14.5C12.3978 14.5 12.7794 14.658 13.0607 14.9393C13.342 15.2206 13.5 15.6022 13.5 16C13.5 16.3978 13.342 16.7794 13.0607 17.0607C12.7794 17.342 12.3978 17.5 12 17.5C11.6022 17.5 11.2206 17.342 10.9393 17.0607C10.658 16.7794 10.5 16.3978 10.5 16Z"
        fill={color}
      />
      <path
        d="M17.526 5.11606L14.347 0.659058L2.658 9.99706L2.01 9.99006V10.0001H1.5V22.0001H22.5V10.0001H21.538L19.624 4.40106L17.526 5.11606ZM19.425 10.0001H9.397L16.866 7.45406L18.388 6.96706L19.425 10.0001ZM15.55 5.79006L7.84 8.41806L13.946 3.54006L15.55 5.79006ZM3.5 18.1691V13.8291C3.92218 13.6801 4.30565 13.4385 4.62231 13.122C4.93896 12.8055 5.18077 12.4222 5.33 12.0001H18.67C18.8191 12.4223 19.0609 12.8059 19.3775 13.1225C19.6942 13.4392 20.0777 13.681 20.5 13.8301V18.1701C20.0777 18.3192 19.6942 18.5609 19.3775 18.8776C19.0609 19.1942 18.8191 19.5778 18.67 20.0001H5.332C5.18218 19.5777 4.93996 19.1942 4.62302 18.8774C4.30607 18.5607 3.9224 18.3186 3.5 18.1691Z"
        fill={color}
      />
    </svg>
  );
};
