import { useState, useEffect, useContext } from 'react';
import { Box, TextareaAutosize, Button, styled } from '@mui/material';
import { LoginContext } from '../../ContextProvider/Context';

//components
import Comment from './Comment';
// 
const Container = styled(Box)`
    margin-top: 100px;
    display: flex;
`;

const Image = styled('img')({
    width: 50,
    height: 50,
    borderRadius: '50%'
});

const StyledTextArea = styled(TextareaAutosize)`
    height: 100px !important;
    width: 100%; 
    margin: 0 20px;
`;

const initialValue = {
    name: '',
    postId: '',
    date: new Date(),
    comments: ''
}

const Comments = ({ post }) => {
    const url = 'https://static.thenounproject.com/png/12017-200.png'
    const { logindata, setLoginData } = useContext(LoginContext);
    const [comment, setComment] = useState(initialValue);     // used in to add comment
    const [comments, setComments] = useState([]);            // used in to get all comments
    const [toggle, setToggle] = useState(false);
    let token = localStorage.getItem("usersdatatoken");

    const id = post._id;
    useEffect(() => {
        const getData = async () => {
            let urlc = `http://localhost:8009/comment/${id}`;
            await fetch(urlc, {
                method: "GET",
                "Content-Type":"application/json",
                "Authorization": token,
                Accept: "application/json",
            })
            .then((res)=>res.json())
            .then((response)=>{
                console.log(response.data);
                setComments(response.data);
            })
            .catch((err)=>{
                console.log(err);
            })
        }
        getData();
    }, [post, setToggle]);

    const handleChange = (e) => {
        setComment({
            ...comment,
            name: logindata.ValidUserOne.fname,
            postId: post._id,
            comments: e.target.value
        });
    }

    const addComment = async() => {
        const data2 = await fetch("http://localhost:8009/comment/new", {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "Authorization": token,
              Accept: "application/json"
          },
            body: JSON.stringify(comment),
          })
          const response = await data2.json();
          console.log(response);
          if(response.success){
                setComment(initialValue)
          }
        setToggle(prev => !prev);
    }
    
    return (
        <Box>
            <Container>
                <Image src={url} alt="dp" />   
                <StyledTextArea 
                    rowsMin={5} 
                    placeholder="what's on your mind?"
                    onChange={(e) => handleChange(e)} 
                    value={comment.comments}
                />
                <Button 
                    variant="contained" 
                    color="primary" 
                    size="medium" 
                    style={{ height: 40 }}
                    onClick={(e) => addComment(e)}
                >Post</Button>             
            </Container>
            <Box>
                {
                    comments && comments.length > 0 && comments.map(comment => (
                        <Comment comment={comment}  setToggle={setToggle}/>
                    ))
                }
            </Box>
        </Box>
    )
}

export default Comments;