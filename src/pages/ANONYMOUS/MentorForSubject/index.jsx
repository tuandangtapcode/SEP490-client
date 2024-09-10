import { UserOutlined } from '@ant-design/icons'
import { Avatar, Button, Checkbox, Col, Row, Select, Slider, Typography } from "antd"
import {
  DayButton,
  DayContainer,
  FilterSection,
  FilterTitle,
  MentorForSubjectContainer,
  Sidebar,
  StyledCard,
  TimeSlotButton
} from "./styled"

import { useSelector } from "react-redux"
import InputCustom from "src/components/InputCustom"
import ListIcons from "src/components/ListIcons"
import { getListComboKey } from "src/lib/commonFunction"
import { SYSTEM_KEY } from "src/lib/constant"
import { globalSelector } from "src/redux/selector"
import { useEffect, useState } from 'react'
import SpinCustom from 'src/components/SpinCustom'
import UserService from 'src/services/UserService'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography
const { Option } = Select

const data = [
  {
    id: 1,
    title: 'Koudetat à la Maison #1 (L\'intégrale)',
    description: 'We focus on ergonomics and meeting you where you work. It\'s only a keystroke away.',
    author: 'Annette Black',
    authorTitle: 'Director, Producer',
    imageUrl: '/path/to/image.jpg'
  },
  {
    id: 2,
    title: 'Koudetat à la Maison #1 (L\'intégrale)',
    description: 'We focus on ergonomics and meeting you where you work. It\'s only a keystroke away.',
    author: 'Annette Black',
    authorTitle: 'Director, Producer',
    imageUrl: '/path/to/image.jpg'
  },
  {
    id: 3,
    title: 'Koudetat à la Maison #1 (L\'intégrale)',
    description: 'We focus on ergonomics and meeting you where you work. It\'s only a keystroke away.',
    author: 'Annette Black',
    authorTitle: 'Director, Producer',
    imageUrl: '/path/to/image.jpg'
  },
  {
    id: 4,
    title: 'Koudetat à la Maison #1 (L\'intégrale)',
    description: 'We focus on ergonomics and meeting you where you work. It\'s only a keystroke away.',
    author: 'Annette Black',
    authorTitle: 'Director, Producer',
    imageUrl: '/path/to/image.jpg'
  },
  {
    id: 5,
    title: 'Koudetat à la Maison #1 (L\'intégrale)',
    description: 'We focus on ergonomics and meeting you where you work. It\'s only a keystroke away.',
    author: 'Annette Black',
    authorTitle: 'Director, Producer',
    imageUrl: '/path/to/image.jpg'
  },

]


const MentorForSubject = () => {

  const id = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [listMentor, setListMentor] = useState([])
  const [pagination, setPagination] = useState({
    TextSearch: "",
    SubjectID: !!id?.SubjectID ? id?.SubjectID : "",
    CurrentPage: 1,
    PageSize: 10,
    LearnType: [],
    Level: [],
    FromPrice: "0",
    ToPrice: "500000",
    SortByPrice: 1,
  })

  const { listSystemKey } = useSelector(globalSelector)
  const LearnType = getListComboKey(SYSTEM_KEY.LEARN_TYPE, listSystemKey)
  const SkillLevel = getListComboKey(SYSTEM_KEY.SKILL_LEVEL, listSystemKey)

  const getListSubjectCate = async () => {
    try {
      setLoading(true)
      const res = await UserService.getListTeacherByUser(pagination)
      if (res?.isError) return toast.error(res?.msg)
      setListMentor(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    getListSubjectCate()
  }, [pagination])

  return (
    <SpinCustom spinning={loading}>
      <MentorForSubjectContainer>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Col span={24} >
              <h1 className='center-text mb-20'>Tìm kiếm giáo viên</h1>
              <InputCustom
                type="isSearch"
                onChange={(e) =>
                  setPagination({
                    ...pagination,
                    TextSearch: e.target.value,
                  })
                }
                placeholder="Nhập tên giáo viên cần tìm..."
              />
              {/* <div className="d-flex mt-20 g-10">
                <p className=" blue-text fs-20">Môn học phổ biến: </p>
                <Button>Piano</Button>
                <Button>Violin</Button>
                <Button>Guitar</Button>
              </div> */}
            </Col>
          </Col>
          <Col className="mt-60" xs={24} sm={6}>
            <Sidebar>
              <FilterSection>
                <FilterTitle level={5}>Hình thức học tập</FilterTitle>
                <Checkbox.Group>
                  <Row>
                    <Col span={24}>
                      <Checkbox.Group
                        onChange={(e) =>
                          setPagination({
                            ...pagination,
                            LearnType: e,
                          })
                        }
                      >
                        {LearnType.map(type => (
                          <>
                            <Checkbox key={type?.ParentID} value={type?.ParentID}>
                              <div className="d-flex">
                                <p className="mt-4 mr-8">
                                  {(type?.ParentID === 1) ? ListIcons?.ICON_TEACHER : ListIcons?.ICON_HOME}
                                </p>
                                <p>{type?.ParentName}</p>
                              </div>
                            </Checkbox>
                          </>
                        ))}
                      </Checkbox.Group>
                    </Col>

                  </Row>
                </Checkbox.Group>
              </FilterSection>
              {/* <FilterSection>
                <FilterTitle level={5}>Thời gian học tập</FilterTitle>
                <DayContainer>
                  <DayButton>2</DayButton>
                  <DayButton>3</DayButton>
                  <DayButton>4</DayButton>
                  <DayButton>5</DayButton>
                  <DayButton>6</DayButton>
                  <DayButton>7</DayButton>
                  <DayButton>CN</DayButton>
                </DayContainer>
                <DayContainer>
                  <TimeSlotButton>6:00-9:00</TimeSlotButton>
                  <TimeSlotButton>9:00-12:00</TimeSlotButton>
                  <TimeSlotButton>12:00-15:00</TimeSlotButton>
                  <TimeSlotButton>15:00-18:00</TimeSlotButton>
                  <TimeSlotButton>18:00-21:00</TimeSlotButton>
                  <TimeSlotButton>21:00-24:00</TimeSlotButton>
                </DayContainer>
              </FilterSection> */}
              <FilterSection>
                <FilterTitle level={5}>Giá cả (VNĐ)</FilterTitle>
                <Slider
                  range
                  min={0}
                  max={2000000}
                  defaultValue={[0, 500000]}
                  tipFormatter={value => `${value} VNĐ`}
                  onChangeComplete={(e) =>
                    setPagination({
                      ...pagination,
                      FromPrice: e[0]?.toString(),
                      ToPrice: e[1]?.toString(),
                    })
                  }
                />
              </FilterSection>
              <FilterSection>
                <FilterTitle level={5}>Mức độ học tập</FilterTitle>
                <Checkbox.Group
                  onChange={(e) =>
                    setPagination({
                      ...pagination,
                      Level: e,
                    })
                  }
                >
                  {SkillLevel.map(level => (
                    <>
                      <Checkbox key={level?.ParentID} value={level?.ParentID}>
                        {level?.ParentName}
                      </Checkbox>
                    </>
                  ))}
                </Checkbox.Group>
              </FilterSection>
            </Sidebar>
          </Col>
          <Col className="mt-60" xs={24} sm={18}>
            {listMentor.length > 0 ?
              <>
                <Row justify="space-between" align="middle">
                  <Col>
                    <Title level={3}>Những giảng viên tốt nhất</Title>
                  </Col>
                  <Col>
                    <Select
                      defaultValue={1}
                      style={{ width: 150 }}
                      onChange={e => setPagination(pre => ({ ...pre, SortByPrice: e }))}
                    >
                      <Option value={1}>Giá thấp nhất</Option>
                      <Option value={-1}>Giá cao nhất</Option>
                    </Select>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  {listMentor.map((item) => (
                    <Col key={item._id} xs={24} sm={12} md={8}>
                      <StyledCard
                        className='cursor-pointer'
                        cover={<img alt={item.FullName} src={item.AvatarPath} />}
                        onClick={() => navigate(`/giao-vien/${item._id}/mon-hoc/${id?.SubjectID}`)}
                      >
                        <Title level={5}>{item.FullName}</Title>
                        <Paragraph>{item.Educations[0]?.Title}</Paragraph>
                        <Avatar icon={<UserOutlined />} />
                        <Text>{item.author}</Text>
                        <Text>{item.authorTitle}</Text>
                      </StyledCard>
                    </Col>
                  ))}
                </Row>
              </>
              :
              <h2 className='center-text'>Hiện tại chưa có giáo viên nào cho môn học này!</h2>
            }

            {listMentor.length > 6 &&
              <div className="mt-20 center-text">
                <Button type="primary" >Xem thêm Giảng Viên </Button>
              </div>
            }
          </Col>
        </Row>
      </MentorForSubjectContainer >
    </SpinCustom >
  )
}

export default MentorForSubject