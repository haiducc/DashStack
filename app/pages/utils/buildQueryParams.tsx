// // Định nghĩa hàm buildSearchParams
// export const buildSearchParams = (
//   searchTerms: Array<{ Name: string; Value: string }>,
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   additionalParams: Record<string, any>
// ) => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const params: Record<string, any> = { ...additionalParams };

//   searchTerms.forEach((term, index) => {
//     params[`searchTerms[${index}].Name`] = term.Name;
//     params[`searchTerms[${index}].Value`] = term.Value;
//   });

//   return params;
// };
// buildSearchParams.ts
export const buildSearchParams = (
  searchTerms: Array<{ Name: string; Value: string }>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalParams: Record<string, any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
): Record<string, any> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: Record<string, any> = {};

  // Thêm các điều kiện tìm kiếm từ searchTerms
  if (searchTerms.length > 0) {
    searchTerms.forEach((term, index) => {
      params[`searchTerms[${index}].Name`] = term.Name;
      params[`searchTerms[${index}].Value`] = term.Value;
    });
  }

  // Thêm các tham số bổ sung như pageIndex, pageSize, globalTerm
  Object.keys(additionalParams).forEach((key) => {
    if (additionalParams[key] !== undefined) {
      params[key] = additionalParams[key];
    }
  });

  return params;
};
