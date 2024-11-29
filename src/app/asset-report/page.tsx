/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Header from "@/src/component/Header";
import { Col, DatePicker, Row, Select, Spin } from "antd";
import type { DatePickerProps } from "antd";
import { useEffect, useState, useTransition } from "react";
import type { Dayjs } from "dayjs";

import { ChartAssetType, DataAseet, TransactionType } from "@/src/common/type";
import CardAseet from "@/src/module/aseetReport";
import { options } from "@/src/module/aseetReport/constants";
import { apiClient } from "@/src/services/base_api";
import ChartMoney from "../../module/aseetReport/ChartMoney";
import ChartGold from "@/src/module/aseetReport/ChartGold";
import ChartRealEstate from "@/src/module/aseetReport/ChartRealEstate";
import ChartTransaction from "@/src/module/aseetReport/ChartTransaction";
import { buildSearchParams } from "@/src/utils/buildQueryParams";

export interface ListOptionsTransactionType {
  account: [];
  system: [];
  team: [];
  branch: [];
  team_acount: [];
  year: "";
  month: "";
}

const AssetPage = () => {
  const [isPending, startTransition] = useTransition();
  const [active, setActive] = useState<number>(1);
  const [asset, setAsset] = useState<DataAseet>();
  const [chart, setChart] = useState<ChartAssetType>();
  const [transaction, setTransaction] = useState<TransactionType[] | null>(
    null
  );
  const [progress, setProgress] = useState<ChartAssetType>();
  const [year, setYear] = useState<string>("");
  const [listOptions, setListOptions] = useState<ListOptionsTransactionType>({
    account: [],
    system: [],
    team: [],
    branch: [],
    team_acount: [],
    year: "",
    month: "",
  });
  const [dataFilter, setDataFilter] = useState<{
    dataAccount: string;
    dataSystem: string;
    dataTeam: string;
    dataBranch: string;
    dataTeamAccount: string;
    dataYear: string;
    dataMonth: string;
  }>({
    dataAccount: "",
    dataSystem: "",
    dataTeam: "",
    dataBranch: "",
    dataTeamAccount: "",
    dataYear: "",
    dataMonth: "",
  });

  const getListSystem = async () => {
    const data = await apiClient.get("/group-system-api/find");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataConvert = data.data.data.source.map((item: any) => {
      return { label: item.name, value: item.id };
    });
    setListOptions((prev) => ({ ...prev, system: dataConvert ?? [] }));
  };

  const getListBranch = async (systemId: string) => {
    const params = buildSearchParams(
      [
        {
          Name: "groupSystemId",
          Value: systemId,
        },
      ],
      {
        pageIndex: 1,
        pageSize: 20,
      }
    );
    const data = await apiClient.get("/group-branch-api/find", {
      params,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataConvert = data.data.data.source.map((item: any) => {
      return { label: item.name, value: item.id };
    });
    setListOptions((prev) => ({ ...prev, branch: dataConvert }));
  };

  const getListTeam = async (branchId: string) => {
    const params = buildSearchParams(
      [
        {
          Name: "groupBranchId",
          Value: branchId,
        },
      ],
      {
        pageIndex: 1,
        pageSize: 20,
      }
    );
    const data = await apiClient.get("/group-team-api/find", {
      params,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataConvert = data.data.data.source.map((item: any) => {
      return { label: item.name, value: item.id };
    });
    setListOptions((prev) => ({ ...prev, branch: dataConvert }));
  };

  const getListAccount = async () => {
    const data = await apiClient.get("/allcode-api/find", {
      params: {
        cdType: "BANK_ACCOUNT",
        cdName: "TYPE_ACCOUNT",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataConvert = data.data.data.map((item: any) => {
      return { label: item.vnContent, value: item.cdVal };
    });
    setListOptions((prev) => ({ ...prev, account: dataConvert }));
  };

  const getListTeamAccount = async () => {
    const data = await apiClient.get("/group-account-api/find");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataConvert = data.data.data.source.map((item: any) => {
      return { label: item.fullName, value: item.id };
    });
    setListOptions((prev) => ({ ...prev, team_acount: dataConvert }));
  };

  useEffect(() => {
    if (active === 0) {
      startTransition(() => {
        Promise.all([getListSystem(), getListTeamAccount(), getListAccount()]);
      });
    }
  }, [active]);

  const handleClick = (type: number) => {
    if (type === 0) {
      getListTransaction({});
    }
    if (type === 1) {
      startTransition(() => {
        Promise.all([
          getListChart({
            type: "1",
            typeChart: "1",
          }),
          getLisChartProgress({
            type: "1",
            typeChart: "1",
          }),
        ]);
      });
    }
    if (type === 2) {
      startTransition(() => {
        Promise.all([
          getListChart({
            type: "1",
            typeChart: "2",
          }),
          getLisChartProgress({
            type: "1",
            typeChart: "2",
          }),
        ]);
      });
    }

    if (type === 3) {
      startTransition(() => {
        Promise.all([
          getListChart({
            type: "1",
            typeChart: "3",
          }),
          getLisChartProgress({
            type: "1",
            typeChart: "3",
          }),
        ]);
      });
    }
    setActive(type);
  };

  const getListSummary = async () => {
    try {
      const responsive = await apiClient.get("/asset-api/get-summary");
      setAsset(responsive.data.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  const getListChart = async ({
    type,
    typeChart,
    year,
    month,
  }: {
    type: string;
    typeChart: string;
    year?: string;
    month?: string;
  }) => {
    const arr = [
      {
        Name: "type",
        Value: type,
      },
      {
        Name: "typeChart",
        Value: typeChart,
      },
    ];
    if (year) {
      arr.push({
        Name: "year",
        Value: year,
      });
    }
    if (month) {
      arr.push({
        Name: "month",
        Value: month,
      });
    }

    const params = buildSearchParams(arr, {
      pageIndex: 1,
      pageSize: 20,
    });

    try {
      const responsive = await apiClient.get(`/asset-api/get-chart`, {
        params,
      });
      setChart(responsive.data.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  const getLisChartProgress = async ({
    type,
    typeChart,
    month,
  }: {
    type: string;
    typeChart: string;
    year?: string;
    month?: string;
  }) => {
    const arr = [
      {
        Name: "type",
        Value: type,
      },
      {
        Name: "typeChart",
        Value: typeChart,
      },
    ];
    if (month) {
      arr.push({
        Name: "month",
        Value: month,
      });
    }

    const params = buildSearchParams(arr, {
      pageIndex: 1,
      pageSize: 20,
    });

    try {
      const responsive = await apiClient.get(`/asset-api/get-chart`, {
        params,
      });
      setProgress(responsive.data.data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  const getListTransaction = async ({
    groupSystemId,
    groupBranchId,
    groupTeamId,
    typeAccount,
    groupAccount,
    year,
    month,
  }: {
    groupSystemId?: string;
    groupBranchId?: string;
    groupTeamId?: string;
    typeAccount?: string;
    groupAccount?: string;
    year?: string;
    month?: string;
  }) => {
    const arr = [];
    if (groupSystemId || dataFilter.dataSystem) {
      arr.push({
        Name: "groupSystemId",
        Value: groupSystemId ?? dataFilter.dataSystem,
      });
    }
    if (groupBranchId || dataFilter.dataBranch) {
      arr.push({
        Name: "groupBranchId",
        Value: groupBranchId ?? dataFilter.dataBranch,
      });
    }
    if (groupTeamId || dataFilter.dataTeam) {
      arr.push({
        Name: "groupTeamId",
        Value: groupTeamId ?? dataFilter.dataTeam,
      });
    }
    if (typeAccount || dataFilter.dataAccount) {
      arr.push({
        Name: "typeAccount",
        Value: typeAccount ?? dataFilter.dataAccount,
      });
    }
    if (groupAccount || dataFilter.dataTeamAccount) {
      arr.push({
        Name: "groupAccount",
        Value: groupAccount ?? dataFilter.dataTeamAccount,
      });
    }
    if (year || dataFilter.dataYear) {
      arr.push({
        Name: "year",
        Value: year ?? dataFilter.dataYear,
      });
    }
    if (month || dataFilter.dataMonth) {
      arr.push({
        Name: "month",
        Value: month ?? dataFilter.dataMonth,
      });
    }
    const params = buildSearchParams(arr, {
      pageIndex: 1,
      pageSize: 20,
    });

    try {
      const responsive = await apiClient.get(`/asset-api/get-transaction`, {
        params,
      });
      const isCheckData = responsive.data.data.some(
        (item: any) =>
          item.balance !== 0 &&
          item.totalAmountIn !== 0 &&
          item.totalAmountOut !== 0
      );
      setTransaction(isCheckData ? responsive.data.data : []);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  useEffect(() => {
    startTransition(() => {
      Promise.all([
        getListSummary(),
        getListChart({
          type: "1",
          typeChart: "1",
        }),
        getLisChartProgress({
          type: "1",
          typeChart: "1",
        }),
      ]);
    });
  }, []);

  const handleChangeYear: DatePickerProps["onChange"] = (date, dateString) => {
    if (typeof dateString === "string" && dateString.trim() !== "") {
      setYear(dateString);
      getListChart({
        type: "1",
        typeChart: `${active}`,
        year: dateString,
      });
    } else {
      setYear("");
      getListChart({
        type: "1",
        typeChart: `${active}`,
      });
    }
  };

  const handleChangeMonth = (e: number) => {
    getListChart({
      type: "1",
      typeChart: `${active}`,
      year: year,
      month: `${e}`,
    });
  };

  const handleChangeMonthProgress = (e: number, typeChart: string) => {
    getLisChartProgress({
      type: "1",
      typeChart: typeChart,
      month: `${e}`,
    });
  };

  const disabledDate = (current: Dayjs | null): boolean => {
    return current ? current.year() > new Date().getFullYear() : false;
  };

  const handleChangeSystem = (e: number | undefined) => {
    setDataFilter((prev) => ({
      ...prev,
      dataSystem: e ? `${e}` : "",
    }));
    if (e) {
      getListBranch(`${e}`);
    }
    getListTransaction({
      groupSystemId: e ? `${e}` : "",
    });
  };
  const handleChangeBranch = (e: string | undefined) => {
    setDataFilter((prev) => ({ ...prev, dataBranch: e ? `${e}` : "" }));
    if (e) {
      getListTeam(`${e}`);
    }
    getListTransaction({
      groupBranchId: e ? `${e}` : "",
    });
  };
  const handleChangeTeam = (e: number | undefined) => {
    setDataFilter((prev) => ({ ...prev, dataTeam: e ? `${e}` : "" }));
    getListTransaction({
      groupTeamId: e ? `${e}` : "",
    });
  };

  const handleChangeTeamAccount = (e: number | undefined) => {
    setDataFilter((prev) => ({ ...prev, dataTeamAccount: e ? `${e}` : "" }));
    getListTransaction({
      groupAccount: e ? `${e}` : "",
    });
  };

  const handleChangeYearTransaction: DatePickerProps["onChange"] = (
    date,
    dateString
  ) => {
    if (typeof dateString === "string" && dateString.trim() !== "") {
      setDataFilter((prev) => ({ ...prev, dataYear: dateString }));
      getListTransaction({
        year: dateString,
      });
    } else {
      setDataFilter((prev) => ({ ...prev, dataYear: "" }));
      getListTransaction({
        year: "",
      });
    }
  };

  const handleChangeMonthTransaction = (e: number | undefined) => {
    setDataFilter((prev) => ({ ...prev, dataMonth: e ? `${e}` : "" }));
    getListTransaction({
      month: e ? `${e}` : "",
    });
  };

  const handleChangeAccount = (e: number | undefined) => {
    setDataFilter((prev) => ({ ...prev, dataAccount: e ? `${e}` : "" }));
    getListTransaction({
      typeAccount: e ? `${e}` : "",
    });
  };

  return (
    <div>
      <Header />
      <div className="px-[30px]">
        <div className="text-[32px] font-bold py-5">
          Báo cáo quản lý tài sản
        </div>

        <Row gutter={[60, 20]}>
          <Col span={4}>
            <div className="flex flex-col gap-7">
              <CardAseet
                title="Giao dịch"
                type={0}
                handleClick={handleClick}
                active={active}
              />
              <CardAseet
                title="Tiền mặt"
                quantity={asset?.cashTotal}
                type={1}
                handleClick={handleClick}
                active={active}
              />
              <CardAseet
                title="Vàng"
                quantity={asset?.goldTotal}
                type={2}
                handleClick={handleClick}
                active={active}
              />
              <CardAseet
                title="Bất động sản"
                quantity={asset?.realEstateTotal}
                type={3}
                handleClick={handleClick}
                active={active}
              />
            </div>
          </Col>
          <Col span={20}>
            {transaction && active === 0 ? (
              <div className="flex items-center gap-4 mb-10">
                <Select
                  options={listOptions.account}
                  placeholder="Loại tài khoản"
                  style={{ width: 245 }}
                  allowClear
                  onChange={(e) => handleChangeAccount(e)}
                />
                <Select
                  options={listOptions.system}
                  placeholder="Hệ thống"
                  style={{ width: 245 }}
                  allowClear
                  onChange={(e) => handleChangeSystem(e)}
                />
                <Select
                  options={listOptions.branch}
                  placeholder="Chi nhánh"
                  style={{ width: 245 }}
                  allowClear
                  disabled={
                    dataFilter.dataSystem === "" ||
                    listOptions.branch.length === 0
                  }
                  onChange={(e) => handleChangeBranch(e)}
                />
                <Select
                  options={listOptions.team}
                  placeholder="Đội nhóm"
                  style={{ width: 245 }}
                  allowClear
                  disabled={
                    dataFilter.dataBranch === "" ||
                    listOptions.team.length === 0
                  }
                  onChange={(e) => handleChangeTeam(e)}
                />

                <Select
                  options={listOptions.team_acount}
                  placeholder="Nhóm tài khoản"
                  style={{ width: 245 }}
                  allowClear
                  onChange={(e) => handleChangeTeamAccount(e)}
                />
                <DatePicker
                  onChange={handleChangeYearTransaction}
                  picker="year"
                  placeholder="Năm"
                  disabledDate={disabledDate}
                />
                <Select
                  placeholder="Tháng"
                  style={{ width: 150 }}
                  allowClear
                  options={options}
                  disabled={dataFilter.dataYear === ""}
                  onChange={(e) => handleChangeMonthTransaction(e)}
                />
              </div>
            ) : (
              <div className="flex items-center gap-4 mb-10">
                <DatePicker
                  onChange={handleChangeYear}
                  picker="year"
                  placeholder="Năm"
                  disabledDate={disabledDate}
                />
                <Select
                  placeholder="Tháng"
                  style={{ width: 150 }}
                  allowClear
                  options={options}
                  disabled={year === ""}
                  onChange={(e) => handleChangeMonth(e)}
                />
              </div>
            )}

            <div>
              {isPending ? (
                <Spin />
              ) : (
                <>
                  {transaction &&
                    active === 0 &&
                    (transaction.length > 0 ? (
                      <ChartTransaction transaction={transaction} />
                    ) : (
                      <p className="text-base text-center italic pt-40">
                        Không có dữ liệu!
                      </p>
                    ))}
                  {chart?.cashChart && active === 1 && (
                    <ChartMoney
                      moneyChart={chart.cashChart}
                      progress={progress ? progress.cashChart : null}
                      handleChangeMonthProgress={handleChangeMonthProgress}
                    />
                  )}
                  {chart?.goldChart && active === 2 && (
                    <ChartGold
                      goldChart={chart.goldChart}
                      progress={progress ? progress.goldChart : null}
                      handleChangeMonthProgress={handleChangeMonthProgress}
                    />
                  )}
                  {chart?.realEstateChart && active === 3 && (
                    <ChartRealEstate
                      realEstate={chart.realEstateChart}
                      progress={progress ? progress.realEstateChart : null}
                      handleChangeMonthProgress={handleChangeMonthProgress}
                    />
                  )}
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default AssetPage;
