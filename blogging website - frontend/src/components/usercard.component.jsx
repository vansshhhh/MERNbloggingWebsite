import { Link } from "react-router-dom";
const UserCard = ({user}) => {

let {personal_info : {fullname, username, profile_img}} = user;

    return(
        <Link to={`/user/${username}`} className="flex items-center gap-5 mb-5">
            <img src={profile_img} alt="" className="rounded-full w-14 h-14"/>

            <div>
                <h1 className="text-xl font-medium capitalize line-clamp-2">{fullname}</h1>
                <p className="text-dark-grey">@{username}</p>
            </div>
        


        </Link>
    )
}

export default UserCard