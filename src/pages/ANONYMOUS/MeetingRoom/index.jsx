import { Col, Row, Space } from "antd"
import { MeetingRoomContainerStyled } from "./styled"
import ListIcons from "src/components/ListIcons"
import ButtonCircle from "src/components/MyButton/ButtonCircle"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ChatBox from "src/components/ChatBox"
import InputCustom from "src/components/InputCustom"
import { BiSolidSend } from "react-icons/bi"
import Peer from "peerjs"
import ReactPlayer from "react-player"
import socket from "src/utils/socket"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"
import SpinCustom from "src/components/SpinCustom"


const MeetingRoom = () => {

  const { user } = useSelector(globalSelector)
  const { RoomID } = useParams()
  const [content, setContent] = useState("")
  const [messages, setMessages] = useState([])
  const [total, setTotal] = useState(0)
  const [call, setCall] = useState() // tương tự player
  const [player, setPlayer] = useState() // lưu player nhưng dưới dạng object nhiều trường mỗi trường tương đương 1 người dùng thay vì mảng
  const [myID, setMyID] = useState()
  const [peer, setPeer] = useState()
  const [stream, setStream] = useState()
  const [pagination, setPagination] = useState({
    PageSize: 7,
    CurrentPage: 1,
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const initWebRTC = async () => {
    try {
      setLoading(true)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      })
      setStream(stream)
      const peer = new Peer()
      setPeer(peer)
      peer.on("open", id => {
        setMyID(id)
        socket.emit("join-meeting-room", {
          UserID: user?._id,
          FullName: user?.FullName,
          Avatar: user?.AvatarPath,
          RoomID: RoomID,
          PeerID: id,
          IsViewVideo: true,
          Muted: false
        })
      })
    } catch (error) {
      console.log("error", error.toString())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initWebRTC()
  }, [RoomID, user])

  useEffect(() => {
    if (!peer) return
    socket.on("user-connected-meeting-room", data => {
      const call = peer.call(data.PeerID, stream, {
        metadata: {
          UserID: user?._id,
          FullName: user?.FullName,
          Avatar: user?.AvatarPath,
          IsViewVideo: player?.[myID]?.IsViewVideo,
          Muted: player?.[myID]?.Muted
        }
      })
      call.on("stream", peerStream => {
        setPlayer(pre => ({
          ...pre,
          [data.PeerID]: {
            UserID: data?.UserID,
            FullName: data?.FullName,
            Avatar: data?.Avatar,
            stream: peerStream,
            IsViewVideo: data?.IsViewVideo,
            Muted: data?.Muted
          }
        }))
        setCall(pre => ({
          ...pre,
          [data.PeerID]: call
        }))
      })

    })
  }, [peer, myID, stream, player])

  useEffect(() => {
    if (!peer || !stream) return
    peer.on("call", call => {
      const { peer, metadata } = call
      call.answer(stream)
      call.on("stream", peerStream => {
        setPlayer(pre => ({
          ...pre,
          [peer]: {
            UserID: metadata?.UserID,
            FullName: metadata?.FullName,
            Avatar: metadata?.Avatar,
            stream: peerStream,
            IsViewVideo: metadata?.IsViewVideo,
            Muted: metadata?.Muted
          }
        }))
        setCall(pre => ({
          ...pre,
          [peer]: call
        }))
      })
    })
  }, [peer, stream])

  useEffect(() => {
    if (!peer || !myID || !stream) return
    setPlayer(pre => ({
      ...pre,
      [myID]: {
        UserID: user?._id,
        FullName: user?.FullName,
        Avatar: user?.AvatarPath,
        stream: stream,
        IsViewVideo: true,
        Muted: false
      }
    }))
    setCall(pre => ({
      ...pre,
      [myID]: peer
    }))
  }, [myID, stream])

  useEffect(() => {
    socket.on("listen-toggle-handler", data => {
      switch (data.Key) {
        case "video":
          setPlayer({
            ...player,
            [data.PeerID]: {
              ...player?.[data.PeerID],
              IsViewVideo: !player?.[data.PeerID]?.IsViewVideo
            }
          })
          break
        case "muted":
          setPlayer({
            ...player,
            [data.PeerID]: {
              ...player?.[data.PeerID],
              Muted: !player?.[data.PeerID]?.Muted
            }
          })
          break
        default:
          break
      }
    })
  }, [player])

  useEffect(() => {
    socket.on("user-leave-meeting-room", data => {
      const copyPlayer = { ...player }
      delete copyPlayer?.[data]
      setPlayer(copyPlayer)
    })
  }, [call, player])


  const startShareScreen = async () => {
    try {
      setLoading(true)
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true
      })
      const newPeer = new Peer()
      newPeer.on("open", id => {
        socket.emit("join-meeting-room", {
          UserID: user?._id,
          FullName: user?.FullName,
          Avatar: user?.AvatarPath,
          RoomID: RoomID,
          PeerID: id,
          IsViewVideo: true,
          Muted: true
        })
        Object.keys(call).forEach(peerID => {
          const call = newPeer.call(peerID, screenStream, {
            metadata: {
              UserID: user?._id,
              FullName: user?.FullName,
              Avatar: user?.AvatarPath,
              IsViewVideo: true,
              Muted: true
            }
          })
        })
        setPlayer(pre => ({
          ...pre,
          [id]: {
            UserID: user?._id,
            FullName: user?.FullName,
            Avatar: user?.AvatarPath,
            IsViewVideo: true,
            Muted: true,
            stream: screenStream
          }
        }))
      })
    } catch (error) {
      console.log("error", error.toString())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    socket.on("listen-send-message-meeting-room", data => {
      setMessages(pre => [
        ...pre,
        data
      ])
      setTotal(total + 1)
    })
  }, [])


  return (
    <SpinCustom spinning={loading}>
      <MeetingRoomContainerStyled>
        <Row>
          <Col span={18}>
            <Row className="left-screen">
              <Col span={24} className="video-container">
                <Row className="d-flex-center f-wrap" style={{ height: "100%" }} gutter={[16, 16]}>
                  {
                    !!player ?
                      Object.keys(player)?.map(peerID =>
                        <Col
                          span={24 / Object.keys(player)?.length}
                          key={peerID}
                          className="player-wrapper d-flex-center"
                        >
                          <div className="icon-sound ">
                            {
                              !!player?.[peerID]?.Muted
                                ? ListIcons.ICON_MIC_MUTE_BLACK
                                : ListIcons.ICON_MIC_BLACK
                            }
                          </div>
                          <div
                            className="avatar-wrapper d-flex-center"
                            style={{
                              backgroundImage: !player?.[peerID]?.IsViewVideo ? `url(${player?.[peerID]?.Avatar})` : "none",
                              height: !player?.[peerID]?.IsViewVideo ? "300px" : "",
                              width: !player?.[peerID]?.IsViewVideo ? "300px" : "100%",
                              backgroundPosition: "center",
                              borderRadius: "50%",
                              backgroundSize: "cover",
                            }}
                          >
                            <ReactPlayer
                              style={{
                                display: !!player?.[peerID]?.IsViewVideo ? "block" : "none"
                              }}
                              key={peerID}
                              url={player?.[peerID]?.stream}
                              playing={true}
                              muted={player?.[peerID]?.Muted}
                              height="100%"
                              width="100%"
                            />
                          </div>
                        </Col>
                      )
                      : <div className="video-container"></div>
                  }
                </Row>
              </Col>
              <Col span={24} className="control">
                <div className="controller d-flex-center">
                  <Space>
                    <ButtonCircle
                      className="primary"
                      mediumsize
                      icon={
                        !!player && !!myID
                          ? !player?.[myID]?.Muted
                            ? ListIcons.ICON_MIC
                            : ListIcons.ICON_MIC_MUTE
                          : ListIcons.ICON_MIC_MUTE
                      }
                      onClick={() => {
                        socket.emit("toggle-handler", {
                          RoomID,
                          PeerID: myID,
                          Key: "muted"
                        })
                      }}
                    />
                    <ButtonCircle
                      className="primary"
                      mediumsize
                      icon={
                        !!player && !!myID
                          ? !!player?.[myID]?.IsViewVideo
                            ? ListIcons.ICON_CAMERA_VIDEO
                            : ListIcons.ICON_CAMERA_VIDEO_OFF
                          : ListIcons.ICON_CAMERA_VIDEO_OFF
                      }
                      onClick={() => {
                        socket.emit("toggle-handler", {
                          RoomID,
                          PeerID: myID,
                          Key: "video"
                        })
                      }}
                    />
                    <ButtonCircle
                      className="primary"
                      mediumsize
                      icon={ListIcons.ICON_SHARE_SCREEN}
                      onClick={() => startShareScreen()}
                    />
                    <ButtonCircle
                      className="red"
                      mediumsize
                      icon={ListIcons.ICON_TELEPHONE}
                      onClick={() => {
                        socket.emit("leave-meeting-room", {
                          RoomID,
                          PeerID: myID,
                        })
                        call[myID].destroy()
                        navigate("/")
                      }}
                    />
                  </Space>
                </div>
              </Col>
            </Row>
          </Col>
          <Col span={6}>
            <Row className="right-screen">
              <Col span={24} style={{ backgroundColor: "white" }}>
                <div className="header">Trò chuyện</div>
              </Col>
              <Col span={24} style={{ backgroundColor: "white" }}>
                <div>
                  <ChatBox
                    messages={messages}
                    total={total}
                    setPagination={setPagination}
                  />
                </div>
              </Col>
            </Row>
            <div style={{ paddingRight: "16px" }}>
              <div className="input-message">
                <InputCustom
                  placeholder="Nhập vào tin nhắn"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  onPressEnter={() => {
                    if (!!content) {
                      setContent("")
                      socket.emit("send-message-meeting-room", {
                        RoomID: RoomID,
                        Content: content,
                        Sender: {
                          FullName: user?.FullName,
                          AvatarPath: user?.AvatarPath,
                          _id: user?._id
                        }
                      })
                    }
                  }}
                  suffix={
                    <BiSolidSend
                      className="cursor-pointer"
                      onClick={() => {
                        if (!!content) {
                          setContent("")
                          socket.emit("send-message-meeting-room", {
                            RoomID: RoomID,
                            Content: content,
                            Sender: {
                              FullName: user?.FullName,
                              AvatarPath: user?.AvatarPath,
                              _id: user?._id
                            }
                          })
                        }
                      }}
                      color="#106ebe"
                    />
                  }
                />
              </div>
            </div>
          </Col>
        </Row >
      </MeetingRoomContainerStyled>
    </SpinCustom>
  )
}

export default MeetingRoom