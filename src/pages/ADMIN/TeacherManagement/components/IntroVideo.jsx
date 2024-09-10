const IntroVideo = ({ user }) => {

  return (
    <div className="p-12">
      <div>Video intro của {user?.FullName}</div>
    </div>
  )
}

export default IntroVideo