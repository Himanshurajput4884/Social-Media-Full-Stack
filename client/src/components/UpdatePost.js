import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "./mix.css";
import { LoginContext } from './ContextProvider/Context';


function UpdatePost() {
  const navigate = useNavigate();
  const [ formdata, setformdata ] = useState({
        title: '',
        image: null,
        createdAt: Math.floor(Date.now() / 1000),
    })
    const { logindata, setLoginData } = useContext(LoginContext);
    const setVal = (e) =>{
        setformdata({...formdata, [e.target.name]:e.target.value});
    }
    const setImage = (e) =>{ 
        setformdata({...formdata, image:e.target.files[0]});
    }
    // const [post, setPost] = useState({});
    const { id } = useParams();

    let token = localStorage.getItem("usersdatatoken");
    useEffect(()=>{
        const fetchData=()=>{
            let url = `http://localhost:8009/post/${id}`;
            fetch(url, {
                mehtod: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token,
                    Accept: "application/json"
                },
                query: true,
            })
            .then((res)=>res.json())
            .then((data)=>{
                console.log(data);
                setformdata({
                    title: data.title,
                });
            })
            .catch(err=>{
                console.log(err);
            })
        }
        fetchData();
    }, [])



    const handleUpdate = async (e) =>{
        e.preventDefault();
        const form_data = new FormData();
        form_data.append('file', formdata.image);
        // form_data.append('username', logindata.ValidUserOne.fname);
        // form_data.append('user_id', logindata.ValidUserOne._id);
        // form_data.append('title', formdata.title);
        // form_data.append('Date', formdata.createdAt);


        let url = "http://localhost:8009/file/upload";
        const data = await fetch(url, {
          method: 'POST',
          body: form_data,
        })
        const res = await data.json();
        let token = localStorage.getItem("usersdatatoken");
        

        if(res.imageUrl){
          console.log("yess");
          const form2_data = {
            username: logindata.ValidUserOne.fname,
            title: formdata.title,
            user_id: logindata.ValidUserOne._id,
            createdAt: formdata.createdAt,
            imageUrl: res.imageUrl,
          }
          // console.log(form2_data);
          const data2 = await fetch(`http://localhost:8009/update/${id}`, {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
              "Authorization": token,
              Accept: "application/json"
          },
            body: JSON.stringify(form2_data),
          })
          const response = await data2.json();
          if(response.success){
            setformdata({
              title: '',
              image: null,
            });
            navigate(`/getPost/${id}`);
          }
        }
        
    }


  return (
    <>
      <section>
        <div className="form_data">
          <div className="form_heading">
            <h1>Hello User</h1>
            <p>Can Update Your Post Here.</p>
          </div>

          <form>
            <div className="form_input">
              <label htmlFor="title">Title</label>
              <input
                type="email"
                value={formdata.title}
                onChange={setVal}
                name="title"
                id="title"
                placeholder="Title"
              />
            </div>
            
            <div className="form_input">
              <label htmlFor="file">Image</label>
              <input
                type="file"
                onChange={(e)=>setImage(e)}
                id="image"
                accept="image/*"
              />
            </div>

            <button className="btn" onClick={handleUpdate}>
              Update Post
            </button>
            
          </form>
          <ToastContainer />
        </div>
      </section>
    </>
  );
}

export default UpdatePost;
