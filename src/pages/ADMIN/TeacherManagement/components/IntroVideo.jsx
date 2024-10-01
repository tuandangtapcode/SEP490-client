import { Col, Empty, Row } from "antd"
import { useState } from "react"
import VideoItem from "src/pages/ANONYMOUS/TeacherDetail/components/VideoItem"
// import PreviewVideo from "src/pages/USER/UserProfile/TeacherProfile/modal/PreviewVideo"

const IntroVideo = ({ user }) => {

  const [openPreviewVideo, setOpenPreviewVideo] = useState()

  return (
    <Row className="p-12">
      <Col span={24}>Video intro của {user?.FullName}</Col>
      {
        !!user?.IntroVideos?.length ?
          user?.IntroVideos?.map((i, idx) =>
            <Col
              key={idx} span={8}
              onClick={() => setOpenPreviewVideo(i)}
            >
              <VideoItem videoUrl={i} />
            </Col>
          )
          : <Empty description="Giáo viên không có video giới thiệu" />
      }

      {/* {
        !!openPreviewVideo &&
        <PreviewVideo
          open={openPreviewVideo}
          onCancel={() => setOpenPreviewVideo(false)}
        />
      } */}
    </Row>
  )
}

export default IntroVideo