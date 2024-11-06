"use client";
import React from "react";
import { Form } from "antd";

const HiddenForm = () => {
  return (
    <>
      <Form.Item
        hidden
        className="w-[45%]"
        label="Chọn hệ thống"
        name="groupSystemId"
      ></Form.Item>
      <Form.Item
        hidden
        className="w-[45%]"
        label="Chọn chi nhánh"
        name="groupBranchId"
      ></Form.Item>
      <Form.Item
        hidden
        className="w-[45%]"
        label="Chọn đội nhóm"
        name="groupTeamId"
      ></Form.Item>
      {/* <Form.Item
        hidden
        className="w-[45%]"
        label="Chọn đội nhóm"
        name="bankId"
      ></Form.Item> */}
    </>
  );
};

export default HiddenForm;
