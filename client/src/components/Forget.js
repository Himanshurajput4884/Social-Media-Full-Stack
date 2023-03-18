import React, { useState } from 'react'
import { NavLink ,useNavigate} from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import "./mix.css"


function Forget() {
    const navigate = useNavigate();
    
    const [inpval, setInpval] = useState({
        email: "",
    });

    const setVal = (e) => {
        // console.log(e.target.value);
        const { name, value } = e.target;

        setInpval(() => {
            return {
                ...inpval,
                [name]: value
            }
        })
    };

    const loginuser = async(e) =>{
        e.preventDefault();
        const email = inpval.email;
        if (email === "") {
            toast.error("email is required!", {
                position: "top-center"
            });
        } else if (!email.includes("@")) {
            toast.warning("includes @ in your email!", {
                position: "top-center"
            });
        } else {
            const data = await fetch("/check/email", {
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    email
                })
            });

            const res = await data.json();
            console.log(res.response.email);

            if(res.status === 201){
                // localStorage.setItem({email: res.response.email});
                setInpval({...inpval, email:""});
                navigate("/change");
            }            

        }
    }

  return (
    <>
    <section>
        <div className="form_data">
            <div className="form_heading">
                <h1>Reset Password</h1>
                <p>Enter your email</p>
            </div>

            <form>
            <div className="form_input">
                            <label htmlFor="email">Email</label>
                            <input type="email" value={inpval.email} onChange={setVal} name="email" id="email" placeholder='Enter Your Email Address' />
                        </div>

                <button className='btn' onClick={loginuser}>Submit</button>
                <p><NavLink to="/login">Login</NavLink></p>
                <p>Don't have an Account? <NavLink to="/register">Sign Up</NavLink> </p>
            </form>
            <ToastContainer />
        </div>
    </section>
</>
  )
}

export default Forget
