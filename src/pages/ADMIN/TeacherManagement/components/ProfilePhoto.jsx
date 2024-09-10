const ProfilePhoto = ({ user }) => {

  return (
    <div className="p-12">
      <div className='fw-600 fs-18 mb-12'>Ảnh đại diện của {user?.FullName}</div>
      <div>
        <img style={{ width: "200px", height: "200px" }} src={user?.AvatarPath} alt="" />
      </div>
    </div>
  )
}

export default ProfilePhoto