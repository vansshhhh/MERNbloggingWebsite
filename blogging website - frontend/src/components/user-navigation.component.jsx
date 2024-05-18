import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { UserContext } from "../App";
import { useContext } from "react";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {

    const {userAuth:{username}, setUserAuth} = useContext(UserContext)

    const signOutUser = () => {
        removeFromSession("user");
        setUserAuth({access_token : null})
    }

    return(
        <AnimationWrapper transition={{duration : 0.2}} className="absolute right-0 z-50">
            <div className="absolute right-0 duration-200 bg-white border border-grey w-60">

            <Link to="/editor" className="flex gap-2 py-4 pl-8 link md:hidden">
                <i className="fi fi-rr-file-edit"></i>
                <p>Write</p>
            
            </Link>

            <Link to={`/user/${username}`} className="py-4 pl-8 link">
                Profile
            </Link>

            <Link to="/dashboard/blogs" className="py-4 pl-8 link">
                Dashboard
            </Link>

            <Link to="/settings/edit-profile" className="py-4 pl-8 link">
                Settings
            </Link>

            <span className="absolute border-t border-grey w-[200%]"></span>

                
                <Link to="/signin">
                    <button className="w-full p-4 py-4 pl-8 text-left hover:bg-grey" onClick={signOutUser}>
                        <h1 className="text-xl font-bold mg-1">Sign Out</h1>
                        <p className="text-dark-grey">@{username}</p>
                    </button>
                </Link>

            </div>

        </AnimationWrapper>
    )
}

export default UserNavigationPanel;