import React, { useEffect, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import Spinner from "react-spinkit";
import Post from "./components/Post";

const mediaTypes = ["image", "hosted:video", "rich:video"];

function App() {
  const [posts, setPosts] = useState([]);
  const [initialLoad, setInitialLoad] = useState(true);
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
          setCount((c) => c + res.data.dist);
          setPosts((p) => [
            ...p,
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
                  default:
                    return null;
                }
                return {
                  title: post.data.title,
                  url: `https://reddit.com${post.data.permalink}`,
                  id: post.data.id,
                  type,
                  media,
                };
              })
              .filter((post) => post !== null),
          ]);
        })
        .catch((e) => console.log(e))
        .finally(() => {
          setRefreshing(false);
          setInitialLoad(false);
        });
    }
  };

  useEffect(getTopPosts, []);

  if (initialLoad) {
    return (
      <div className={"loadingContainer"}>
        <Spinner name="wave" fadeIn={"none"} />
      </div>
    );
  }

  return (
    <div className={"rootContainer"}>
      <div className={"navbar"}>
        <div className={"brandContainer"}>
          <img src={"/favicon-32x32.png"} alt={"Animal Therapy"} />
          <span className={"brand"}>Animal Therapy</span>
        </div>
        <div className={"navbarRightContainer"}>
          <a
            target={"_blank"}
            href={"https://ngregrichardson.dev/projects"}
            rel="noopener noreferrer"
            className={"navbarRightLink"}
          >
            See my other projects
          </a>
        </div>
      </div>
      <PerfectScrollbar
        onYReachEnd={getTopPosts}
        className={"scrollbarContainer"}
      >
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
        <a
          className="copyright"
          href={"https://github.com/ngregrichardson/AnimalTherapy"}
          target={"_blank"}
          rel="noopener noreferrer"
        >
          &copy; Noah Richardson {new Date().getFullYear()} | Made with{" "}
          <span role={"img"}>❤</span>️ for Dani
        </a>
      </PerfectScrollbar>
    </div>
  );
}

export default App;
