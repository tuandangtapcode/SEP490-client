import ReactEcharts from 'echarts-for-react'
import styled from 'styled-components'
import { Card } from 'antd'

const LineRaceWrapper = styled(Card)`
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`


const LineRace = ({ dataTotalUser }) => {

  const getOption = () => ({
    title: {
      text: 'Thống kê tài khoản',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: dataTotalUser?.TotalUserByMonth?.map(item => item?.Month),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: dataTotalUser?.TotalUserByMonth?.map(item => item?.Total),
        type: 'line',
        smooth: true,
        name: "Tổng số người dùng"
      },
      {
        data: dataTotalUser?.TotalNewUserByMonth.map(item => item?.Total),
        type: 'line',
        smooth: true,
        name: "Người dùng mới"
      },
    ],
  })

  return (
    <LineRaceWrapper >
      <ReactEcharts option={getOption()} style={{ height: '300px', width: '100%' }} />
    </LineRaceWrapper>
  )
}

export default LineRace
