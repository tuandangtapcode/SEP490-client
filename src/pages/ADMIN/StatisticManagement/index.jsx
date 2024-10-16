import { Card, Col, Row, Statistic } from "antd"
import { useEffect, useState } from "react"
import CountUp from "react-countup"
import { toast } from "react-toastify"
import SpinCustom from "src/components/SpinCustom"
import StatisticService from "src/services/StatisticService"
import styled from "styled-components"
import LineRace from "./components/LineRace"
import Pie from "./components/Pie"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import ModalChangeProfitPercent from "./components/ModalChangeProfitPercent"

const formatter = (value) => <CountUp end={value} separator="," />

// Styled components
const StatisticCardWrapper = styled(Card)`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;


const StatisticManagement = () => {

  const [loading, setLoading] = useState(false)
  const [newRegister, setNewRegister] = useState({})
  const [financial, setFinancial] = useState([])
  const { profitPercent } = useSelector(globalSelector)
  const [openChangeProfitPercent, setOpenChangeProfitPercent] = useState(false)

  const statisticNewRegisteredUser = async () => {
    try {
      setLoading(true)
      const res = await StatisticService.statisticNewRegisteredUser('Month')
      if (!!res?.isError) return toast.error(res?.msg)
      setNewRegister(res?.data)
    } finally {
      setLoading(false)
    }
  }

  const statisticFinancial = async () => {
    try {
      setLoading(true)
      const res = await StatisticService.statisticFinancial()
      if (!!res?.isError) return toast.error(res?.msg)
      setFinancial(res?.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    statisticNewRegisteredUser()
    statisticFinancial()
  }, [])

  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <StatisticCardWrapper>
            <Statistic title="Doanh thu" value={financial?.Revenue} formatter={formatter} />
          </StatisticCardWrapper>
        </Col>
        <Col span={6}>
          <StatisticCardWrapper>
            <Statistic title="Chi trả cho giáo viên" value={financial?.Profit} formatter={formatter} />
          </StatisticCardWrapper>
        </Col>
        <Col span={6}>
          <StatisticCardWrapper>
            <Statistic title="Lợi nhuận" value={financial?.Expense} formatter={formatter} />
          </StatisticCardWrapper>
        </Col>
        <Col span={6}>
          <StatisticCardWrapper onClick={() => setOpenChangeProfitPercent(profitPercent)}>
            <Statistic title="Phần trăm lợi nhuận" value={`${profitPercent * 100}%`} />
          </StatisticCardWrapper>
        </Col>
        <Col span={12}>
          <Pie
            newRegister={newRegister}
          />
        </Col>
        <Col span={12}>
          <LineRace />
        </Col>
      </Row>

      {
        !!openChangeProfitPercent &&
        <ModalChangeProfitPercent
          open={openChangeProfitPercent}
          onCancel={() => setOpenChangeProfitPercent(false)}
        />
      }
    </SpinCustom>
  )
}

export default StatisticManagement