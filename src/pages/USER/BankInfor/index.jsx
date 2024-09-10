import { Button, Form, Input, Select } from "antd"
import { Container, FormWrapper } from "./styled"
import { useEffect, useState } from "react"
import SpinCustom from "src/components/SpinCustom"
import BankingService from "src/services/BankingService"
import { toast } from "react-toastify"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"

const BankInfor = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [listBank, setListBank] = useState([])
  const [filteredBanks, setFilteredBanks] = useState([])
  const [bankingInfoAccount, setBankingInfoAccount] = useState([])
  const [disableInput, setDisableInput] = useState(false)

  const { user } = useSelector(globalSelector)


  const getListBank = async () => {
    try {
      setLoading(true)
      const res = await BankingService.getListBank()
      if (!res?.data?.data) return toast.error(res?.data?.desc)
      setListBank(res?.data?.data)
      setFilteredBanks(res?.data?.data)
    } finally {
      setLoading(false)
    }
  }

  const getInforBankAccount = async (value) => {
    try {
      setLoading(true)
      const values = await form.getFieldsValue()
      const body = {
        bin: values?.bank,
        accountNumber: value
      }
      if (!body?.bin || !body?.accountNumber) return
      const res = await BankingService.getInforBankAccount(body)

      if (!res?.data?.data) return toast.error(res?.data?.desc)
      form.setFieldValue("accountName", res?.data?.data?.accountName)

    } finally {
      setLoading(false)
    }
  }

  const getDetailBankingInfor = async () => {
    try {
      setLoading(true)
      const res = await BankingService.getDetailBankingInfor()
      if (res?.isError) return
      setBankingInfoAccount(res?.data)
      setDisableInput(true)
      form.setFieldsValue({
        bank: res?.data?.BankID.toString(),
        accountName: res?.data?.UserBankName,
        accountNumber: res?.data?.UserBankAccount,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const body = {
        BankID: values?.bank,
        UserBankName: values?.accountName,
        UserBankAccount: values?.accountNumber,
        BankingInforID: !!bankingInfoAccount ? bankingInfoAccount?._id : undefined
      }
      const res = !!bankingInfoAccount?._id
        ? await BankingService.updateBankingInfor(body)
        : await BankingService.createBankingInfor(body)
      if (res?.isError) return toast.error(res?.msg)
      toast.success(res?.msg)
      setDisableInput(true)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    getListBank()
    getDetailBankingInfor()
  }, [])

  const onSearch = (value) => {
    if (!value) {
      setFilteredBanks(listBank)
      return
    }
    const filtered = listBank.filter(
      (bank) =>
        bank.shortName.toLowerCase().includes(value.toLowerCase()) ||
        bank.code.toLowerCase().includes(value.toLowerCase()) ||
        bank.name.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredBanks(filtered)
  }

  return (
    <SpinCustom spinning={loading}>
      <Container>
        <FormWrapper>
          <h1 className="d-flex-center mb-40">
            {!!bankingInfoAccount ?
              "Thông tin tài khoản ngân hàng" :
              "Cập nhật thông tin tài khoản ngân hàng"
            }
          </h1>
          <Form
            form={form}
            initialValues={{ remember: true }}
            layout="vertical"
          >
            <Form.Item
              name="bank"
              label="Tên ngân hàng:"
              rules={[{ required: true, message: 'Vui lòng chọn tên ngân hàng!' }]}
            >
              <Select
                placeholder="Chọn ngân hàng"
                showSearch
                onSearch={onSearch}
                filterOption={false}
                onChange={() => {
                  form.setFieldsValue({
                    accountNumber: "",
                    accountName: ""
                  })
                }}
                disabled={disableInput}
              >
                {filteredBanks.map(data => (
                  <Select.Option key={data?.id} value={data?.bin}>
                    {data?.shortName} {(data?.code === data?.shortName) ? "" : `(${data?.code})`} - {data?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="accountNumber"
              label="Số tài khoản:"
              rules={[{ required: true, message: 'Vui lòng nhập số tài khoản!' }]}
            >
              <Input
                className="fw-600"
                onBlur={e => getInforBankAccount(e.target.value)}
                disabled={disableInput}
              />
            </Form.Item>

            <Form.Item
              name="accountName"
              label="Tên tài khoản:"
              rules={[{ required: true, message: '' }]}
            >
              <Input disabled={true} className="fw-700" />
            </Form.Item>
            {!!disableInput ?
              <Button type="dashed" onClick={() => setDisableInput(false)}>
                Chỉnh sửa
              </Button>
              :
              <Button type="primary" onClick={() => handleSubmit()}>
                Cập nhật
              </Button>
            }
          </Form>
        </FormWrapper>
      </Container>
    </SpinCustom >
  )
}

export default BankInfor