import { Card, Col, Row, Select, Statistic } from "antd"
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
import SubjectService from "src/services/SubjectService"
import ListTopSubject from "./components/ListTopSubject"

const formatter = (value) => <CountUp end={value} separator="," />

export const StatisticCardWrapper = styled(Card)`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
`

const StatisticManagement = () => {

  const [loading, setLoading] = useState(false)
  const [newRegister, setNewRegister] = useState({})
  const [financial, setFinancial] = useState([])
  const { profitPercent } = useSelector(globalSelector)
  const [openChangeProfitPercent, setOpenChangeProfitPercent] = useState(false)
  const [key, setKey] = useState("")
  const [subjects, setSubjects] = useState([])

  const statisticNewRegisteredUser = async () => {
    try {
      setLoading(true)
      const res = await StatisticService.statisticNewRegisteredUser(key)
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

  const getListTopSubject = async () => {
    try {
      setLoading(true)
      const res = await SubjectService.getListTopSubject()
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    statisticNewRegisteredUser()
  }, [key])

  useEffect(() => {
    statisticFinancial()
    getListTopSubject()
  }, [])

  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[16, 16]} className="d-flex-center mb-20">
        <Col span={8}>
          <StatisticCardWrapper>
            <Statistic title="Doanh thu" value={financial?.Revenue} formatter={formatter} />
          </StatisticCardWrapper>
        </Col>
        <Col span={8}>
          <StatisticCardWrapper>
            <Statistic title="Chi phí cho giáo viên" value={financial?.Expense} formatter={formatter} />
          </StatisticCardWrapper>
        </Col>
        <Col span={8}>
          <StatisticCardWrapper>
            <Statistic title="Chi phí đã thanh toán" value={financial?.CostPaid} formatter={formatter} />
          </StatisticCardWrapper>
        </Col>
        <Col span={7}>
          <StatisticCardWrapper>
            <Statistic title="Lợi nhuận" value={financial?.Profit} formatter={formatter} />
          </StatisticCardWrapper>
        </Col>
        <Col span={7}>
          <StatisticCardWrapper onClick={() => setOpenChangeProfitPercent(profitPercent)}>
            <Statistic title="Phần trăm lợi nhuận" value={`${profitPercent * 100}%`} />
          </StatisticCardWrapper>
        </Col>
        <Col span={12}>
          <Pie
            newRegister={newRegister}
            setKey={setKey}
          />
        </Col>
        <Col span={12}>
          <LineRace />
        </Col>
        <Col span={12}>
          <ListTopSubject subjects={subjects} />
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