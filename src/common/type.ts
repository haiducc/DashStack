/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

export interface ItemAssetType {
  title: string;
  quantity: number;
  type: number;
}

export interface AssetType {
  title: string;
  quantity: number;
  type: number;
  key: string;
  handleClick?: (type: number) => void;
  active: number;
}

export interface QuantityType {
  quantity_in: number;
  quantity_out: number;
  remaining_balance: number;
}

export type Transaction1Props = {
  className?: string;
  color?: string;
} & React.SVGProps<SVGSVGElement>;

export interface ModalAddNewType {
  isAddModalOpen: boolean;
  onCancel: () => void;
  fetchData: () => void;
  banks?: any;
}

export interface FormMoneyType {
  onCancel: () => void;
  fetchData: () => void;
  banks?: any;
}

export interface FaceValueType {
  cdName: string;
  cdType: string;
  cdVal: string;
  createdBy: Date | null;
  createdDate: Date | null;
  id: number;
  isDelete: boolean;
  modifiedBy: Date | null;
  modifiedDate: Date | null;
  vnContent: string;
}
export interface ItemFaceValueType {
  value: string;
  label: string;
}

export interface ItemFaceValueChooseType {
  value: string;
  label?: string;
  quantity: number;
  price: number;
}
