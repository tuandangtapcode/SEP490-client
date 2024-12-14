import { io } from "socket.io-client"

const ReactAppRootAPILocal = import.meta.env.VITE_ROOT_API_LOCAL
const ReactAppRootAPICloud = import.meta.env.VITE_ROOT_API_CLOUD

const socket = io(`${ReactAppRootAPILocal}`, {
  autoConnect: false
})

export default socket