import React, { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

const mediaTypes = ["image", "hosted:video", "rich:video"];

function App() {
  const [posts, setPosts] = useState([]);
  const [after, setAfter] = useState("");
  const [count, setCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  let getTopPosts = () => {
    if (!refreshing) {
      setRefreshing(true);
      fetch(
        `https://www.reddit.com/r/aww/top.json?limit=20&t=hour&after=${after}&count=${count}`
      )
        .then((res) => res.json())
        .then((res) => {
          setAfter(res.data.after);
          setCount(count + res.data.dist);
          setPosts([
            ...posts,
            ...res.data.children
              .filter((post) => mediaTypes.includes(post.data.post_hint))
              .map((post) => {
                let media;
                let type;
                switch (post.data.post_hint) {
                  case "image":
                    media = post.data.url;
                    type = "image";
                    break;
                  case "rich:video":
                    if (post.data.media.oembed) {
                      media = post.data.media.oembed.thumbnail_url;
                      type = "image";
                    }
                    break;
                  case "hosted:video":
                    media = post.data.media.reddit_video.fallback_url;
                    type = "video";
                    break;
                }
                return {
                  title: post.data.title,
                  url: `https://reddit.com${post.data.permalink}`,
                  id: post.data.id,
                  type,
                  media,
                };
              }),
          ]);
          setRefreshing(false);
        })
        .catch((e) => {
          console.log(e);
          setRefreshing(false);
        });
    }
  };

  useEffect(() => {
    getTopPosts();
  }, []);

  let _toggleVideoPaused = (videoId) => {
    let video = document.querySelector(`#${videoId}`);
    if (video.paused) {
      video.play.call(video);
      document.querySelector(`#${videoId}_play`).classList.add("paused");
    } else {
      video.pause.call(video);
      document.querySelector(`#${videoId}_play`).classList.remove("paused");
    }
  };

  return (
    <>
      <PerfectScrollbar
        onYReachEnd={getTopPosts}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          flexWrap: "wrap",
          zIndex: 1000,
        }}
      >
        {posts.map((post) => (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 20,
              marginRight: 11,
              position: "relative",
            }}
            key={post.id}
          >
            <div
              style={{
                position: "absolute",
                left: 20,
                right: 20,
                textAlign: "center",
                marginHorizontal: 20,
              }}
              className="title"
            >
              <span>{post.title.length > 75 ? "" : post.title}</span>
            </div>
            {post.type === "image" ? (
              <img src={post.media} style={{ width: "100%" }} alt={post.id} />
            ) : (
              <video src={post.media} style={{ width: "100%" }} id={post.id} />
            )}
            {post.type !== "image" ? (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                title={"Click to play/pause"}
                onClick={() => _toggleVideoPaused(post.id)}
              >
                {document.getElementById(post.id) ? (
                  document.getElementById(post.id).paused ? (
                    <img
                      src={"/play.png"}
                      alt={"play"}
                      className="play"
                      style={{ height: 128, width: 128 }}
                      id={`${post.id}_play`}
                    />
                  ) : null
                ) : null}
              </div>
            ) : null}
          </div>
        ))}
      </PerfectScrollbar>
    </>
  );
}

export default App;
