import { Transaction1Props } from "@/app/common/type";
import React from "react";

export const DeatailIcon: React.FC<Transaction1Props> = ({
  className = "",
  color = "#4B5CB8",
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
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M21.7489 12L22.3714 11.688V11.685L22.3669 11.6805L22.3579 11.6625L22.3264 11.6025L22.2064 11.3865C22.0599 11.1339 21.9043 10.8867 21.7399 10.6455C21.191 9.83993 20.5602 9.09343 19.8574 8.418C18.1684 6.798 15.5689 5.145 11.9989 5.145C8.43185 5.145 5.83085 6.7965 4.14186 8.418C3.43905 9.09343 2.80817 9.83993 2.25935 10.6455C2.03666 10.9741 1.83041 11.3135 1.64135 11.6625L1.63235 11.6805L1.62935 11.685V11.6865C1.62935 11.6865 1.62785 11.688 2.25035 12L1.62785 11.6865C1.57973 11.7837 1.55469 11.8908 1.55469 11.9993C1.55469 12.1077 1.57973 12.2148 1.62785 12.312L1.62635 12.315L1.63085 12.3195L1.63985 12.3375C1.68663 12.4312 1.73666 12.5233 1.78985 12.6135C2.43575 13.7046 3.22588 14.7036 4.13885 15.5835C5.82935 17.2035 8.42885 18.8535 11.9989 18.8535C15.5674 18.8535 18.1684 17.2035 19.8589 15.582C20.5604 14.9058 21.1907 14.1594 21.7399 13.3545C21.9502 13.0448 22.1459 12.7255 22.3264 12.3975L22.3579 12.3375L22.3669 12.3195L22.3699 12.315V12.3135C22.3699 12.3135 22.3714 12.312 21.7489 12ZM21.7489 12L22.3714 12.3135C22.4195 12.2163 22.4445 12.1092 22.4445 12.0007C22.4445 11.8923 22.4195 11.7852 22.3714 11.688L21.7489 12ZM11.9089 9.696C11.2978 9.696 10.7118 9.93874 10.2797 10.3708C9.8476 10.8029 9.60485 11.3889 9.60485 12C9.60485 12.6111 9.8476 13.1971 10.2797 13.6292C10.7118 14.0613 11.2978 14.304 11.9089 14.304C12.5199 14.304 13.1059 14.0613 13.538 13.6292C13.9701 13.1971 14.2129 12.6111 14.2129 12C14.2129 11.3889 13.9701 10.8029 13.538 10.3708C13.1059 9.93874 12.5199 9.696 11.9089 9.696ZM8.21585 12C8.21585 11.0198 8.60525 10.0797 9.29839 9.38653C9.99152 8.6934 10.9316 8.304 11.9119 8.304C12.8921 8.304 13.8322 8.6934 14.5253 9.38653C15.2185 10.0797 15.6079 11.0198 15.6079 12C15.6079 12.9802 15.2185 13.9203 14.5253 14.6135C13.8322 15.3066 12.8921 15.696 11.9119 15.696C10.9316 15.696 9.99152 15.3066 9.29839 14.6135C8.60525 13.9203 8.21586 12.9802 8.21585 12Z"
        fill={color}
      />
    </svg>
  );
};