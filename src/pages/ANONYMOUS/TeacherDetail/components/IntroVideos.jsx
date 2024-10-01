import { Swiper, SwiperSlide } from "swiper/react"
import VideoItem from "./VideoItem"
import { useState } from "react"
// import PreviewVideo from "src/pages/USER/UserProfile/TeacherProfile/modal/PreviewVideo"

const IntroVideos = ({ teacher }) => {

  const [openPreviewVideo, setOpenPreviewVideo] = useState()

  return (
    <>
      <Swiper
        spaceBetween={0}
        slidesPerView={3}
      >
        {
          teacher?.IntroVideos?.map((i, idx) =>
            <SwiperSlide
              key={idx}
              onClick={() => setOpenPreviewVideo(i)}
            >
              <VideoItem videoUrl={i} />
            </SwiperSlide>
          )
        }
      </Swiper>

      {/* {
        !!openPreviewVideo &&
        <PreviewVideo
          open={openPreviewVideo}
          onCancel={() => setOpenPreviewVideo(false)}
        />
      } */}
    </>
  )
}

export default IntroVideos