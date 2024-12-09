import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

// Đăng ký các thành phần
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const ListTopSubject = ({ subjects }) => {

  const data = {
    labels: subjects?.map(i => i?.SubjectName),
    datasets: [
      {
        label: "Số học sinh đăng ký",
        data: subjects?.map(i => i?.Total),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }

  return (
    <Bar data={data} options={options} />
  )
}

export default ListTopSubject