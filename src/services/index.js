import axios from 'axios'
import Notice from 'src/components/Notice'

const ReactAppRootAPILocal = import.meta.env.VITE_ROOT_API_LOCAL
const ReactAppRootAPICloud = import.meta.env.VITE_ROOT_API_CLOUD

const parseBody = (response) => {
  const resData = response.data
  return resData
}

const instance = axios.create({
  timeout: 60000
})

instance.interceptors.request.use(
  config => {
    config.baseURL = ReactAppRootAPILocal
    config.withCredentials = true
    return config
  },
  error => Promise.reject(error.message)
)

instance.interceptors.response.use(
  response => parseBody(response),
  error => {
    if (+error?.response?.status >= 500) {
      Notice({
        msg: `Hệ thống đang tạm thời gián đoạn. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ`,
        isSuccess: false,
      })
    } else if (+error?.response?.status == 400) {
      Notice({
        msg: `Hệ thống xảy ra lỗi. Xin vui lòng trở lại sau hoặc thông báo với ban quản trị để được hỗ trợ`,
        isSuccess: false,
      })
    } else if (+error?.response?.status == 401) {
      Notice({
        msg: `Phiên làm việc đã hết hạn. Hãy đăng nhập lại để tiếp tục sử dụng`,
        isSuccess: false,
      })

    } else if (+error?.response?.status == 403) {
      Notice({
        msg: `Bạn không có quyền truy cập`,
        isSuccess: false,
      })
    } else if (error.code === "ERR_NETWORK") {
      Notice({
        msg: `Hệ thống đang bị gián đoạn, vui lòng kiểm tra lại đường truyền!`,
        isSuccess: false,
      })
    }
    return Promise.reject(error)
  }
)

export default instance
