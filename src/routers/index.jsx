const USER = "/user"

const Router = {
  // GUEST
  TRANG_CHU: "/",
  BLOG: "/bai-dang",
  CACH_HOAT_DONG: "/cach-hoat-dong",
  DANG_NHAP: "/dang-nhap",
  DANG_KY: "/dang-ky",
  CHU_DE: "/chu-de",
  MON_HOC: "/mon-hoc",
  GIAO_VIEN: "/giao-vien",
  DANH_MUC: "/danh-muc",
  TIM_KIEM_MON_HOC: "/tim-kiem-mon-hoc",
  TIM_KIEM_GIAO_VIEN: "/tim-kiem-giao-vien",
  MEETING_ROOM: `/meeting-room/:RoomID`,
  FORGOT_PASSWORD: "/quen-mat-khau",

  // USER
  PROFILE: `${USER}/profile`,
  DANG_BAI_VIET: `${USER}/dang-bai-viet`,
  SUBJECT_SETTING: `${USER}/cai-dat-mon-hoc`,
  LICH_HOC: `${USER}/lich-hoc`,
  CAI_DAT_MAT_KHAU: `${USER}/cai-dat-mat-khau`,
  DANH_SACH_MON_DA_HOC: `${USER}/danh-sach-mon-da-hoc`,
  KHOA_HOC: `${USER}/khoa-hoc`,
  LICH_SU_BOOKING: `${USER}/lich-su-booking`,
  HOP_THU_DEN: `${USER}/hop-thu-den`,
  LICH_SU_GIAO_DICH: `${USER}/lich-su-giao-dich`,
  CAI_DAT_TAI_KHOAN_NH: `${USER}/cai-dat-tai-khoan-ngan-hang`,
  CHECKOUT: `${USER}/checkout`,
  BAI_DANG_DA_DANG_KY: `${USER}/bai-dang-da-dang-ky`,

  // ADMIN
  QUAN_LY_THONG_KE: "/dashboard",
  QUAN_LY_STAFF: "/dashboard/staff",
  QUAN_LY_GIAO_VIEN: "/dashboard/teacher",
  QUAN_LY_SUBJECT_SETTING: "/dashboard/subject-setting",
  QUAN_LY_HOC_SINH: "/dashboard/student",
  QUAN_LY_BAI_DANG: "/dashboard/blog",
  QUAN_LY_MON_HOC: "/dashboard/subject-cate",
  QUAN_LY_GIAO_DICH: "/dashboard/payment",
  QUAN_LY_TIEN_LUONG: "/dashboard/salary",
  QUAN_LY_REPORT: "/dashboard/report",
  QUAN_LY_FEEDBACK: "/dashboard/feedback",
  QUAN_LY_HOP_THU_DEN: "/dashboard/inbox",
}

export default Router
