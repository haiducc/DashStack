import React from "react";
import { Button, Modal } from "antd";
import { DataAccountGroup } from "@/app/component/modal/modalAccountGroup";
// import { BankAccounts } from "../modal/modalBankAccount";

interface DeleteModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  selectedAccountGroup?: DataAccountGroup | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectedAccount?: any | null;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ open, onCancel, onConfirm }) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={
        <div className="flex justify-end">
          <Button onClick={onCancel} className="w-[100px] h-[40px] mr-2">
            Quay lại
          </Button>
          <Button
            type="primary"
            onClick={onConfirm}
            className="w-[100px] h-[40px] bg-red-600 border-red-600 text-white"
          >
            Xác nhận
          </Button>
        </div>
      }
    >
      <div className="flex justify-center flex-col items-center">
        <div className="text-xl font-bold text-[#DB0606]">Xác nhận xóa</div>
        <p className="flex justify-center items-center">
          Bạn có chắc chắn chấp nhận điều này không?
        </p>
      </div>
    </Modal>
  );
};

export default DeleteModal;
