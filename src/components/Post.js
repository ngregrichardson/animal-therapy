import React, { useEffect, useRef, useState } from "react";
import { Flex, Heading, Image, useTheme } from "@chakra-ui/react";
import { FiPlayCircle } from "react-icons/all";

const Post = ({ post }) => {
  const theme = useTheme();
  const [paused, setPaused] = useState(true);
  const [titleShown, setTitleShown] = useState(true);
  const videoRef = useRef();

  useEffect(() => {
    if (post?.type !== "image" && videoRef?.current?.volume) {
      videoRef.current.volume = 1;
    }
  }, [post?.type, videoRef.current]);

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

  return (
    <Flex position={"relative"} justifyContent={"center"} margin={"15px"}>
      <Flex
        position={"absolute"}
        top={0}
        bottom={0}
        left={0}
        right={0}
        direction={"column"}
        zIndex={1}
      >
        <Flex
          width={"100%"}
          background={
            "linear-gradient(to top, rgba(0, 0, 0, 0), rgba(0, 0, 0, 1))"
          }
          opacity={titleShown ? 1 : 0}
          justifyContent={"center"}
          paddingX={"15px"}
          paddingTop={"10px"}
          onClick={() => setTitleShown((curr) => !curr)}
        >
          <Heading
            textAlign={"center"}
            isTruncated
            noOfLines={4}
            color={"white.500"}
            fontSize={{ base: "xl", sm: "xl", lg: "2xl" }}
          >
            {post?.title}
          </Heading>
        </Flex>
        <Flex
          flex={1}
          width={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          title={
            post?.type !== "image"
              ? paused
                ? "Click to play"
                : "Click to pause"
              : null
          }
          onClick={
            post?.type !== "image"
              ? toggleVideoPaused
              : () => setTitleShown((curr) => !curr)
          }
          cursor={post?.type !== "image" ? "pointer" : "default"}
        >
          {post?.type !== "image" && paused ? (
            <FiPlayCircle size={"30%"} color={theme.colors.white["500"]} />
          ) : null}
        </Flex>
      </Flex>
      {post.type === "image" ? (
        <Image
          src={post.media}
          width={"100%"}
          objectFit={"contain"}
          alt={post.id}
        />
      ) : (
        <video
          ref={videoRef}
          src={post.media}
          style={{ width: "100%", objectFit: "contain" }}
          loop
        />
      )}
    </Flex>
  );
};

export default Post;
