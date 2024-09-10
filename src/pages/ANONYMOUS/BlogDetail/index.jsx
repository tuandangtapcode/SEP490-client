import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { toast } from "react-toastify"
import BlogService from "src/services/BlogService"

const BlogDetail = () => {
  const id = useParams()
  const [loading, setLoading] = useState(false)
  const [detailBlog, setDetailBlog] = useState({})

  const getDetailBlog = async () => {
    try {
      setLoading(true)
      const res = await BlogService.getDetailBlog(id?.BlogID)
      if (res?.isError) return toast.error(res?.msg)
      setDetailBlog(res?.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getDetailBlog()
  }, [])


  return (
    <>
      <h1 className="center-text mt-20">{detailBlog?.Title}</h1>
      <img
        src={detailBlog?.AvatarPath}
        alt=""
        className="mt-20"
        style={{
          width: '100%',
          height: '500px',
          objectFit: 'cover'
        }}
      />
      <p className="mt-20">{detailBlog?.Description}</p>
      <div className="mt-20" dangerouslySetInnerHTML={{ __html: detailBlog?.Content }} />
    </>
  );
}

export default BlogDetail;