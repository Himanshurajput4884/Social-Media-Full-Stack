import { useContext, useState, useEffect } from "react";
import { Typography, Box, styled } from "@mui/material";
import { Delete } from '@mui/icons-material';
import { LoginContext } from '../../ContextProvider/Context';

const Component = styled(Box)`
    margin-top: 30px;
    background: #F5F5F5;
    padding: 10px;
`;

const Container = styled(Box)`
    display: flex;
    margin-bottom: 5px;
`;

const Name = styled(Typography)`
    font-weight: 600,
    font-size: 18px;
    margin-right: 20px;
`;

const StyledDate = styled(Typography)`
    font-size: 14px;
    color: #878787;
`;

const DeleteIcon = styled(Delete)`
    margin-left: auto;
`;

const Comment = ({ comment, setToggle }) => {
    const token = localStorage.getItem("usersdatatoken");
    console.log(token);
    const { logindata, setLoginData } = useContext(LoginContext);
    const { doDelete, setDoDelete } = useState(false);
    console.log(comment);
    let id = comment._id;


        const removeComment = async () =>{
            let url = `http://localhost:8009/del/${id}`;
            await fetch(url, {
                method:"DELETE",
                "Context-Type":"application/json",
            })
            .then((res)=>{
                res.json();
            })
            .then((data)=>{
                if(data.success){
                    console.log("Comment deleted successfully");
                }
                setToggle(prev=>!prev);
            })
            .catch(error=>{
                console.log(error);
            })
        }


    return (
        <Component>
            <Container>
                <Name>{comment.name}</Name>
                <StyledDate>{new Date(comment.date).toDateString()}</StyledDate>
                { comment.name === logindata.ValidUserOne.fname && <DeleteIcon style={{"cursor": "pointer"}}onClick={() => removeComment()} /> }
            </Container>
            <Typography>{comment.comments}</Typography>
        </Component>
    )
}

export default Comment;