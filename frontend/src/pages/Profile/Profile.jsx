import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loading } from "../../components/Loading/Loading";
import { api_get } from "../../utils";

export function ProfilePage() {
    const { userId } = useParams();
    const [user, setUser] = useState({});
    const [status, setStatus] = useState('loading');

    useEffect(() => {
        api_get("get_user/" + userId, (data) => {
            if (data.response == "success"){
                setUser(data.response.user);
                setStatus("200");
            } else {
                setStatus(data.response);
            }
        }, (error) => {
            setStatus(404);
        })
    });

    if (status == "loading") {
        return <Loading/>;
    } else if (status == "200") {
        return <div className="profile__wrapper">

        </div>
    } else {
        
    }
}