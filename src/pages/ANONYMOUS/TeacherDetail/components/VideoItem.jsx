import ListIcons from "src/components/ListIcons"
import { CardStyled, VideoItemStyled } from "../styled"
import { ButtonCicleStyled } from "src/components/MyButton/ButtonCircle/styled"

const VideoItem = ({ videoUrl }) => {

  return (
    <VideoItemStyled>
      <CardStyled
        cover={<img style={{ borderRadius: '8px' }} alt="example" src={videoUrl.replace("mp4", "jpg")} />}
      >
        <ButtonCicleStyled
          style={{
            position: 'absolute',
            right: '40%',
            bottom: '50%'
          }}
          className='mediumCircle greendBackgroundColor icon-play'
          icon={ListIcons.ICON_PLAY_FS_30}
        />
      </CardStyled>
    </VideoItemStyled>
  )
}

export default VideoItem