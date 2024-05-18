import { getDay } from "../common/date";
import {Link} from "react-router-dom";

const BlogPostCard = ({content, author}) => {

    let {publishedAt,blog_id:id,tags, title, des, banner, activity : {total_likes}} = content;
    let {fullname, profile_img, username} = author;

    return (
        <Link to={`/blog/${id}`} className="flex items-center gap-8 pb-5 mb-4 border-b border-grey">
            <div className="w-full">
                <div className="flex items-center gap-2 mb-7">
                    <img src={profile_img} className="w-6 h-6 rounded-full"/>
                    <p className="line-clamp-1">{fullname} @{username}</p>
                    <p className="min-w-fit">{getDay(publishedAt)}</p>
                </div>

                <h1 className="blog-title">{title}</h1>
                <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2">{des}</p>

                <div className="flex mt-7">
                    <span className="px-4 py-1 btn-light">{tags[0]}</span>

                    <span className="flex items-center gap-2 ml-3 text-dark-grey">
                        <i className="text-xl fi fi-rr-heart"></i>
                        {total_likes}
                    </span>
                </div>

            </div>

            <div className="h-28 aspect-square bg-grey ">
                <img src={banner} className="object-cover w-full h-full aspect-square"/>

            </div>
        </Link>
    )
}

export default BlogPostCard;