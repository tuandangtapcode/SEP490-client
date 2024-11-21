import { Col, DatePicker, Row, Space, Tooltip } from "antd"
import ModalCustom from "src/components/ModalCustom"
import { disabledBeforeDate } from "src/lib/dateUtils"
import dayjs from "dayjs"
import { TimeItemStyled } from "../styled"
import ButtonCustom from "src/components/MyButton/ButtonCustom"

const ModalChangeSchedule = ({
  open,
  onCancel,
  selectedTimes,
  timeTablesStudent,
  getFreeTimeOfTeacher,
  setSelectedTimes
}) => {


  return (
    <ModalCustom
      open={open}
      onCancel={onCancel}
      title="Thay đổi lịch học"
      width="60vw"
      footer={
        <Space className="d-flex-end">
          <ButtonCustom
            className="primary"
            onClick={() => onCancel()}
          >
            Xác nhận
          </ButtonCustom>
        </Space>
      }
    >
      {
        selectedTimes?.map((i, idx) =>
          <Row key={idx} className="mb-20" gutter={[16, 0]}>
            <Col span={12}>
              <DatePicker
                placeholder="Bạn muốn bắt đầu học vào thời điểm nào?"
                format="DD/MM/YYYY"
                style={{
                  width: "100%",
                }}
                value={i?.DateAt}
                disabledDate={current => disabledBeforeDate(current)}
                onChange={e => {
                  const copySelectTimes = [...selectedTimes]
                  copySelectTimes.splice(idx, 1, {
                    ...i,
                    DateAt: dayjs(e),
                    Times: getFreeTimeOfTeacher(e)
                  })
                  setSelectedTimes(copySelectTimes)
                }}
              />
            </Col>
            <Col span={12}>
              <Row gutter={[16, 8]}>
                {
                  i?.Times?.map((timeItem, timeIdx) =>
                    !!timeTablesStudent?.some(time =>
                      dayjs(time?.StartTime).format("DD/MM/YYYY HH:mm") ===
                      dayjs(timeItem?.StartTime).format("DD/MM/YYYY HH:mm"))
                      ?
                      <Col key={timeIdx} span={12}>
                        <Tooltip title="Bạn đã có lịch học vào khung giờ này">
                          <TimeItemStyled
                            className={
                              !!selectedTimes?.some(item =>
                                dayjs(item?.StartTime).format("DD/MM/YYYY HH:mm") ===
                                dayjs(timeItem?.StartTime).format("DD/MM/YYYY HH:mm"))
                                ? "active"
                                : !!timeTablesStudent?.some(time =>
                                  dayjs(time?.StartTime).format("DD/MM/YYYY HH:mm") ===
                                  dayjs(timeItem?.StartTime).format("DD/MM/YYYY HH:mm"))
                                  ? "disabled"
                                  : ""
                            }
                          >
                            {dayjs(timeItem?.StartTime).format("HH:mm")} - {dayjs(timeItem?.EndTime).format("HH:mm")}
                          </TimeItemStyled>
                        </Tooltip>
                      </Col>
                      :
                      <Col key={timeIdx} span={12}>
                        <TimeItemStyled
                          className={
                            !!selectedTimes?.some(item =>
                              dayjs(item?.StartTime).format("DD/MM/YYYY HH:mm") ===
                              dayjs(timeItem?.StartTime).format("DD/MM/YYYY HH:mm"))
                              ? "active"
                              : !!timeTablesStudent?.some(time =>
                                dayjs(time?.StartTime).format("DD/MM/YYYY HH:mm") ===
                                dayjs(timeItem?.StartTime).format("DD/MM/YYYY HH:mm"))
                                ? "disabled"
                                : ""
                          }
                          onClick={() => {
                            const copySelectTimes = [...selectedTimes]
                            copySelectTimes.splice(idx, 1, {
                              ...i,
                              StartTime: timeItem?.StartTime,
                              EndTime: timeItem?.EndTime
                            })
                            setSelectedTimes(copySelectTimes)
                          }}
                        >
                          {dayjs(timeItem?.StartTime).format("HH:mm")} - {dayjs(timeItem?.EndTime).format("HH:mm")}
                        </TimeItemStyled>
                      </Col>
                  )}
              </Row>
            </Col>
          </Row>
        )
      }
    </ModalCustom>
  )
}

export default ModalChangeSchedule