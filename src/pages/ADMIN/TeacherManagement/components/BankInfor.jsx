import { Col, Empty, Row } from "antd"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import BankingService from "src/services/BankingService"


const BankInfor = ({ user }) => {

  const [listBank, setListBank] = useState([])

  const getListBank = async () => {
    try {
      const res = await BankingService.getListBank()
      if (!res?.data?.data) return toast.error(res?.data?.desc)
      setListBank(res?.data?.data)
    } finally {
      console.log()
    }
  }

  useEffect(() => {
    getListBank()
  }, [])

  return (
    <div className="p-12">
      {
        !!user?.BankingInfor
          ?
          <Row gutter={[0, 8]}>
            <Col span={5}>
              <div className="fw-600 fs-16">Tên tài khoản</div>
            </Col>
            <Col span={19}>
              <div className="fs-16">{user?.BankingInfor?.UserBankName}</div>
            </Col>
            <Col span={5}>
              <div className="fw-600 fs-16">Tên ngân hàng</div>
            </Col>
            <Col span={19}>
              <div className="fs-16">
                {
                  listBank?.find(i => +i?.bin === user?.BankingInfor?.BankID)?.shortName
                }
              </div>
            </Col>
            <Col span={5}>
              <div className="fw-600 fs-16">Số tài khoản</div>
            </Col>
            <Col span={19}>
              <div className="fs-16">{user?.BankingInfor?.UserBankAccount}</div>
            </Col>
          </Row>
          : <Empty description="Giáo viên chưa bổ sung thông tin ngân hàng" />
      }
    </div>
  )
}

export default BankInfor