import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useRoutes } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import SpinCustom from './components/SpinCustom'
import FindTeacher from './pages/ANONYMOUS/FindTeacher'
import globalSlice from './redux/globalSlice'
import Router from './routers'
import CommonService from './services/CommonService'
import UserService from './services/UserService'
import socket from './utils/socket'
import InactiveModal from './components/Layout/components/ModalInactiveAccount'
import { decodeData } from './lib/commonFunction'
import { globalSelector } from './redux/selector'

// ADMIN
const AdminRoutes = React.lazy(() => import("src/pages/ADMIN/AdminRoutes"))
const StatisticManagement = React.lazy(() => import("src/pages/ADMIN/StatisticManagement"))
const StaffManagement = React.lazy(() => import("src/pages/ADMIN/StaffManagement"))
const StudentManagement = React.lazy(() => import("src/pages/ADMIN/StudentManagement"))
const TeacherManagement = React.lazy(() => import("src/pages/ADMIN/TeacherManagement"))
const IssueManagement = React.lazy(() => import("src/pages/ADMIN/IssueManagement"))
const PaymentManagement = React.lazy(() => import("src/pages/ADMIN/PaymentManagement"))
const SubjectCateManagement = React.lazy(() => import("src/pages/ADMIN/SubjectCateManagement"))
const InboxManagement = React.lazy(() => import("src/pages/ADMIN/InboxManagement"))
const PaymentTransfer = React.lazy(() => import("src/pages/ADMIN/PaymentTransfer"))

// ANONYMOUS
const AnonymousRoutes = React.lazy(() => import("src/pages/ANONYMOUS/AnonymousRoutes"))
const HomePage = React.lazy(() => import("src/pages/ANONYMOUS/HomePage"))
const LoginPage = React.lazy(() => import("src/pages/ANONYMOUS/LoginPage"))
const SignupPage = React.lazy(() => import("src/pages/ANONYMOUS/SignupPage"))
const BlogPage = React.lazy(() => import("src/pages/ANONYMOUS/BlogPage"))
const BlogDetail = React.lazy(() => import("src/pages/ANONYMOUS/BlogDetail"))
const HowWordPage = React.lazy(() => import("src/pages/ANONYMOUS/HowWorkPage"))
const TeachWithUsPage = React.lazy(() => import("src/pages/ANONYMOUS/TeachWithUsPage"))
const TeacherDetail = React.lazy(() => import("src/pages/ANONYMOUS/TeacherDetail"))
const MentorForSubject = React.lazy(() => import("src/pages/ANONYMOUS/MentorForSubject"))
const BookingPage = React.lazy(() => import("src/pages/ANONYMOUS/BookingPage"))
const FindSubject = React.lazy(() => import("src/pages/ANONYMOUS/FindSubject"))
const MeetingRoom = React.lazy(() => import("src/pages/ANONYMOUS/MeetingRoom"))

// USER
// const CreateBlog = React.lazy(() => import("src/pages/ANONYMOUS/MeetingRoom"))
const UserRoutes = React.lazy(() => import("src/pages/USER/UserRoutes"))
const UserProfile = React.lazy(() => import("src/pages/USER/UserProfile"))
const SubjectSetting = React.lazy(() => import("src/pages/USER/SubjectSetting"))
const InboxPage = React.lazy(() => import("src/pages/USER/InboxPage"))
const BillingPage = React.lazy(() => import("src/pages/USER/BillingPage"))
const JournalPage = React.lazy(() => import("src/pages/USER/JournalPage"))
const SchedulePage = React.lazy(() => import("src/pages/USER/SchedulePage"))
const BlogPosting = React.lazy(() => import("src/pages/USER/BlogPosting"))
const AccountUser = React.lazy(() => import("src/pages/USER/AccountUser"))
const StudiedSubject = React.lazy(() => import("src/pages/USER/StudiedSubject"))
const BankInfor = React.lazy(() => import("src/pages/USER/BankInfor"))

// ERROR
const NotFoundPage = React.lazy(() => import("src/pages/ErrorPage/NotFoundPage"))
const ForbiddenPage = React.lazy(() => import("src/pages/ErrorPage/ForbiddenPage"))


const LazyLoadingComponent = ({ children }) => {
  return (
    <React.Suspense
      fallback={
        <div className="loading-center" style={{ display: 'flex', justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
          <SpinCustom />
        </div>
      }
    >
      {children}
    </React.Suspense>
  )
}


const App = () => {

  const [tokenInfor, setTotenInfor] = useState()

  const routes = [
    // ADMIN
    {
      element: (
        <LazyLoadingComponent>
          <AdminRoutes tokenInfor={tokenInfor} />
        </LazyLoadingComponent>
      ),
      children: [
        {
          path: Router.QUAN_LY_THONG_KE,
          element: (
            <LazyLoadingComponent>
              <StatisticManagement />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.QUAN_LY_STAFF,
          element: (
            <LazyLoadingComponent>
              <StaffManagement />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.QUAN_LY_GIAO_VIEN,
          element: (
            <LazyLoadingComponent>
              <TeacherManagement />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.QUAN_LY_HOC_SINH,
          element: (
            <LazyLoadingComponent>
              <StudentManagement />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.QUAN_LY_ISSUE,
          element: (
            <LazyLoadingComponent>
              <IssueManagement />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.QUAN_LY_GIAO_DICH,
          element: (
            <LazyLoadingComponent>
              <PaymentManagement />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.QUAN_LY_MON_HOC,
          element: (
            <LazyLoadingComponent>
              <SubjectCateManagement />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.QUAN_LY_HOP_THU_DEN,
          element: (
            <LazyLoadingComponent>
              <InboxManagement />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.QUAN_LY_CHUYEN_KHOAN,
          element: (
            <LazyLoadingComponent>
              <PaymentTransfer />
            </LazyLoadingComponent>
          )
        },
      ]
    },
    // USER
    {
      element: (
        <LazyLoadingComponent>
          <UserRoutes tokenInfor={tokenInfor} />
        </LazyLoadingComponent>
      ),
      children: [
        {
          path: Router.PROFILE,
          element: (
            <LazyLoadingComponent>
              <UserProfile />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.SUBJECT_SETTING,
          element: (
            <LazyLoadingComponent>
              <SubjectSetting />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.HOP_THU_DEN,
          element: (
            <LazyLoadingComponent>
              <InboxPage />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.LICH_SU_GIAO_DICH,
          element: (
            <LazyLoadingComponent>
              <BillingPage />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.TAP_CHI,
          element: (
            <LazyLoadingComponent>
              <JournalPage />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.LICH_HOC,
          element: (
            <LazyLoadingComponent>
              <SchedulePage />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.DANG_BAI_VIET,
          element: (
            <LazyLoadingComponent>
              <BlogPosting />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.CAI_DAT_MAT_KHAU,
          element: (
            <LazyLoadingComponent>
              <AccountUser />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.DANH_SACH_MON_DA_HOC,
          element: (
            <LazyLoadingComponent>
              <StudiedSubject />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.CAI_DAT_TAI_KHOAN_NH,
          element: (
            <LazyLoadingComponent>
              <BankInfor />
            </LazyLoadingComponent>
          )
        },
      ]
    },
    // ANONYMOUS
    {
      element: (
        <LazyLoadingComponent>
          <AnonymousRoutes />
        </LazyLoadingComponent>
      ),
      children: [
        {
          path: Router.TRANG_CHU,
          element: (
            <LazyLoadingComponent>
              <HomePage />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.DANG_KY,
          element: (
            <LazyLoadingComponent>
              <SignupPage />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.DANG_NHAP,
          element: (
            <LazyLoadingComponent>
              <LoginPage />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.BLOG,
          element: (
            <LazyLoadingComponent>
              <BlogPage />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.BLOG_DETAIL,
          element: (
            <LazyLoadingComponent>
              <BlogDetail />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.CACH_HOAT_DONG,
          element: (
            <LazyLoadingComponent>
              <HowWordPage />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.POST_BAI_TIM_GIAO_VIEN,
          element: (
            <LazyLoadingComponent>
              <TeachWithUsPage />
            </LazyLoadingComponent>
          )
        },
        {
          path: `${Router.DANH_MUC}/:SubjectCateID`,
          element: (
            <LazyLoadingComponent>
              <FindTeacher />
            </LazyLoadingComponent>
          )
        },
        {
          path: `${Router.GIAO_VIEN}/:TeacherID${Router.MON_HOC}/:SubjectID`,
          element: (
            <LazyLoadingComponent>
              <TeacherDetail />
            </LazyLoadingComponent>
          )
        },
        {
          path: `${Router.GIAO_VIEN}/:TeacherID${Router.MON_HOC}/:SubjectID/booking`,
          element: (
            <LazyLoadingComponent>
              <BookingPage />
            </LazyLoadingComponent>
          )
        },
        {
          path: `${Router.TIM_KIEM_GIAO_VIEN}/:SubjectID`,
          element: (
            <LazyLoadingComponent>
              <MentorForSubject />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.TIM_KIEM_MON_HOC,
          element: (
            <LazyLoadingComponent>
              <FindSubject />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.MEETING_ROOM,
          element: (
            <LazyLoadingComponent>
              <MeetingRoom />
            </LazyLoadingComponent>
          )
        },
      ]
    },
    {
      path: "/forbidden",
      elements: (
        <LazyLoadingComponent>
          <ForbiddenPage />
        </LazyLoadingComponent>
      )
    },
    {
      path: "*",
      element: (
        <LazyLoadingComponent>
          <NotFoundPage />
        </LazyLoadingComponent>
      )
    }
  ]

  const appRoutes = useRoutes(routes)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [modalInactiveAccount, setModalInactiveAccount] = useState(false)
  const { isLogin } = useSelector(globalSelector)

  const getListSystemkey = async () => {
    const res = await CommonService.getListSystemkey()
    if (!!res?.isError) return toast.error(res?.msg)
    dispatch(globalSlice.actions.setListSystemKey(res?.data))
  }

  const getProfitPercent = async () => {
    const res = await CommonService.getProfitPercent()
    if (!!res?.isError) return toast.error(res?.msg)
    dispatch(globalSlice.actions.setProfitPercent(res?.data?.Percent))
  }

  const checkAuth = async () => {
    const res = await UserService.checkAuth()
    if (!!res?.isError) return
    if (!!res?.data) {
      const tokenInfor = decodeData(res?.data)
      console.log("tokenInfor", tokenInfor);
      if (!!tokenInfor.ID) {
        setTotenInfor(tokenInfor)
        getDetailProfile()
      } else {
        navigate('/forbidden')
      }
    }
  }

  const getDetailProfile = async () => {
    const res = await UserService.getDetailProfile()
    if (!!res?.isError) return toast.error(res?.msg)
    socket.connect()
    socket.emit("add-user-online", res?.data?._id)
    dispatch(globalSlice.actions.setUser(res?.data))
  }

  useEffect(() => {
    getListSystemkey()
    getProfitPercent()
  }, [])

  useEffect(() => {
    checkAuth()
  }, [isLogin])

  useEffect(() => {
    socket.on('listen-inactive-account', (data) => {
      setModalInactiveAccount(data)
    })
  }, [])

  return (
    <div className="App">
      <ToastContainer
        autoClose={1500}
        hideProgressBar={true}
      />
      <div>{appRoutes}</div>

      {
        !!modalInactiveAccount &&
        <InactiveModal
          open={modalInactiveAccount}
          onCancel={() => setModalInactiveAccount(false)}
        />
      }
    </div>
  )
}

export default App
