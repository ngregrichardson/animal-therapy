import React, { useEffect, useRef, useState } from "react";
import { Flex, Heading, Image, useTheme, Spinner } from "@chakra-ui/react";
import { FiPlayCircle } from "react-icons/all";

const Post = ({ post }) => {
  const theme = useTheme();
  const [paused, setPaused] = useState(true);
  const [titleShown, setTitleShown] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const videoRef = useRef();
  const imageRef = useRef();

  useEffect(() => {
    if (isLoading && post?.type === "image" && imageRef.current?.complete) {
      setIsLoading(false);
    }
  }, [post?.type, isLoading]);

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

  return error ? null : (
    <Flex
      position={"relative"}
      justifyContent={"center"}
      margin={"15px"}
      alignItems={"flex-start"}
      minHeight={isLoading ? "200px" : undefined}
    >
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
            noOfLines={3}
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
          {isLoading ? (
            <Spinner boxSize={"25px"} />
          ) : post?.type !== "image" && paused ? (
            <FiPlayCircle size={"30%"} color={theme.colors.white["500"]} />
          ) : null}
        </Flex>
      </Flex>
      {post.type === "image" ? (
        <Image
          ref={imageRef}
          src={post.media}
          width={"100%"}
          objectFit={"contain"}
          alt={post.id}
          onLoad={() => setIsLoading(false)}
          onError={() => setError(true)}
        />
      ) : (
        <video
          ref={videoRef}
          src={post.media}
          style={{ width: "100%", objectFit: "contain" }}
          loop
          onLoadedData={() => setIsLoading(false)}
          onError={() => setError(true)}
        />
      )}
    </Flex>
  );
};

export default Post;
