import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { UserContext } from "../App";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";
import { useNavigate, useParams } from "react-router-dom";
import  axios from "axios"

const PublishForm = () => {

    let tagLimit = 10;
    let characterLimit = 200;

    let {blog_id} = useParams();

    let {setEditorState, blog : {title, banner, tags, des, content}, setBlog, blog} = useContext(EditorContext)

    let {userAuth : {access_token}} = useContext(UserContext)

    let navigate = useNavigate();

    const handleCloseEvent = () => {

        setEditorState("editor");

    }

    const handleBlogTitleChange = (e) => {
        let input = e.target;

        setBlog({...blog, title : input.value})
    }

    const handleBlogDesChange = (e) => {
        let input = e.target;
        setBlog({...blog, des : input.value})
    }

    const handleTitleKeyDown = (e) => {
        if(e.keyCode == 13){
            e.preventDefault();
        }
    }

    const handleKeyDown = (e) => {
        if(e.keyCode == 13 || e.keyCode == 188){
            e.preventDefault();

            let tag = e.target.value;

            if(tags.length < tagLimit){
                if(!tags.includes(tag) && tag.length){
                    setBlog({...blog, tags:[...tags, tag]})
                }
            }
            else{
                toast.error(`You can add max ${tagLimit} tags`)
            }
            

            e.target.value = "";
        }
    }

    const publishBlog = (e) => {


        if(e.target.className.includes('disable')){
            return;
        }

        if(!title.length){
            return toast.error("Write a title to publish the blog.");
        }
    
        if(!des.length || des.length > 200){
            return toast.error("Write description under 200 characters.")
        }
    
        if(!banner.length){
            return toast.error("Write a banner to publish the blog.")
        }
    
        if (!content.blocks.length) {
            return toast.error("Write some blog content to publish the blog.");
        }
        
        if(!tags.length){
            return toast.error("Write tags to publish the blog.")
        }

        let loadingToast = toast.loading("Publishing....");

        e.target.classList.add('disable')

        let blogObj = {
            title, banner, des, content, tags, draft : false
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {...blogObj, id : blog_id}, {
            headers : {
                'Authorization' : `Bearer ${access_token}`
            }
        }).then(() => {
            e.target.classList.remove('disable')

            toast.dismiss(loadingToast);
            toast.success("Published");

            setTimeout(() => {
                navigate("/dashboard/blogs")
            },500)
        })
        .catch(({response}) => {
            e.target.classList.remove('disable')

            toast.dismiss(loadingToast);

            return toast.error(response.data.error)
        })

    }

    return(
        <AnimationWrapper>
            <section className="grid items-center w-screen min-h-screen py-16 lg:grid-cols-2 lg:gap-4">
                <Toaster/>
                <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]" onClick={handleCloseEvent}>
                    <i className="fi fi-br-cross"></i>
                </button>

                <div className="mas-w-[550px] center">
                    <p className="mb-1 text-dark-grey">Preview</p>

                    <div className="w-full mt-4 overflow-hidden rounded-lg aspect-video bg-grey">
                        <img src={banner} alt="" />
                    </div>

                    <h1 className="mt-2 text-4xl font-medium leading-tight line-clamp-2">{title}</h1>
                    <p className="mt-4 text-xl leading-7 font-gelasio line-clamp-2">{des}</p>

                </div>

                <div className="border-grey lg:border-1 lg:pl-8">

                    <p className="mb-2 text-dark-grey mt-9">Blog title</p>

                    <input type="text" placeholder="Blog Title" defaultValue={title} className="pl-4 input-box" onChange={handleBlogTitleChange}/>

                    <p className="mb-2 text-dark-grey mt-9"> Short description about your blog</p>

                    <textarea maxLength={characterLimit} defaultValue={des} className="h-40 pl-4 leading-7 resize-none input-box" onChange={handleBlogDesChange} onKeyDown={handleTitleKeyDown}></textarea>

                    <p className="mt-1 text-sm text-right text-dark-grey">{ characterLimit - des.length} characters left</p>

                    <p className="mb-2 text-dark-grey mt-9">Topics - (Helps in seraching and ranking your blog post)</p>

                    <div className="relative py-2 pb-4 pl-2 input-box">
                        <input type="text" placeholder="Topic" className="sticky top-0 left-0 pl-4 mb-3 bg-white input-box focus:bg-white" onKeyDown={handleKeyDown}/>
                        
                        {
                            tags.map((tag, i) => {
                               return <Tag tag={tag} key={i} tagIndex={i}/>
                            })
                    }

                    </div>

                    <p className="mt-1 mb-4 text-sm text-right text-dark-grey">{tagLimit - tags.length} Tags left</p>

                    <button className="px-8 btn-dark" onClick={publishBlog}>Publish</button>

                </div>

            </section>
        </AnimationWrapper>

    )
}

export default PublishForm;