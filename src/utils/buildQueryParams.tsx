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
      // params[`searchTerms[${index}].Value`] = term.Value;
      if (Array.isArray(term.Value)) {
        params[`searchTerms[${index}].Value`] = term.Value.join(",");
      } else {
        params[`searchTerms[${index}].Value`] = term.Value;
      }
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

export const parseLabelToNumber = (label: string) => {
  const number = parseFloat(label.replace(/[$.]/g, ""));
  return isNaN(number) ? 0 : number;
};

export const formatCurrencyVN = (value: string): string => {
  if (!value) return "";
  const numericValue = value.replace(/\D/g, "");
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(numericValue));
};

export const formatCurrencyUSD = (value: string): string => {
  if (!value) return "";
  const numericValue = value.replace(/\D/g, "");
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(numericValue));
};
