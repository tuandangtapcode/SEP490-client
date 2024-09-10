import { Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import Router from 'src/routers'

const { Meta } = Card

const CardItem = ({ SubjectName, AvatarPath, _id }) => {

  const navigate = useNavigate()

  return (
    <Card
      hoverable
      cover={
        <img
          alt={SubjectName}
          src={AvatarPath}
          style={{ width: "100%", height: "230px" }}
        />
      }
      onClick={() => navigate(`${Router.TIM_KIEM_GIAO_VIEN}/${_id}`)}
    >
      <Meta
        title={SubjectName}
        className='center-text'
      />
    </Card>
  )
}

export default CardItem
