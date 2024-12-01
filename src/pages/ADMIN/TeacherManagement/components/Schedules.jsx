import { Empty } from "antd"
import TimeTableComponent from "src/components/TimeTableComponent"
import { convertToCurrentEquivalent } from "src/lib/dateUtils"

const Schedules = ({ user }) => {
  return (
    <div>
      {!!user?.Schedules?.length
        ?
        <TimeTableComponent
          schedules={
            user?.Schedules?.map(i => {
              return {
                start: convertToCurrentEquivalent(new Date(i?.StartTime)),
                end: convertToCurrentEquivalent(new Date(i?.EndTime)),
                title: ""
              }
            })
          }
        />
        : <Empty description={`${user?.FullName} chưa điền thông tin này`} />
      }
    </div>
  )
}

export default Schedules