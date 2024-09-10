import { Card } from 'antd'
import { useNavigate } from 'react-router-dom'
import Router from 'src/routers'

const { Meta } = Card

const CardItem = ({ SubjectCateName, AvatarPath, _id }) => {
  
  const navigate = useNavigate()

  return (
    <Card
      hoverable
      cover={
        <img
          alt={SubjectCateName}
          src={AvatarPath}
          style={{ width: "100%", height: "230px" }}
        />
      }
      onClick={() => navigate(`${Router.DANH_MUC}/${_id}`)}
    >
      <Meta
        title={SubjectCateName}
        className='center-text'
      />
    </Card>
  )
}

export default CardItem
