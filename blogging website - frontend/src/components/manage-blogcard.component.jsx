import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
const BlogStats = ({stats}) => {
    return(
        <div className="flex gap-2 max-lg:pb-4 max-lg:mb-6 max-lg:border-b border-grey ">
            {
                Object.keys(stats).map((key, i) => {
                    return !key.includes("parent") ? <div key={i} className={"flex flex-col items-center justify-center w-full h-full p-4 px-6 " +( i != 0 ? "border-grey border-l" : "")}>
                    <h1 className="mb-2 text-xl lg:text-2xl">{stats[key].toLocaleString()}</h1>
                    <p className="capitalize max-lg:text-dark-grey">{key.split("_")[1]}</p>
                </div> : ""
                })
            }
        </div>
    )
}

export const ManagePublishedBlogCard = ({blog}) => {

    let {banner, blog_id, title, publishedAt, activity} = blog;

    let [showStat, setShowStat] = useState(false);

    let  {userAuth : {access_token}} = useContext(UserContext);

    return (
        <>
        
            <div className="flex items-center gap-10 pb-6 mb-6 border-b max-md:px-4 border-grey"> 

                <img src={banner} className="flex-none object-cover max-md:hidden lg:hidden xl:block w-28 h-28 bg-grey" />

                <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
                    <div>
                        <Link to={`/blog/${blog_id}`} className="mb-4 blog-title hover:underline">
                            {title}
                        </Link>

                        <p className="line-clamp-1">Published on {getDay(publishedAt)}</p>

                    </div>

                    <div className="flex gap-6 mt-3">
                        <Link to={`/editor/${blog_id}`} className="py-2 pr-4 underline">Edit</Link>

                        <button className="py-2 pr-4 underline lg:hidden" onClick={() => setShowStat(preVal => !preVal)}>Stats</button>

                        <button className="py-2 pr-4 underline text-red" onClick={(e) => deleteBlog(blog, access_token, e.target)}>Delete</button>
                    </div>
                </div>

                <div className="max-lg:hidden">
                    <BlogStats stats={activity}/>

                </div>

            </div>

            {
                showStat ? <div className="lg:hidden"><BlogStats stats={activity}/></div> : ""
            }

        </>
    )
}


 export const ManageDraftBlogPost = ({blog}) => {

    let  {userAuth : {access_token}} = useContext(UserContext);

    let {title,des, blog_id, index} = blog;
    index++;

    return(
        <div className="flex gap-5 pb-6 mb-6 border-b lg:gap-10 border-grey">
            <h1 className="flex-none pl-4 text-center blog-index md:pl-6">{index < 10 ? "0" + index : index}</h1>

            <div>
                <h1 className="mb-3 blog-title">{title}</h1>
                <p className="line-clamp-2 font-gelasio">{des .length ? des : "No description"}</p>

                <div className="flex gap-6 mt-3">
                    <Link to={`/editor/${blog_id}`} className="py-2 pr-4 underline">Edit</Link>

                    <button className="py-2 pr-4 underline text-red" onClick={(e) => deleteBlog(blog, access_token, e.target)}>Delete</button>
                </div>
            </div>
        </div>
    )
}

const deleteBlog = (blog, access_token, target) => {
    let {index, blog_id, setStateFunc } = blog;
    
    target.setAttribute("disabled", true);

    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-blog", {blog_id},{
        headers :{
            "Authorization" : `Bearer ${access_token}`
        }
    })
    .then(({data}) => {
        target.removeAttribute("disabled");

        setStateFunc(preVal => {
            let {deletedDocCount, totalDocs, results} = preVal;
            results.splice(index, 1);

            if(!deletedDocCount){
                deletedDocCount = 0;
            }

            if(!results.length  && totalDocs - 1 > 0){
                return null;
            }

            return {...preVal, totalDocs:totalDocs - 1, deletedDocCount: deletedDocCount + 1}
        })
    })
    .catch(err => {
        console.log(err)
    })
}

