import React, { useState } from "react";
import { Select } from "antd";
import { buildSearchParams } from "./buildQueryParams";

const { Option } = Select;

interface FilterConfig {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  multiple?: boolean;
}

interface SearchFilterProps {
  filters: FilterConfig[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalParams?: Record<string, any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onFilterChange: (params: Record<string, any>) => void;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  filters,
  additionalParams = {},
  onFilterChange,
}) => {
  const [searchTerms, setSearchTerms] = useState<
    { Name: string; Value: string | string[] }[]
  >([]);

  const handleChange = (value: string | string[], name: string) => {
    const updatedTerms = [...searchTerms];
    const existingIndex = updatedTerms.findIndex((term) => term.Name === name);

    if (existingIndex > -1) {
      updatedTerms[existingIndex].Value = value;
    } else {
      updatedTerms.push({ Name: name, Value: value });
    }

    setSearchTerms(updatedTerms);

    const formattedTerms = updatedTerms.map((term) => ({
      Name: term.Name,
      Value: Array.isArray(term.Value) ? term.Value.join(",") : term.Value,
    }));

    const params = buildSearchParams(formattedTerms, additionalParams);
    onFilterChange(params);
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      {filters.map((filter) => (
        <Select
          key={filter.name}
          style={{ width: 200, marginRight: 10 }}
          placeholder={filter.label}
          mode={filter.multiple ? "multiple" : undefined}
          onChange={(value) => handleChange(value, filter.name)}
        >
          {filter.options.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      ))}
    </div>
  );
};

export default SearchFilter;

//

// /* eslint-disable @typescript-eslint/no-explicit-any */
// import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
// import { apiClient } from "./services/base_api";

// // export const { handlers, signIn, signOut, auth } = NextAuth({
// export const { handlers, signIn, signOut, auth } = NextAuth({
//   providers: [
//     Credentials({
//       // You can specify which fields should be submitted, by adding keys to the `credentials` object.
//       // e.g. domain, username, password, 2FA token, etc.
//       credentials: {
//         username: {},
//         password: {},
//       },
//       authorize: async (credentials) => {
//         console.log("credentials", credentials);

//         const user = await apiClient.post(
//           "/account/login",
//           JSON.stringify({
//             username: credentials?.username,
//             password: credentials?.password,
//           })
//         );
//         console.log("user11111111", user.data.data.token);

//         if (!user) {
//           // No user found, so this is their first attempt to login
//           // Optionally, this is also the place you could do a user registration
//           throw new Error("Invalid credentials.");
//         }

//         // return user object with their profile data
//         return {
//           access_token: user.data.data.token,
//         };
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/login",
//   },
//   callbacks: {
//     jwt({ token, user }) {
//       console.log("222222", user);

//       if (user) {
//         // User is available during sign-in
//         token.user = user;
//       }
//       return token;
//     },
//     session({ session, token }) {
//       (session.user as any) = token.user;
//       return session;
//     },
//     authorized: async ({ auth }) => {
//       return !!auth;
//     },
//   },
// });
