import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import NotificationCommentField from "./notification-comment-field.component";
import { UserContext } from "../App";
import axios from "axios";

const NotificationCard = ({data, index, notificationState, }) => {

    let [isReplying, setReplying] = useState(false);

    let {createdAt, type, reply, comment,replied_on_comment ,user ,user : {personal_info : {profile_img, fullname, username}}, blog : {_id, blog_id, title}, _id :notification_id} = data;

    let {userAuth : {username : author_username, profile_img : author_profile_img, access_token}} = useContext(UserContext);

    let {notifications : {results, totalDocs}, setNotifications, notifications} = notificationState;

    const handleReplyClick = () => {
        setReplying(preVal => !preVal)
    }

    const handleDelete = (comment_id, type, target) => {
        
        target.setAttribute("disabled", true)

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-comment", {_id : comment_id}, {
            headers:{
                "Authorization" : `Bearer ${access_token}`
            }
        })
        .then(() => {
            if(type == "comment"){
                results.splice(index, 1)
            }
            else{
                delete results[index.reply];
            }

            target.removeAttribute("disabled")
            setNotifications({...notifications, results, totalDocs : totalDocs - 1, deleteDocCount : notifications.deleteDocCount + 1})
        })
        .catch(err => {
            console.log(err)
        })


    }

    return(
        <div className="p-6 border-b border-grey border-l-black ">

            <div className="flex gap-5 mb-3 ">
                <img src={profile_img} alt="" className="flex-none rounded-full w-14 h-14"/>
                <div className="w-full">
                    <h1 className="text-xl font-medium text-dark-grey">
                        <span className="hidden capitalize lg:inline-block ">{fullname}</span>
                        <Link to={`/user/${username}`} className="mx-1 text-black underline">@{username}</Link>
                        <span className="font-normal">
                            {
                                type == "like" ? "liked your blog" :
                                type == "comment" ? "commented on" :
                                "replied on"
                            }
                        </span>
                    </h1>
                    {
                        type == "reply" ? 
                        <div className="p-4 mt-4 rounded-md bg-grey">
                            <p>{replied_on_comment.comment}</p>
                        </div>
                        :
                        <Link to={`/blog/${blog_id}`} className="font-medium text-dark-grey hover:underline line-clamp-1">{`"${title}"`}</Link>
                    }
                        
                </div>

            </div>

            {
                type != "like" ? 
                
                <p className="pl-5 my-5 text-xl ml-14 font-gelasio">{comment?.comment}</p> 
                
                : "" 
            }

            <div className="flex gap-8 p-5 mt-3 ml-14 text-dark-grey ">
                <p>{getDay(createdAt)}</p>
                {
                    type != "like" ? 
                    <>
                        {
                            !reply ?
                            <button className="underline hover:text-black" onClick={handleReplyClick}>Reply</button>
                            : ""
                        }
                        
                        <button className="underline hover:text-black" onClick={(e) => handleDelete(comment._id, "comment", e.target)}>Delete</button>
                    </>
                    : ""
                }
            </div>
            {
                isReplying ? 
                <div className="mt-8">
                    <NotificationCommentField _id={_id} blog_author={user} index={index} replyingTo={comment._id} setReplying={setReplying} notification_id={notification_id} notificationData={notificationState}/>
                </div>
                : ""
            }
            {
                reply ?
                <div className="p-5 mt-5 ml-20 rounded-md bg-grey">
                    <div className="flex gap-3 mb-3">
                        <img src={author_profile_img} alt="" className="w-8 h-8 rounded-full"/>

                        <div>
                            <h1 className="text-xl font-medium text-dark-grey">
                                <Link to={`/users/${author_username}`} className="mx-1 text-black underline">@{author_username}</Link>

                                <span className="font-normal">replied to</span>

                                <Link to={`/users/${username}`} className="mx-1 text-black underline">@{username}</Link>
                            </h1>
                        </div>
                    </div>
                    <p className="my-2 text-xl ml-14 font-gelasio">{reply.comment}</p>

                    <button className="mt-2 underline hover:text-black ml-14" onClick={(e) => handleDelete(comment._id, "reply", e.target)}>Delete</button>
                </div>
                :
                ""
            }

        </div>
    )    
}

export default NotificationCard;