import { useContext, useState } from "react"
import { UserContext } from "../App"
import toast, { Toaster } from "react-hot-toast";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";

const CommentField = ({action, index = undefined, replyingTo = undefined, setReplying}) => {

    let {userAuth : {access_token, username, fullname, profile_img}} = useContext(UserContext);

    let {blog, blog : { _id, author:{_id : blog_author}, comments, comments:{ results: commentsArr}, activity, activity : {total_comments, total_parent_comments}}, setBlog, setTotalParentCommentsLoaded} = useContext(BlogContext);


    const handleComment = () => {
        if(!access_token){
            return toast.error("Login first to leave a comment.")
        }
        if(!comment.length){
            return toast.error("Write something to leave a comment.")
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/add-comment", {
            _id, blog_author, comment, replying_to : replyingTo
        }, {
            headers : {
                "Authorization" : `Bearer ${access_token}`
            }
        })
        .then(({data}) => {

            setComment("");
            data.commented_by = { personal_info : {username, profile_img, fullname}}

            let newCommentArr;

            if(replyingTo){
                
                commentsArr[index].children.push(data._id);

                data.childrenLevel = commentsArr[index].childrenLevel + 1;

                data.parentIndex = index;

                commentsArr[index].isReplyLoaded = true;

                commentsArr.splice(index + 1, 0, data);

                newCommentArr = commentsArr;

                setReplying(false);

            }
            else{

                data.childrenLevel = 0;

                newCommentArr = [data, ...commentsArr];

            }

            

            let parentCommentIncrementVal = replyingTo ? 0:1;

            setBlog({...blog, comments:{...comments, results : newCommentArr}, activity : {...activity, total_comments: total_comments + 1, total_parent_comments : total_parent_comments + parentCommentIncrementVal}})

            setTotalParentCommentsLoaded(preVal => preVal + parentCommentIncrementVal)

        })
        .catch(err => {
            console.log(err);
        })

    }

    const [comment ,setComment] = useState("");
    return(
        <>
            <Toaster/>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Leave a comment..." className="pl-5 overflow-auto resize-none input-box placeholder:text-dark-grey h-[150px]"></textarea>

            <button className="px-10 mt-5 btn-dark" onClick={handleComment}>{action}</button>
        
        </>

    )
}

export default CommentField;