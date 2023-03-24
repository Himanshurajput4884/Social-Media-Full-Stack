import React, { useEffect, useState } from "react";
import { styled, Box, Typography } from "@mui/material";

const Container = styled(Box)`
  width: 320;
  height: 60%;
  border: 1px solid #d3cede;
  border-radius: 10px;
  margin: 10px;
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 400px;
  & > img,
  & > p {
    padding: 0 5px 5px 5px;
  }
`;

const Image = styled("img")({
  width: 300,
  objectFit: "cover",
  borderRadius: "10px 10px 0 0",
  height: 300,
});

const Text = styled(Typography)`
    color: #878787
    font-size: 12px;
`;

const Heading = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
`;

const Details = styled(Typography)`
  font-size: 14px;
  word-break: break-word;
`;

const Post = ({ post }) => {
  // console.log(post);
  // console.log("Here is the post");
  const url = post.imageUrl
    ? post.imageUrl
    : "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=752&q=80";

  

  const addEllipsis = (str, limit) => {
    return str.length > limit ? str.substring(0, limit) + "..." : str;
  };
  
  return (
    <Container>
      <Image src={url} alt="post" />
      <Heading>{addEllipsis(post.title, 20)}</Heading>
      {/* <Heading>{post.title}</Heading> */}
      <Text>Post by: {post.username}</Text>
    </Container>
  );
};

export default Post;
