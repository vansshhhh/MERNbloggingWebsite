import { Link, Navigate } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png"
import AnimationWrapper from "../common/page-animation";
import {Toaster, toast} from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { useContext } from "react";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({type}) => {


    let {userAuth, setUserAuth} = useContext(UserContext);
    let access_token = userAuth?.access_token;

    console.log(access_token);

    const userAuthThroughServer = (serverRoute, formData) => {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
            .then(({data}) => {
                storeInSession("user", JSON.stringify(data));
                setUserAuth(data);
                // console.log(sessionStorage);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.error) {
                    toast.error(error.response.data.error);
                } else {
                    // Handle other types of errors or undefined responses
                    toast.error('An error occurred. Please try again.');
                }
            })
    }

    const handleSubmit = (e) => {

        e.preventDefault();

        let serverRoute = type == "sign-in" ? "/signin" : "/signup";

        //formData

        let form = new FormData(formElement);
        let formData = {};

        for(let [key,value] of form.entries()){
            formData[key] = value;
        }
        // console.log(formData);

        let {fullname, email, password} = formData;

        // form validation

        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

       if(fullname){
        if(fullname.length < 3){
            return toast.error("Fullname must be atleast 3 letters long.")
        }
       }
    
        if(!email.length){
            return toast.error("Enter Email.")
        }
    
        if(!emailRegex.test(email)){
            return toast.error("Email is Invalid.")
        }
    
        if(!password.length){
            return toast.error("Enter Password.");
        }
        
        if(!passwordRegex.test(password)){
            return toast.error("Password should be 6 to 20 characters long with a numeric, 1 uppercase and 1 lowercase lettes.")
        }


        userAuthThroughServer(serverRoute,formData);

    }

    const handleGoogleAuth = (e) => {
        e.preventDefault();

         authWithGoogle().then(user => {
            
            let serverRoute = "/google-auth";
            let formData = {
                access_token: user.accessToken
            }

            userAuthThroughServer(serverRoute, formData);

         })
         .catch(err => {
            toast.error('Trouble login through Google.')
         })
    }

    return(

        access_token ?
        <Navigate to="/"/>

        :
        <AnimationWrapper keyValue={type}>
            
       <section className="flex items-center justify-center h-cover">
            <Toaster/>
        <form className="w-[80%] max-w-[400px]" id="formElement">
            <h1 className="mb-24 text-4xl text-center capitalize font-gelasio ">
                {type == "sign-in"?"Welcome back":"Join us today"}
            </h1>
            {
                type != "sign-in" ?
                <InputBox name="fullname" type="text" placeholder="Full Name" icon="fi-rr-user"/>
                : ""
            }
             <InputBox name="email" type="email" placeholder="Email" icon="fi-rr-envelope"/>

             <InputBox name="password" type="password" placeholder="Password" icon="fi-rr-key"/>

             <button className="btn-dark center mt-14" type="submit" onClick={handleSubmit}>
                {type.replace("-"," ")}
             </button>

             <div className="relative flex items-center w-full gap-2 my-10 font-bold text-black uppercase opacity-10">
                <hr className="w-1/2 border-black"/>
                <p>OR</p>
                <hr className="w-1/2 border-black"/>
             </div>
             
             <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center" onClick={handleGoogleAuth}>  
                    <img src={googleIcon} className="w-5"/>
                    continue with google
                </button>

            {
                type == "sign-in" ?
                <p className="mt-6 text-xl text-center text-dark-grey">
                    Don't have an account ?
                    <Link to="/signup" className="ml-1 text-xl text-black underline">
                    Join us today.
                    </Link>
                </p>
                :
                <p className="mt-6 text-xl text-center text-dark-grey">
                    Already a member ?
                    <Link to="/signin" className="ml-1 text-xl text-black underline">
                    Sign in here.
                    </Link>
                </p>
            }

        </form>

       </section>
       </AnimationWrapper>
    )
}

export default UserAuthForm;