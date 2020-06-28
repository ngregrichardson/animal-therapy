import React, { useRef, useState } from "react";

function Post({ post }) {
  const [paused, setPaused] = useState(true);
  const [titleShown, setTitleShown] = useState(true);
  const videoRef = useRef();

  let toggleVideoPaused = () => {
    let video = videoRef.current;
    if (video.paused) {
      video.play.call(video);
      setPaused(false);
    } else {
      video.pause.call(video);
      setPaused(true);
    }
  };

  let toggleTitleShown = () => {
    setTitleShown((shown) => !shown);
  };

  return (
    <div className={"postContainer"}>
      <div
        className={"titleContainer"}
        onClick={toggleTitleShown}
        title={titleShown ? "Click to hide title" : "Click to show title"}
      >
        <span
          className={"title"}
          style={{
            fontSize: post.title.length > 75 ? 25 : 35,
            opacity: titleShown ? 1 : 0,
          }}
        >
          {post.title}
        </span>
      </div>
      {post.type === "image" ? (
        <img src={post.media} className={"postContent"} alt={post.id} />
      ) : (
        <video ref={videoRef} src={post.media} className={"postContent"} />
      )}
      {post.type !== "image" ? (
        <div
          className={"videoControlsContainer"}
          title={paused ? "Click to play" : "Click to pause"}
          onClick={toggleVideoPaused}
        >
          {paused && (
            <img src={"/play.png"} alt={"play"} className={"playIcon"} />
          )}
        </div>
      ) : null}
    </div>
  );
}

export default Post;
