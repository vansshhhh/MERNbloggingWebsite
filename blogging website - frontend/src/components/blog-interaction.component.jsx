import { useContext, useEffect } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import {toast, Toaster} from "react-hot-toast";
import axios from "axios";
const BlogInteraction = () => {

    let {blog, blog: {_id, title, blog_id, activity, activity : {total_likes, total_comments}, author : {personal_info:{username : author_username}}}, setBlog, islikedByUser, setLikedByUser, setCommentsWrapper} = useContext(BlogContext);

    let {userAuth : {username, access_token}} = useContext(UserContext);

    useEffect(() => {

        if(access_token){
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user", {_id}, {
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            })
            .then(({data:{result}}) => {
                setLikedByUser(Boolean(result))
            })
            .catch(err => {
                console.log(err)
            })
        }

    }, [])

    const handleLike = () => {
        if(access_token){
            setLikedByUser(preVal => !preVal)

            !islikedByUser ? total_likes++ : total_likes--;

            setBlog({...blog, activity:{...activity, total_likes}})

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", {_id, islikedByUser},{

                headers: {
                    "Authorization" : `Bearer ${access_token}`
                }
            })
            .then( ({data})=> {
                console.log(data)
            })
            .catch(err => {
                console.log(err)
            })


        }
        else{
            toast.error("Please login to like this blog.");
        }
    }


    return(
        <h1> 
            <Toaster/>
            <hr className="my-2 border-grey"/>

                <div className="flex justify-between gap-6">

                    <div className="flex items-center gap-3">
                   
                        <button className={"flex items-center justify-center w-10 h-10 rounded-full " + (islikedByUser ? "bg-red/20 text-red" : "bg-grey/80")} onClick={handleLike}>
                            <i className={"fi fi-"+(islikedByUser ? "sr" : "rr")+"-heart"}></i>
                        </button>
                        <p className="my-2 border-grey">{total_likes}</p>
                    


                    
                        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-grey/80" onClick={() => setCommentsWrapper(preVal => !preVal)}>
                            <i className="fi fi-rr-comment-dots"></i>
                        </button>
                        <p className="my-2 border-grey">{total_comments}</p>
                    
                    </div>
                    <div className="flex items-center gap-6">

                        {
                            username == author_username ?
                            <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">
                                Edit
                            </Link> : ""
                        }

                        <Link to={`https://twitter.com/intent/tweet?text=Read${title}&url=${location.href}`}>
                        <i className="text-xl fi fi-brands-twitter hover:text-twitter"></i>
                        </Link>
                    </div>
                </div>

                

            <hr className="my-2 border-grey"/>
        </h1>
    )
}   

export default BlogInteraction;