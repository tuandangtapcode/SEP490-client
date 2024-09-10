const Description = ({ user }) => {

  return (
    <div className="p-12">
      <div className='fw-600 fs-18 mb-12'>Về {user?.FullName}</div>
      <div className="spaced-text">{user?.Description}</div>
    </div>
  )
}

export default Description