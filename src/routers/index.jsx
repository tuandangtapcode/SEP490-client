const USER = "/user"

const Router = {
  // GUEST
  TRANG_CHU: "/",
  BLOG: "/blog",
  BLOG_DETAIL: "/blog/:BlogID",
  CACH_HOAT_DONG: "/cach-hoat-dong",
  DAY_VOI_CHUNG_TOI: "/day-voi-chung-toi",
  DANG_NHAP: "/dang-nhap",
  DANG_KY: "/dang-ky",
  CHU_DE: "/chu-de",
  MON_HOC: "/mon-hoc",
  GIAO_VIEN: "/giao-vien",
  DANH_MUC: "/danh-muc",
  TIM_KIEM_MON_HOC: "/tim-kiem-mon-hoc",
  TIM_KIEM_GIAO_VIEN: "/tim-kiem-giao-vien",
  MEETING_ROOM: `/meeting-room/:RoomID`,

  // USER
  PROFILE: `${USER}/profile`,
  HOP_THU_DEN: `${USER}/hop-thu-den`,
  LICH_HOC: `${USER}/lich-hoc`,
  DANG_BAI_VIET: `${USER}/dang-bai-viet`,
  LICH_SU_GIAO_DICH: `${USER}/lich-su-giao-dich`,
  CAI_DAT_MAT_KHAU: `${USER}/cai-dat-mat-khau`,
  DANH_SACH_MON_DA_HOC: `${USER}/danh-sach-mon-da-hoc`,
  CAI_DAT_TAI_KHOAN_NH: `${USER}/cai-dat-tai-khoan-ngan-hang`,

  // ADMIN
  QUAN_LY_THONG_KE: "/dashboard",
  QUAN_LY_STAFF: "/dashboard/staff",
  QUAN_LY_GIAO_VIEN: "/dashboard/teacher",
  QUAN_LY_HOC_SINH: "/dashboard/student",
  QUAN_LY_REPORT: "/dashboard/report",
  QUAN_LY_GIAO_DICH: "/dashboard/payment",
  QUAN_LY_MON_HOC: "/dashboard/subject-cate",
  QUAN_LY_HOP_THU_DEN: "/dashboard/inbox",
  QUAN_LY_CHUYEN_KHOAN: "/dashboard/transfer"
}

export default Router
