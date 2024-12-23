import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate, useRoutes } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import SpinCustom from './components/SpinCustom'
import globalSlice from './redux/globalSlice'
import Router from './routers'
import CommonService from './services/CommonService'
import UserService from './services/UserService'
import socket from './utils/socket'
import InactiveModal from './components/Layout/components/ModalInactiveAccount'
import { decodeData } from './lib/commonFunction'
import { globalSelector } from './redux/selector'
import ScrollToTop from './components/ScrollToTop'
import ModalChangeProfile from './components/Layout/components/ModalChangeProfile'
import { Roles } from './lib/constant'

// ADMIN
const AdminRoutes = React.lazy(() => import("src/pages/ADMIN/AdminRoutes"))
const StatisticManagement = React.lazy(() => import("src/pages/ADMIN/StatisticManagement"))
const SystemAnalysis = React.lazy(() => import("src/pages/ADMIN/SystemAnalysis"))
const StaffManagement = React.lazy(() => import("src/pages/ADMIN/StaffManagement"))
const StudentManagement = React.lazy(() => import("src/pages/ADMIN/StudentManagement"))
const TeacherManagement = React.lazy(() => import("src/pages/ADMIN/TeacherManagement"))
const PaymentManagement = React.lazy(() => import("src/pages/ADMIN/PaymentManagement"))
const SubjectCateManagement = React.lazy(() => import("src/pages/ADMIN/SubjectCateManagement"))
const InboxManagement = React.lazy(() => import("src/pages/ADMIN/InboxManagement"))
const PaymentTransfer = React.lazy(() => import("src/pages/ADMIN/PaymentTransfer"))
const SubjectSettingManagement = React.lazy(() => import("src/pages/ADMIN/SubjectSettingManagement"))
const BlogManagement = React.lazy(() => import("src/pages/ADMIN/BlogManagement"))
const FeedbackManagement = React.lazy(() => import("src/pages/ADMIN/FeedbackManagement"))

// ANONYMOUS
const AnonymousRoutes = React.lazy(() => import("src/pages/ANONYMOUS/AnonymousRoutes"))
const HomePage = React.lazy(() => import("src/pages/ANONYMOUS/HomePage"))
const LoginPage = React.lazy(() => import("src/pages/ANONYMOUS/LoginPage"))
const SignupPage = React.lazy(() => import("src/pages/ANONYMOUS/SignupPage"))
const BlogPage = React.lazy(() => import("src/pages/ANONYMOUS/BlogPage"))
const HowWordPage = React.lazy(() => import("src/pages/ANONYMOUS/HowWorkPage"))
const TeacherDetail = React.lazy(() => import("src/pages/ANONYMOUS/TeacherDetail"))
const MentorForSubject = React.lazy(() => import("src/pages/ANONYMOUS/MentorForSubject"))
const BookingPage = React.lazy(() => import("src/pages/ANONYMOUS/BookingPage"))
const FindSubject = React.lazy(() => import("src/pages/ANONYMOUS/FindSubject"))
const MeetingRoom = React.lazy(() => import("src/pages/ANONYMOUS/MeetingRoom"))
const SubjectcateDetail = React.lazy(() => import("src/pages/ANONYMOUS/SubjectcateDetail"))
const ForgotPassword = React.lazy(() => import("src/pages/ANONYMOUS/ForgotPassword"))

// USER
const UserRoutes = React.lazy(() => import("src/pages/USER/UserRoutes"))
const BlogPosting = React.lazy(() => import("src/pages/USER/BlogPosting"))
const UserProfile = React.lazy(() => import("src/pages/USER/UserProfile"))
const SubjectSetting = React.lazy(() => import("src/pages/USER/SubjectSetting"))
const InboxPage = React.lazy(() => import("src/pages/USER/InboxPage"))
const BillingPage = React.lazy(() => import("src/pages/USER/BillingPage"))
const SchedulePage = React.lazy(() => import("src/pages/USER/SchedulePage"))
const BookingHistory = React.lazy(() => import("src/pages/USER/BookingHistory"))
const AccountUser = React.lazy(() => import("src/pages/USER/AccountUser"))
const StudiedSubject = React.lazy(() => import("src/pages/USER/StudiedSubject"))
const BankInfor = React.lazy(() => import("src/pages/USER/BankInfor"))
const CheckoutPage = React.lazy(() => import("src/pages/USER/CheckoutPage"))
const MyCourse = React.lazy(() => import("src/pages/USER/MyCourse"))
const BlogApproval = React.lazy(() => import("src/pages/USER/BlogApproval"))

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
  const [loading, setLoading] = useState(false)

  const routes = [
    // ADMIN
    {
      element: (
        <LazyLoadingComponent>
          <AdminRoutes tokenInfor={tokenInfor} loading={loading} />
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
          path: Router.PHAN_TICH_HE_THONG,
          element: (
            <LazyLoadingComponent>
              <SystemAnalysis />
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
          path: Router.QUAN_LY_TIEN_LUONG,
          element: (
            <LazyLoadingComponent>
              <PaymentTransfer />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.QUAN_LY_SUBJECT_SETTING,
          element: (
            <LazyLoadingComponent>
              <SubjectSettingManagement />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.QUAN_LY_BAI_DANG,
          element: (
            <LazyLoadingComponent>
              <BlogManagement />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.QUAN_LY_FEEDBACK,
          element: (
            <LazyLoadingComponent>
              <FeedbackManagement />
            </LazyLoadingComponent>
          )
        },
      ]
    },
    // USER
    {
      element: (
        <LazyLoadingComponent>
          <UserRoutes tokenInfor={tokenInfor} loading={loading} />
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
          path: Router.KHOA_HOC,
          element: (
            <LazyLoadingComponent>
              <MyCourse />
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
          path: Router.LICH_SU_BOOKING,
          element: (
            <LazyLoadingComponent>
              <BookingHistory />
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
        {
          path: `${Router.CHECKOUT}/:Type/:CheckoutID`,
          element: (
            <LazyLoadingComponent>
              <CheckoutPage />
            </LazyLoadingComponent>
          )
        },
        {
          path: Router.BAI_DANG_DA_DANG_KY,
          element: (
            <LazyLoadingComponent>
              <BlogApproval />
            </LazyLoadingComponent>
          )
        }
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
          path: Router.CACH_HOAT_DONG,
          element: (
            <LazyLoadingComponent>
              <HowWordPage />
            </LazyLoadingComponent>
          )
        },
        {
          path: `${Router.DANH_MUC}/:SubjectCateID`,
          element: (
            <LazyLoadingComponent>
              <SubjectcateDetail />
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
        {
          path: Router.FORGOT_PASSWORD,
          element: (
            <LazyLoadingComponent>
              <ForgotPassword />
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
        }
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
  const [openModalChangeProfile, setOpenModalChangeProfile] = useState(false)
  const { isCheckAuth, user, routerBeforeLogin } = useSelector(globalSelector)
  const location = useLocation()

  const handleNavigate = (tokenInfor) => {
    if (!!routerBeforeLogin) {
      dispatch(globalSlice.actions.setRouterBeforeLogin(""))
      navigate(routerBeforeLogin)
    } else {
      if (tokenInfor.RoleID === Roles.ROLE_ADMIN) {
        navigate("/dashboard")
      } else if (tokenInfor.RoleID === Roles.ROLE_STAFF) {
        navigate(Router.QUAN_LY_GIAO_VIEN)
      } else {
        navigate('/')
      }
    }
  }

  const getListSystemkey = async () => {
    try {
      setLoading(true)
      const res = await CommonService.getListSystemkey()
      if (!!res?.isError) return toast.error(res?.msg)
      dispatch(globalSlice.actions.setListSystemKey(res?.data))
    } finally {
      setLoading(false)
    }
  }

  const getProfitPercent = async () => {
    try {
      setLoading(true)
      const res = await CommonService.getProfitPercent()
      if (!!res?.isError) return toast.error(res?.msg)
      dispatch(globalSlice.actions.setProfitPercent(res?.data?.Percent))
    } finally {
      setLoading(false)
    }
  }

  const checkAuth = async () => {
    try {
      setLoading(true)
      const res = await UserService.checkAuth()
      if (!!res?.isError) return
      if (!!res?.data) {
        const tokenInfor = decodeData(res?.data)
        if (!!tokenInfor.ID) {
          setTotenInfor(tokenInfor)
          dispatch(globalSlice.actions.setIsLogin(true))
          getDetailProfile()
        } else {
          navigate('/forbidden')
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const getDetailProfile = async () => {
    try {
      setLoading(true)
      const res = await UserService.getDetailProfile()
      if (!!res?.isError) return toast.error(res?.msg)
      const resTabs = await CommonService.getListTabs({
        IsByGoogle: res?.data?.IsByGoogle
      })
      if (!!resTabs?.isError) return
      socket.connect()
      socket.emit("add-user-online", res?.data?._id)
      dispatch(globalSlice.actions.setUser(res?.data))
      dispatch(globalSlice.actions.setListTabs(resTabs?.data))
      if (location.pathname === Router.DANG_NHAP) {
        handleNavigate(res?.data)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListSystemkey()
    getProfitPercent()
  }, [])

  useEffect(() => {
    checkAuth()
  }, [isCheckAuth])

  useEffect(() => {
    socket.on('listen-inactive-account', (data) => {
      setModalInactiveAccount(data)
    })
  }, [])

  useEffect(() => {
    if (!!user?.IsFirstLogin) {
      setOpenModalChangeProfile(user)
    }
  }, [user])

  return (
    <div className="App">
      <ScrollToTop />
      {/* <SpinCustom spinning={loading} fullscreen /> */}
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

      {
        !!openModalChangeProfile &&
        <ModalChangeProfile
          open={openModalChangeProfile}
          onCancel={() => setOpenModalChangeProfile(false)}
        />
      }

    </div>
  )
}

export default App
