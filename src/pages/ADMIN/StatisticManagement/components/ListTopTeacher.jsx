import { Rate } from "antd"
import { MainProfileWrapper } from "src/pages/ANONYMOUS/TeacherDetail/styled"

const ListTopTeacher = ({ topTeachers }) => {


  return (
    <div>
      <div className="fs-20 fw-700 mb-12">Top giáo viên</div>
      {
        topTeachers?.map((i, idx) =>
          <MainProfileWrapper key={idx}>
            <div className="d-flex align-items-center">
              <div className="mr-6">
                <img
                  src={i?.AvatarPath}
                  style={{
                    width: "45px",
                    height: "50px",
                    borderRadius: "50%"
                  }}
                />
              </div>
              <div>
                <div className="fs-14 mb-5">{i?.FullName}</div>
                <div className="d-flex align-items-center mb-5">
                  <Rate
                    allowHalf
                    disabled
                    value={!!i?.TotalVotes ? i?.TotalVotes / i?.Votes?.length : 0}
                    style={{
                      fontSize: "12px",
                      marginRight: "3px"
                    }}
                  />
                  <p>({i?.Votes?.length} đánh giá)</p>
                </div>
                <div>{i?.TotalBook} lượt book</div>
              </div>
            </div>
          </MainProfileWrapper>
        )
      }
    </div>
  )
}

export default ListTopTeacher