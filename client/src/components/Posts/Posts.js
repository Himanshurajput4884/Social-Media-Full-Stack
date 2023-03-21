import React, { useState, useEffect } from 'react'
import { Grid, Box } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import Post from './Post';

function Posts() {
    const [ posts, setPost ] = useState([]);

    let token = localStorage.getItem("usersdatatoken");

    useEffect(()=>{
        const fetchData = async() =>{
            let url = 'http://localhost:8009/posts';
            fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                },
            })
            .then((res) =>res.json())
            .then(data=>{
                console.log(data);
                setPost(data);
            })
            .catch((err)=>{
                console.log(err);
            })
        }
        fetchData();
    }, [])


  return (
    <>
    {
        posts?.length ? posts.map(post => (
            <Grid item lg={3} sm={4} xs={12}>
                <Link style={{textDecoration: 'none', color: 'inherit'}} to={`/getPost/${post._id}`}>
                    <Post post={post} />
                </Link>
            </Grid>
        )) : <Box style={{color: '878787', margin: '30px 80px', fontSize: 18}}>
                No data is available for selected category
            </Box>
    }
</>
  )
}

export default Posts
