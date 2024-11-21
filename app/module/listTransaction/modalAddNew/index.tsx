import { ModalAddNewType } from "@/app/common/type";
import BaseModal from "@/app/component/config/BaseModal";

import React from "react";
import type { TabsProps } from "antd";
import { Tabs } from "antd";
import { FormMoney } from "./FormMoney";
import { FormGold } from "./FormGold";
import { FormRealEstate } from "./FormRealEstate";

const ModalAddNew = ({
  isAddModalOpen = false,
  onCancel,
  fetchData,
}: ModalAddNewType) => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Rút tiền mặt",
      children: <FormMoney onCancel={onCancel} fetchData={fetchData} />,
    },
    {
      key: "2",
      label: "Mua vàng",
      children: <FormGold onCancel={onCancel} fetchData={fetchData} />,
    },
    {
      key: "3",
      label: "Mua bất động sản",
      children: <FormRealEstate onCancel={onCancel} fetchData={fetchData} />,
    },
  ];

  return (
    <BaseModal
      open={isAddModalOpen}
      onCancel={() => {
        onCancel();
        // form.resetFields();
      }}
      title="Thêm mới giao dịch quản lý tài sản"
      offPadding
      className="!w-[1000px]"
    >
      <Tabs
        defaultActiveKey="1"
        items={items}
        className="w-full modal-list-transaction-tabs"
      />
    </BaseModal>
  );
};

export default ModalAddNew;
