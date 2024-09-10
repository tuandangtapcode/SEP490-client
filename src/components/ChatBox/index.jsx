import InfiniteScroll from "react-infinite-scroll-component"
import SpinCustom from "../SpinCustom"
import { useSelector } from "react-redux"
import { globalSelector } from "src/redux/selector"

const ChatBox = ({ messages, total, setPagination }) => {

  const { user } = useSelector(globalSelector)

  return (
    <div
      id="scrollableDiv"
      style={{
        height: "100%",
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column-reverse',
      }}
    >
      <InfiniteScroll
        dataLength={messages.length}
        hasMore={true}
        inverse={true}
        scrollableTarget="scrollableDiv"
        loader={total !== messages?.length ? <SpinCustom /> : <></>}
        next={() => {
          if (total !== messages?.length) {
            setPagination(pre => ({ ...pre, CurrentPage: pre?.CurrentPage + 1 }))
          }
        }}
      >
        {
          messages?.map((i, idx) =>
            <div
              key={idx}
              className={i?.Sender?._id === user?._id ? "d-flex-end mb-12" : "d-flex-start mb-12"}
            >
              {
                i?.Sender?._id === user?._id ?
                  <>
                    <div
                      style={{
                        backgroundColor: "#eaeaea",
                        padding: "8px",
                        borderRadius: "8px",
                        marginRight: "8px"
                      }}
                    >
                      {i?.Content}
                    </div>
                    <img
                      src={i?.Sender?.AvatarPath}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%"
                      }}
                    />
                  </>
                  :
                  <>
                    <img
                      src={i?.Sender?.AvatarPath}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%"
                      }}
                    />
                    <div
                      style={{
                        backgroundColor: "#eaeaea",
                        padding: "8px",
                        borderRadius: "8px",
                        marginLeft: "8px"
                      }}
                    >
                      {i?.Content}
                    </div>
                  </>
              }
            </div>
          )
        }
      </InfiniteScroll>
    </div>
  )
}

export default ChatBox