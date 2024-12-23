import ReactEcharts from 'echarts-for-react'
import styled from 'styled-components'
import { Card } from 'antd'

const LineRaceWrapper = styled(Card)`
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`


const LineRace = ({ dataTeacher, dataStudent }) => {

  const getOption = () => ({
    title: {
      text: 'Thống kê tài khoản',
    },
    tooltip: {
      trigger: 'axis',
    },
    xAxis: {
      type: 'category',
      data: dataTeacher.map(item => item?.Month),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: dataTeacher.map(item => item?.Total),
        type: 'line',
        smooth: true,
        name: "Giáo viên"
      },
      {
        data: dataStudent.map(item => item?.Total),
        type: 'line',
        smooth: true,
        name: "Học sinh"
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
