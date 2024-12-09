import { Col, Row, Statistic } from "antd"
import ListIcons from "src/components/ListIcons"
import { StatisticCardWrapper } from "src/pages/ADMIN/StatisticManagement"


const DataTotal = ({ dataTotal }) => {


  return (
    <Row gutter={[16, 0]} style={{ width: "60%" }}>
      <Col span={8}>
        <StatisticCardWrapper>
          <Statistic
            title={<span className="green-text fs-18">Giáo viên</span>}
            value={dataTotal?.totalTeacher}
            prefix={<span className="fs-25">{ListIcons.ICON_TEACHER}</span>}
          />
        </StatisticCardWrapper>
      </Col>
      <Col span={8}>
        <StatisticCardWrapper>
          <Statistic
            title={<span className="green-text fs-18">Môn học</span>}
            value={dataTotal?.totalSubject}
            prefix={<span className="fs-25">{ListIcons.ICON_SUBJECT_CATE}</span>}
          />
        </StatisticCardWrapper>
      </Col>
      <Col span={8}>
        <StatisticCardWrapper>
          <Statistic
            title={<span className="green-text fs-18">Học sinh</span>}
            value={dataTotal?.totalStudent}
            prefix={<span className="fs-25">{ListIcons.ICON_STUDENT}</span>}
          />
        </StatisticCardWrapper>
      </Col>
    </Row>
  )
}

export default DataTotal