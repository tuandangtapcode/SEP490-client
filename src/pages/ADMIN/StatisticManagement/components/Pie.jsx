import { Card } from "antd"
import ReactECharts from 'echarts-for-react'

const Pie = ({ dataUser }) => {

  const chartOptions = {
    title: {
      text: `Tài khoản (${dataUser?.Total})`,
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        type: 'pie',
        radius: '50%',
        data: [
          { value: dataUser.TotalTeacher, name: 'Tài khoản giáo viên' },
          { value: dataUser.TotalStudent, name: 'Tài khoản học sinh' },
        ],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  return (
    <Card style={{ width: '100%', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
      <ReactECharts option={chartOptions} />
    </Card>
  )
}

export default Pie