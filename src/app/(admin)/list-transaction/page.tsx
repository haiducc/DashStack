"use client";

import { Button, DatePicker, Form, Select, Skeleton, Table } from "antd";
import { useContext, useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";

import Header from "@/src/component/Header";
import ModalAddNew from "@/src/module/listTransaction/modalAddNew";
import { apiClient } from "@/src/services/base_api";
import { DeatailIcon } from "@/public/icon/detail";
import { DataTransactionType } from "@/src/common/type";
import { buildSearchParams, formatDate } from "@/src/utils/buildQueryParams";
import { RoleContext } from "@/src/component/RoleWapper";

type DataTypeWithKey = DataTransactionType & { key: React.Key };

export interface TransactionFilter {
  label: string;
  key: string;
}

export interface ListOptionType {
  typeTransaction: TransactionFilter[];
  kindTransaction: TransactionFilter[];
}

const ListTransactionPage = () => {
  const { dataRole } = useContext(RoleContext);
  const keys = dataRole.key;
  const values = `${dataRole.value}`;

  const { RangePicker } = DatePicker;

  const [form] = Form.useForm();
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [dataTransaction, setDataTransaction] = useState<DataTransactionType[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [listOption, setListOption] = useState<ListOptionType>({
    typeTransaction: [],
    kindTransaction: [],
  });

  const [dataFilter, setDataFilter] = useState({
    dataTypeTransaction: "",
    dataKindTransaction: "",
    startDate: "",
    endDate: "",
  });

  const getListTypeTransaction = async () => {
    const responsive = await apiClient.get("/allcode-api/find", {
      params: {
        cdType: "TRANSACTION",
        cdName: "TRANS_TYPE",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataConvert = responsive.data.data.map((item: any) => {
      return { label: item.vnContent, value: item.cdVal };
    });
    setListOption((prev) => ({ ...prev, typeTransaction: dataConvert }));
  };

  const getListKindTransaction = async () => {
    const responsive = await apiClient.get("/allcode-api/find", {
      params: {
        cdType: "TRANSACTION",
        cdName: "TRANS_KIND",
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataConvert = responsive.data.data.map((item: any) => {
      return { label: item.vnContent, value: item.cdVal };
    });
    setListOption((prev) => ({ ...prev, kindTransaction: dataConvert }));
  };

  useEffect(() => {
    getListTypeTransaction();
    getListKindTransaction();
  }, []);

  const columns = [
    { title: "id", dataIndex: "id", key: "id", hidden: true },
    {
      title: "Người rút",
      dataIndex: "addedBy",
      key: "addedBy",
    },
    { title: "Người quản lý", dataIndex: "managerBy", key: "managerBy" },
    {
      title: "Ngày giao dịch",
      dataIndex: "createdDate",
      key: "createdDate",
      render: (date: string) => {
        // Định dạng lại chuỗi thời gian
        return dayjs(date).format("DD/MM/YYYY HH:mm:ss"); // Ví dụ định dạng ngày/tháng/năm giờ:phút:giây
      },
    },
    {
      title: "Giao dịch",
      dataIndex: "transType",
      key: "transType",
    },
    {
      title: "Bộ phận quản lý",
      dataIndex: "departmentManager",
      key: "departmentManager",
    },
    {
      title: "Chi tiết",
      key: "action",
      render: () => <DeatailIcon />,
    },
  ];

  const fetchData = async ({
    transType,
    transKind,
    startDate,
    endDate,
  }: {
    transType?: string;
    transKind?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const arr = [
      {
        Name: keys!,
        Value: values,
      },
    ];
    if (transType || dataFilter.dataTypeTransaction) {
      arr.push({
        Name: "transType",
        Value: transType ?? dataFilter.dataTypeTransaction,
      });
    }
    if (transKind || dataFilter.dataKindTransaction) {
      arr.push({
        Name: "transKind",
        Value: transKind ?? dataFilter.dataKindTransaction,
      });
    }
    if (
      (startDate && endDate) ||
      (dataFilter.startDate && dataFilter.endDate)
    ) {
      arr.push(
        {
          Name: "startDate",
          Value: startDate ?? dataFilter.startDate,
        },
        {
          Name: "endDate",
          Value: endDate ?? dataFilter.endDate,
        }
      );
    }

    const params = buildSearchParams(arr, {
      pageIndex: 1,
      pageSize: 20,
    });

    try {
      setLoading(true);
      const responsive = await apiClient.get("/asset-api/find", { params });

      setDataTransaction(responsive.data.data.source);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData({});
  }, []);

  const handleCancel = () => {
    setIsAddModalOpen((prev) => !prev);
  };

  const handleCreateAdd = () => {
    form.resetFields();
    setIsAddModalOpen(true);
  };

  const handleChangeType = (e: string | undefined) => {
    setDataFilter((prev) => ({ ...prev, dataTypeTransaction: e ?? "" }));
    fetchData({
      transType: e ?? "",
    });
  };
  const handleChangeKind = (e: string | undefined) => {
    setDataFilter((prev) => ({ ...prev, dataKindTransaction: e ?? "" }));
    fetchData({
      transKind: e ?? "",
    });
  };

  const onRangeChange = (
    dates: null | (Dayjs | null)[],
    dateStrings: string[]
  ) => {
    setDataFilter((prev) => ({
      ...prev,
      startDate: dateStrings[0] ? formatDate(dateStrings[0]) : "",
      endDate: dateStrings[1] ? formatDate(dateStrings[1]) : "",
    }));
    if (dateStrings[0] && dateStrings[1]) {
      fetchData({
        startDate: formatDate(dateStrings[0]),
        endDate: formatDate(dateStrings[1]),
      });
    } else {
      fetchData({});
    }
  };

  return (
    <>
      <Header />
      <div className="px-[30px]">
        <div className="text-[32px] font-bold py-5">Danh sách giao dịch</div>
        <div className="flex justify-between items-center mb-7">
          <div className="flex items-center gap-2">
            <Select
              placeholder="Loại giao dịch"
              style={{ width: 245 }}
              allowClear
              options={listOption.typeTransaction}
              onChange={(e) => handleChangeType(e)}
            />
            <Select
              placeholder="Kiểu giao dịch"
              style={{ width: 245 }}
              allowClear
              options={listOption.kindTransaction}
              onChange={(e) => handleChangeKind(e)}
            />
            <RangePicker
              id={{
                start: "startInput",
                end: "endInput",
              }}
              showTime
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={onRangeChange}
              disabledDate={(current) =>
                current && current > dayjs().endOf("day")
              }
            />
          </div>
          <Button
            className="bg-[#4B5CB8] w-[136px] !h-10 text-white font-medium hover:bg-[#3A4A9D]"
            onClick={() => {
              handleCreateAdd();
            }}
          >
            Thêm mới
          </Button>
        </div>
        {loading ? (
          <Table
            rowKey="key"
            pagination={false}
            loading={loading}
            dataSource={
              [...Array(13)].map((_, index) => ({
                key: `key${index}`,
              })) as DataTypeWithKey[]
            }
            columns={columns.map((column) => ({
              ...column,
              render: function renderPlaceholder() {
                return (
                  <Skeleton
                    key={column.key as React.Key}
                    title
                    active={false}
                    paragraph={false}
                  />
                );
              },
            }))}
          />
        ) : (
          <Table dataSource={dataTransaction} columns={columns} />
        )}
      </div>

      <ModalAddNew
        isAddModalOpen={isAddModalOpen}
        onCancel={handleCancel}
        fetchData={fetchData}
      />
    </>
  );
};

export default ListTransactionPage;
