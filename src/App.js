import React, { useEffect, useRef, useState } from "react";
import {
  Flex,
  Spinner,
  Image,
  Heading,
  Stack,
  useColorMode,
  useTheme,
  useBreakpointValue,
  Text,
  Link,
} from "@chakra-ui/react";
import ThemeToggle from "./components/toggleTheme";
import Masonry from "react-masonry-css";
import Post from "./components/Post";

const mediaTypes = ["image", "hosted:video", "rich:video"];

const App = () => {
  const { colorMode } = useColorMode();
  const theme = useTheme();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const after = useRef();
  const [count, setCount] = useState(0);
  const numberOfColumns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });
  const alreadyAtBottom = useRef(false);

  useEffect(() => {
    document.body.style.backgroundColor =
      colorMode === "light"
        ? theme.colors.white["500"]
        : theme.colors.black["500"];
  }, [colorMode]);

  let getTopPosts = () => {
    if (!isRefreshing) {
      setIsRefreshing(true);
      fetch(
        `https://www.reddit.com/r/aww/top.json?limit=20&t=hour&after=${after.current}&count=${count}`
      )
        .then((res) => res.json())
        .then((res) => {
          after.current = res.data.after;
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
          setIsRefreshing(false);
          setIsLoading(false);
          alreadyAtBottom.current = false;
        });
    }
  };

  useEffect(getTopPosts, []);

  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight - e.target.scrollTop <= e.target.clientHeight + 500;
    if (bottom && !alreadyAtBottom.current) {
      alreadyAtBottom.current = true;
      getTopPosts();
    }
  };

  return isLoading ? (
    <Flex
      width={"100%"}
      height={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Spinner boxSize={"75px"} />
    </Flex>
  ) : (
    <Flex
      width={"100%"}
      height={"100%"}
      overflowY={"auto"}
      direction={"column"}
      onScroll={handleScroll}
    >
      <Stack
        as={Flex}
        direction={"row"}
        width={"100%"}
        alignItems={"center"}
        paddingX={"30px"}
        paddingY={"15px"}
      >
        <Image
          alt={"Animal Therapy"}
          src={"/android-chrome-192x192.png"}
          boxSize={"32px"}
        />
        <Heading>Animal Therapy</Heading>
      </Stack>
      <Masonry
        breakpointCols={numberOfColumns}
        className={"post-grid"}
        columnClassName="my-masonry-grid_column"
      >
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </Masonry>
      {isRefreshing ? (
        <Flex
          width={"100%"}
          paddingY={"30px"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Spinner boxSize={"50px"} />
        </Flex>
      ) : null}
      <Stack
        as={Flex}
        direction={"row"}
        width={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
        paddingX={"30px"}
        paddingY={"15px"}
      >
        <Text>
          Made by{" "}
          <Link href={"https://iamnoah.dev"} isExternal>
            Noah Richardson
          </Link>{" "}
          with ❤️ for Dani
        </Text>
      </Stack>
      <ThemeToggle />
    </Flex>
  );
};

export default App;
