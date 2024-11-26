import {
  FormMoneyType,
  FaceValueType,
  ItemFaceValueChooseType,
} from "@/src/common/type";
import { fetchBankAccounts, getTypeAsset } from "@/src/services/bankAccount";
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

export const FormRealEstate = ({
  onCancel,
  fetchData,
  banks,
}: FormMoneyType) => {
  const [form] = Form.useForm();

  const [bankAccount, setBankAccount] = useState([]);
  const [listTransType, setListTransType] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [listFaceValue, setListFaceValue] = useState([]);
  const [faceValueChoose, setFaceValueChoose] = useState<
    ItemFaceValueChooseType[]
  >([]);
  const [faceValueList, setFaceValueList] = useState([]);
  const [selectedValues, setSelectedValues] = useState<string | string[]>([]);

  const getListTransType = async () => {
    try {
      const listTypeAsset = await getTypeAsset({
        cdType: "TRANS_REAL_ESTATE",
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
      const listFaceValue = await getTypeAsset({
        cdType: "TRANS_REAL_ESTATE",
        cdName: "REAL_ESTATE_TYPE",
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

  const total = faceValueChoose.reduce((sum, item) => {
    const quantity = item.quantity || 0;
    return sum + quantity;
  }, 0);

  const dataForm = form.getFieldsValue();

  const totalAmount = faceValueChoose.reduce((sum, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 0;
    return sum + price * quantity;
  }, 0);

  form.setFieldsValue({
    totalQuantity: total,
    totalAmount: `${totalAmount} ₫`,
  });

  const handleSubmit = async () => {
    try {
      const formData = form.getFieldsValue();
      await form.validateFields();

      const params = {
        bankAccountId: formData.bankAccountId,
        transDate: selectedDate,
        transType: formData.transType,
        purposeTrans: "3",
        addedBy: formData.addedBy,
        managerBy: formData.managerBy,
        departmentManager: formData.departmentManager,
        totalQuantity: total,
        totalAmount: totalAmount,
        assetInventories: faceValueChoose.map((item) => {
          return {
            value: item.value,
            quantity: item.quantity,
            price: item.price,
          };
        }),
      };
      await apiClient.post("/asset-api/add-or-update", params, {
        timeout: 30000,
      });

      fetchData();
      onCancel();
      form.resetFields();
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
            <Select options={banks} placeholder="Chọn ngân hàng giao dịch" />
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
            label="Loại hình bất động sản"
            name="assetInventories"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại hình bất động sản!",
              },
            ]}
          >
            <Space direction="vertical" size="large" className="w-full">
              <Select
                placeholder="Chọn loại hình bất động sản"
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
                className={`${dataForm.transType ? "" : "pointer-events-none"}`}
              />
            </Space>
          </Form.Item>

          {faceValueChoose.length > 0 && (
            <Form.Item
              label="Giá tiền của từng loại bất động sản"
              name="total-money"
              // rules={[
              //   {
              //     required: true,
              //     message: "Vui lòng chọn số lượng!",
              //   },
              // ]}
            >
              <div className="flex flex-col gap-3 p-4 border border-[#e5e7eb] rounded-lg">
                <div className="flex items-center justify-between mb-2 border-b border-b-[#979797]">
                  <span className="inline-block w-[40%]">Loại nhà</span>
                  <span className="inline-block w-[30%]">Giá</span>
                  <span className="inline-block w-[30%]">Số lượng</span>
                </div>
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

                    const handleChangePrice = (
                      value: number,
                      index: number
                    ) => {
                      const newList = [...faceValueChoose];
                      newList[index]["price"] = value;
                      setFaceValueChoose(newList);
                    };

                    return (
                      <div
                        key={itemFaceValue.value}
                        className="flex justify-between"
                      >
                        <span className="w-[110px]">{itemFaceValue.label}</span>
                        <InputNumber
                          min={1}
                          // defaultValue={1}
                          onChange={(value) =>
                            handleChangePrice(value ?? 0, index)
                          }
                          className="input-number-custom w-[100px]"
                          formatter={(value) => `${value} ₫`}
                          // parser={(value) =>
                          //   value?.replace("₫", "") as unknown as number
                          // }
                        />
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
                            className="input-number-custom w-[40px]"
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
            label="Người mua"
            name="addedBy"
            rules={[{ required: true, message: "Vui lòng chọn người mua!" }]}
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
            rules={[
              { required: true, message: "Vui lòng chọn người tổng tiền!" },
            ]}
          >
            <InputNumber
              className="input-number-custom-total"
              placeholder="Tổng tiền:"
            />
          </Form.Item>

          <Form.Item label="Ghi chú" name="descriptionTransType">
            <Input.TextArea
              placeholder="Nhập ghi chú"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button onClick={onCancel} className="w-[189px] !h-10">
              Đóng
            </Button>
            <Form.Item className="!my-auto">
              <Button
                type="primary"
                onClick={() => {
                  handleSubmit();
                }}
                className="w-full !!h-10 bg-[#4B5CB8] hover:bg-[#3A4A9D]"
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
