import { HomeContainerStyled } from "./styled"
import { toast } from "react-toastify"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import SubjectService from "src/services/SubjectService"
import Search from "./components/Search/Search"

const HomePage = () => {

  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [subjects, setSubjects] = useState([])

  const getListSubject = async () => {
    try {
      setLoading(true)
      const res = await SubjectService.getListSubject({
        TextSearch: "",
        CurrentPage: 0,
        PageSize: 0
      })
      if (!!res?.isError) return toast.error(res?.msg)
      setSubjects(res?.data?.List)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListSubject()
  }, [])

  return (
    <HomeContainerStyled>
      <Search subjects={subjects} />
    </HomeContainerStyled>
  )
}

export default HomePage