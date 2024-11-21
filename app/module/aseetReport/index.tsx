"use client";

import { TransactionIcon } from "../../../public/icon/trasaction";
import { MoneyIcon } from "../../../public/icon/money";
import { GoldIcon } from "../../../public/icon/gold";
import { RealEstateIcon } from "../../../public/icon/realEstate";
import { ArrowLeftIcon } from "../../../public/icon/arrowLeft";
import { AssetType } from "@/app/common/type";

const CardAseet = ({
  title,
  quantity,
  type,
  key,
  handleClick,
  active,
}: AssetType) => {
  const RenderIcon = ({ type, active }: { type: number; active: number }) => {
    switch (type) {
      case 1:
        return <TransactionIcon color={active === type ? "#000" : "#fff"} />;
      case 2:
        return <RealEstateIcon color={active === type ? "#000" : "#fff"} />;
      case 3:
        return <GoldIcon color={active === type ? "#000" : "#fff"} />;
      case 4:
        return <MoneyIcon color={active === type ? "#000" : "#fff"} />;
      default:
        break;
    }
  };
  const renderText = (type: number) => {
    switch (type) {
      case 1:
        return;
      case 2:
        return "Tổng tiền";
      case 3:
        return "Tổng";
      case 4:
        return "Tổng số lượng";
      default:
        break;
    }
  };

  return (
    <button
      className={`bg-[#48B9FF] p-2 gap-3 rounded-lg w-full flex flex-col items-start text-white ${
        active === type && "bg-white !text-black"
      }`}
      key={key}
      onClick={() => handleClick && handleClick(type)}
    >
      <div className="flex justify-between items-center w-full">
        <RenderIcon type={type} active={active} />
        <ArrowLeftIcon color={active === type ? "#000" : "#fff"} />
      </div>
      <h2 className="font-semibold text-2xl mx-auto">{title}</h2>
      <p className="font-semibold text-2xl">{quantity}</p>
      <p className="font-light">{renderText(type)}</p>
    </button>
  );
};

export default CardAseet;
