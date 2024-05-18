import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { Link } from "react-router-dom";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";
import CommentsContainer, { fetchComments } from "../components/comments.component";

export const blogStructure = {
    title:"",
    des:"",
    content:[],
    author:{personal_info:{}},
    banner:"",
    publishedAt:""
}

export const BlogContext = createContext({});

const BlogPage = () => {

    let {blog_id} = useParams();

    const [blog, setBlog] = useState(blogStructure);

    const [similarBlogs, setSimilarBlogs] = useState(null);

    const [loading, setLoading] = useState(true);

    const [islikedByUser, setLikedByUser] = useState(false);

    const [commentsWrapper, setCommentsWrapper] = useState(false);

    const [totalParentCommentsLoaded, setTotalParentCommentsLoaded] = useState(0);

    let {title, content, banner, author:{personal_info : {fullname, username : author_username, profile_img}}, publishedAt} = blog;
    

    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {blog_id})
        .then(async({data : {blog}}) => {

            blog.comments = await fetchComments({blog_id : blog._id, setParentCommentCountFunc : setTotalParentCommentsLoaded})

            setBlog(blog);

            

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {tag : blog.tags[0], limit : 5, eliminate_blog : blog_id})
            .then(({data}) => {

                
                setSimilarBlogs(data.blogs);
                console.log(data.blogs)

            })


            
            setLoading(false);
            // console.log(blog);
        })
        .catch(err => {
            console.log(err)
        })
    }

    useEffect(() => {

        resetStates();

        fetchBlog();

        }, [blog_id])

        const resetStates = () => {
            setBlog(blogStructure);
            setSimilarBlogs(null);
            setLoading(true);
            setLikedByUser(false);
            setCommentsWrapper(false);
            setTotalParentCommentsLoaded(0);
                }

    return(
        <AnimationWrapper>

            {
                loading ? <Loader/> :
                <BlogContext.Provider value = {{blog, setBlog, islikedByUser, setLikedByUser, commentsWrapper, setCommentsWrapper, totalParentCommentsLoaded, setTotalParentCommentsLoaded}}>


                <CommentsContainer/>

                <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">

                    <img src={banner} className="aspect-video" alt="" />

                    <div className="mt-12 ">
                        <h2>{title}</h2>
                        <div className="flex justify-between my-8 max-sm:flex-col">
                            <div className="flex items-start gap-5">
                                <img src={profile_img} className="w-12 h-12 rounded-full" alt="" />

                                <p className="capitalize">
                                    {fullname}
                                    <br />
                                    @
                                    <Link to={`/user/${author_username}`} className="underline">{author_username}</Link>
                                </p>
                            </div>
                            <p className="opacity-75 text-gark-grey max-sm:ml-12 max-sm:pl-5 max-sm:mt-6">Published on : {getDay(publishedAt)}</p>
                        </div>
                    </div>
                    
                    <BlogInteraction/>

                        <div className="my-12 font-gelasio blog-page-content">
                            {
                                content[0].blocks.map((block, i) => {
                                    return <div className="my-4 md:my-8 " key={i}>
                                        <BlogContent block = {block}/>
                                    </div>
                                })
                            }

                        </div>

                    <BlogInteraction/>

                    {
                        similarBlogs != null && similarBlogs.length ? 
                        <>
                            <h1 className="mb-10 text-2xl font-medium mt-14">Similar Blogs</h1>

                            {
                                similarBlogs.map((blog, i) => {
                                    let {author : {personal_info}} = blog;

                                    return <AnimationWrapper key={i} transition={{duration:2, delay: i * 0.1}}>
                                        <BlogPostCard content={blog} author={personal_info}/>
                                    </AnimationWrapper>
                                })
                            }
                        </>
                        : ""

                    }

                </div>
                </BlogContext.Provider>
            }

        </AnimationWrapper>
    )
}

export default BlogPage;