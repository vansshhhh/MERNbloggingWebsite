import pageNotFoundImage from "../imgs/404.png"
import { Link } from "react-router-dom";
import fullLogo from "../imgs/full-logo.png"

const PageNotFound = () => {
    return(
        <section className="relative flex flex-col items-center gap-20 p-10 text-center h-cover">
            <img src={pageNotFoundImage} alt="" className="object-cover border-2 rounded select-none border-grey w-72 aspect-square"/>

            <h1 className="text-4xl leading-7 capitalize font-gelasio">Page not found.</h1>
            <p className="-mt-8 text-xl leading-7 text-dark-grey">The page you are looking for does not exist. Head back to the <Link to={"/"} className="text-black underline">Home Page</Link></p>

            <div className="mt-auto">
                <img src={fullLogo} alt="" className="block object-contain h-8 mx-auto select-none"/>
                <p className="mt-5 text-dark-grey">Read millions of stories around the world.</p>
            </div>

        </section>
    )
}
export default PageNotFound;