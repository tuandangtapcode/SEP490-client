import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import TeacherProfile from "./TeacherProfile"
import StudentProfile from "./StudentProfile"
import { Roles } from "src/lib/constant"

const UserProfile = () => {

  const { user } = useSelector(globalSelector)

  return (
    <div>
      {
        user?.RoleID === Roles.ROLE_TEACHER
          ? <TeacherProfile />
          : <StudentProfile />
      }
    </div>
  )
}

export default UserProfile