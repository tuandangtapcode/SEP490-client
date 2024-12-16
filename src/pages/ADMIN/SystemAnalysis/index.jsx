import { Col, Row, Statistic } from "antd"
import { useEffect, useState } from "react"
import SpinCustom from "src/components/SpinCustom"
import StatisticService from "src/services/StatisticService"
import { StatisticCardWrapper } from "../StatisticManagement"
import CountUp from "react-countup"
import LineRace from "./components/LineRace"
import ListBooking from "./components/ListBooking"

const formatter = (value) => <CountUp end={value} separator="," />

const SystemAnalysis = () => {

  const [loading, setLoading] = useState(false)
  const [dataTotalBooking, setDataTotalBooking] = useState()
  const [dataTotalUser, setDataTotalUser] = useState()

  const statisticNewRegisteredUser = async () => {
    try {
      setLoading(true)
      const res = await StatisticService.statisticNewRegisteredUser()
      if (!!res?.isError) return
      setDataTotalUser(res?.data)
    } finally {
      setLoading(false)
    }
  }

  const statisticTotalBooking = async () => {
    try {
      setLoading(true)
      const res = await StatisticService.statisticTotalBooking()
      if (!!res?.isError) return
      setDataTotalBooking(res?.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    statisticNewRegisteredUser()
    statisticTotalBooking()
  }, [])


  return (
    <SpinCustom spinning={loading}>
      <Row gutter={[8, 8]} className="d-flex-center">
        <Col span={10}>
          <StatisticCardWrapper>
            <Statistic title="Tổng số người dùng" value={dataTotalUser?.TotalUser} formatter={formatter} />
          </StatisticCardWrapper>
        </Col>
        <Col span={10}>
          <StatisticCardWrapper>
            <Statistic title="Số người dùng mới (Tuần này)" value={dataTotalUser?.TotalNewUser} formatter={formatter} />
          </StatisticCardWrapper>
        </Col>
        <Col span={8}>
          <StatisticCardWrapper>
            <Statistic title="Tổng số booking" value={dataTotalBooking?.TotalBooking} formatter={formatter} />
          </StatisticCardWrapper>
        </Col>
        <Col span={8}>
          <StatisticCardWrapper>
            <Statistic title="Booking đã xác nhận" value={dataTotalBooking?.SuccessBooking} formatter={formatter} />
          </StatisticCardWrapper>
        </Col>
        <Col span={8}>
          <StatisticCardWrapper>
            <Statistic title="Booking đã hủy" value={dataTotalBooking?.CancelBooking} formatter={formatter} />
          </StatisticCardWrapper>
        </Col>
        <Col span={12}>
          <LineRace dataTotalUser={dataTotalUser} />
        </Col>
        <Col span={12}>
          <ListBooking />
        </Col>
      </Row>
    </SpinCustom>
  )
}

export default SystemAnalysis