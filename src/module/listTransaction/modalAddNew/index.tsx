import { ModalAddNewType } from "@/src/common/type";
import BaseModal from "@/src/component/config/BaseModal";

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
  banks,
}: ModalAddNewType) => {
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Rút tiền mặt",
      children: (
        <FormMoney onCancel={onCancel} fetchData={fetchData} banks={banks} />
      ),
    },
    {
      key: "2",
      label: "Mua vàng",
      children: (
        <FormGold onCancel={onCancel} fetchData={fetchData} banks={banks} />
      ),
    },
    {
      key: "3",
      label: "Mua bất động sản",
      children: (
        <FormRealEstate
          onCancel={onCancel}
          fetchData={fetchData}
          banks={banks}
        />
      ),
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
