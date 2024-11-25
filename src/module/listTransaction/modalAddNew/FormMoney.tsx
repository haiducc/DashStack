import {
  FormMoneyType,
  FaceValueType,
  ItemFaceValueChooseType,
} from "@/src/common/type";
import {
  fetchBankAccounts,
  getBank,
  getTypeAsset,
} from "@/src/services/bankAccount";
import { apiClient } from "@/src/services/base_api";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
} from "antd";
import { Dayjs } from "dayjs";
import { useState } from "react";
import { toast } from "react-toastify";

export const FormMoney = ({ onCancel, fetchData }: FormMoneyType) => {
  const [form] = Form.useForm();
  const [banks, setBanks] = useState([]);
  const [bankAccount, setBankAccount] = useState([]);
  const [listType, setListType] = useState([]);
  const [listTransType, setListTransType] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [listFaceValue, setListFaceValue] = useState([]);
  const [faceValueChoose, setFaceValueChoose] = useState<
    ItemFaceValueChooseType[]
  >([]);
  const [faceValueList, setFaceValueList] = useState([]);
  const [selectedValues, setSelectedValues] = useState<string | string[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(0);

  const getlistTypeAsset = async () => {
    try {
      const listTypeAsset = await getTypeAsset({
        cdType: "TRANS_CASH",
        cdName: "TYPE",
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const listTypeAssetConvert = listTypeAsset.map((item: any) => {
        return { label: item.vnContent, value: item.cdVal };
      });

      setListType(listTypeAssetConvert);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  const getListTransType = async () => {
    try {
      const listTypeAsset = await getTypeAsset({
        cdType: "TRANS_CASH",
        cdName: "TRANS_TYPE",
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const listTypeAssetConvert = listTypeAsset.map((item: any) => {
        return { label: item.vnContent, value: item.cdVal };
      });

      setListTransType(listTypeAssetConvert);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  const getListFaceValue = async () => {
    try {
      const data = form.getFieldsValue();
      const listFaceValue = await getTypeAsset({
        cdType: "TRANS_CASH",
        cdName: data.type === "1" ? "FACE_VALUE_VND" : "FACE_VALUE_USD",
      });

      const listFaceConvert = listFaceValue.map((item: FaceValueType) => {
        return { label: item.vnContent, value: item.cdVal };
      });

      const faceValueTotalConvert = listFaceValue.map((item: FaceValueType) => {
        return {
          value: item.cdVal,
          label: item.vnContent,
          quantity: 1,
          price: 0,
        };
      });
      setFaceValueList(faceValueTotalConvert);
      setListFaceValue(listFaceConvert);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };
  const fetchBankData = async () => {
    try {
      const bankData = await getBank(1, 20);
      const formattedBanks =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bankData?.data?.source?.map((bank: any) => ({
          value: bank.id,
          label: bank.fullName || bank.code || "Không xác định",
        })) || [];
      setBanks(formattedBanks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const genBankAccountData = async (bankId?: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const arr: any[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = {
      Name: "bankId",
      Value: bankId,
    };
    await arr.push(obj);
    try {
      const bankData = await fetchBankAccounts(1, 50, undefined, arr);
      const formattedBanks =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bankData?.data?.source?.map((bank: any) => ({
          value: bank.id,
          label: `${bank.accountNumber} - ${bank.fullName}`,
        })) || [];
      setBankAccount(formattedBanks);
    } catch (error) {
      console.error("Error fetching banks:", error);
    }
  };

  const handleChooseFaceValue = (value: string | string[]) => {
    setFaceValueChoose(
      faceValueList.filter((item: ItemFaceValueChooseType) =>
        value.includes(item.value)
      )
    );
    setSelectedValues(value);
  };

  const parseLabelToNumber = (label: string) => {
    const number = parseFloat(label.replace(/[$.]/g, ""));
    return isNaN(number) ? 0 : number;
  };

  const total = faceValueChoose.reduce((sum, item) => {
    const labelAsNumber = parseLabelToNumber(item.label || "0");
    const quantity = item.quantity || 0;
    return sum + quantity * labelAsNumber;
  }, 0);

  let formattedTotal = "";
  const dataForm = form.getFieldsValue();

  console.log("dataForm", dataForm);

  if (dataForm.type === "1") {
    formattedTotal = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(total);
  } else {
    formattedTotal = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total);
  }

  form.setFieldsValue({
    totalAmount: formattedTotal,
  });

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      const formData = form.getFieldsValue();
      const params = {
        bankAccountId: formData.bankAccountId,
        transDate: selectedDate,
        transType: formData.transType,
        purposeTrans: "1",
        type: formData.type,
        addedBy: formData.addedBy,
        managerBy: formData.managerBy,
        departmentManager: formData.departmentManager,
        totalQuantity: total,
        assetInventories: faceValueChoose.map((item) => {
          if (formData.type === "2") {
            return {
              value: item.value,
              quantity: item.quantity,
              price: exchangeRate,
            };
          }
          return {
            value: item.value,
            quantity: item.quantity,
          };
        }),
      };
      const responsiove = await apiClient.post(
        "/asset-api/add-or-update",
        params,
        {
          timeout: 30000,
        }
      );

      if (responsiove.data.message && !responsiove.data.success) {
        toast.error(responsiove.data.message);
      } else {
        fetchData();
        onCancel();
        toast.success(responsiove.data.message || "Thêm mới thành công!");
        form.resetFields();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  };

  return (
    <Form form={form} layout="vertical" className="flex flex-col gap-1 w-full">
      <Row gutter={[40, 0]}>
        <Col span={12}>
          <Form.Item
            label="Chọn ngân hàng giao dịch"
            name="bankId"
            rules={[
              { required: true, message: "Vui lòng chọn ngân hàng giao dịch!" },
            ]}
          >
            <Select
              options={banks}
              placeholder="Chọn ngân hàng giao dịch"
              onFocus={() => fetchBankData()}
            />
          </Form.Item>
          <Form.Item
            label="Loại tiền"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại tiền!" }]}
          >
            <Select
              options={listType}
              onFocus={() => getlistTypeAsset()}
              placeholder="Chọn loại tiền"
              onChange={() => {
                setListFaceValue([]);
                setFaceValueChoose([]);
                setSelectedValues([]);
              }}
            />
          </Form.Item>
          {dataForm.type === "2" && (
            <Form.Item
              label="Tỷ giá"
              name="exchange-rate"
              rules={[{ required: true, message: "Vui lòng chọn tỷ giá!" }]}
            >
              <InputNumber
                placeholder="Chọn tỷ giá"
                min={1}
                onChange={(value) => setExchangeRate(value ?? 0)}
                className="w-full"
              />
            </Form.Item>
          )}
          <Form.Item
            label="Thời gian giao dịch"
            name="transDate"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn thời gian giao dịch!",
              },
            ]}
          >
            <Space direction="vertical" size="large" className="w-full">
              <DatePicker
                className="w-full"
                showTime
                required
                onChange={async (value: Dayjs | null) => {
                  const formattedDate = await value?.format(
                    "YYYY-MM-DDTHH:mm:ss.SSSZ"
                  );
                  setSelectedDate(formattedDate!);
                  form.setFieldsValue({
                    transDate: formattedDate,
                  });
                }}
              />
            </Space>
          </Form.Item>
          <Form.Item
            label="Mệnh giá"
            name="assetInventories"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn mệnh giá!",
              },
            ]}
          >
            <Space direction="vertical" size="large" className="w-full">
              <Select
                placeholder="Chọn mệnh giá"
                mode="tags"
                style={{ width: "100%" }}
                onFocus={() => getListFaceValue()}
                onChange={(value) => {
                  handleChooseFaceValue(value);
                  form.setFieldsValue({
                    assetInventories: value,
                  });
                }}
                tokenSeparators={[","]}
                options={listFaceValue}
                value={selectedValues}
                className={`${dataForm.type ? "" : "pointer-events-none"}`}
              />
            </Space>
          </Form.Item>
          {faceValueChoose.length > 0 && (
            <Form.Item
              label="Số lượng tờ tiền của từng mệnh giá"
              name="total-money"
              // rules={[
              //   {
              //     required: true,
              //     message: "Vui lòng chọn số lượng!",
              //   },
              // ]}
            >
              <div className="flex flex-col gap-3 p-4 border border-[#e5e7eb] rounded-lg">
                {faceValueChoose?.map(
                  (itemFaceValue: ItemFaceValueChooseType, index: number) => {
                    const handleClickDesc = (index: number) => {
                      if (itemFaceValue.quantity > 1) {
                        const newList = [...faceValueChoose];
                        newList[index].quantity -= 1;
                        setFaceValueChoose(newList);
                      }
                    };
                    const handleClickAsc = (index: number) => {
                      const newList = [...faceValueChoose];
                      newList[index].quantity += 1;
                      setFaceValueChoose(newList);
                    };

                    return (
                      <div
                        key={itemFaceValue.value}
                        className="flex justify-between"
                      >
                        <span>{itemFaceValue.label}</span>
                        <div className="flex gap-4">
                          <Button
                            onClick={() => handleClickDesc(index)}
                            className={`${
                              itemFaceValue.quantity === 1 &&
                              "pointer-events-none"
                            }`}
                          >
                            -
                          </Button>
                          <InputNumber
                            min={1}
                            max={100000}
                            value={itemFaceValue.quantity}
                            // onChange={onChange}
                            className="input-number-custom"
                          />
                          <Button onClick={() => handleClickAsc(index)}>
                            +
                          </Button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </Form.Item>
          )}
        </Col>
        <Col span={12}>
          <Form.Item
            label="Tài khoản rút tiền"
            name="bankAccountId"
            rules={[
              { required: true, message: "Vui lòng chọn tài khoản giao dịch!" },
            ]}
          >
            <Select
              onFocus={() => {
                const formData = form.getFieldsValue();
                genBankAccountData(formData.bankId);
              }}
              options={bankAccount}
              placeholder="Chọn tài khoản giao dịch"
            />
          </Form.Item>
          <Form.Item
            label="Loại giao dịch"
            name="transType"
            rules={[
              { required: true, message: "Vui lòng chọn loại giao dịch!" },
            ]}
          >
            <Select
              options={listTransType}
              onFocus={() => {
                getListTransType();
              }}
              placeholder="Chọn loại giao dịch"
            />
          </Form.Item>

          <Form.Item
            label="Người rút tiền"
            name="addedBy"
            rules={[
              { required: true, message: "Vui lòng chọn người rút tiền!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Người quản lý"
            name="managerBy"
            rules={[
              { required: true, message: "Vui lòng chọn người quản lý!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Bộ phận quản lý"
            name="departmentManager"
            rules={[
              { required: true, message: "Vui lòng chọn bộ phận quản lý!" },
            ]}
          >
            <Input placeholder="Bộ phận quản lý" />
          </Form.Item>
          <Form.Item
            label="Tổng tiền"
            name="totalAmount"
            // rules={[
            //   { required: true, message: "Vui lòng chọn người tổng tiền!" },
            // ]}
          >
            <InputNumber className="input-number-custom-total" />
          </Form.Item>
          <Form.Item label="Ghi chú" name="descriptionTransType">
            <Input.TextArea
              placeholder="Nhập ghi chú"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <div className="flex items-center justify-between gap-2">
            <Button onClick={onCancel} className="w-[189px] h-[42px]">
              Đóng
            </Button>
            <Form.Item className="my-auto flex-[50%]">
              <Button
                type="primary"
                onClick={() => {
                  handleSubmit();
                }}
                className="w-full h-[40px] bg-[#4B5CB8] hover:bg-[#3A4A9D]"
              >
                Tiếp tục
              </Button>
            </Form.Item>
          </div>
        </Col>
      </Row>
    </Form>
  );
};
