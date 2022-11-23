import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorPage } from "../../components/ErrorPage/ErrorPage";
import { Loading } from "../../components/Loading/Loading";
import { api_get, getStaticFile } from "../../utils";
import "./Profile.css";
import { TabLabel, TabSwitch } from "../../components/TabSwitch/TabSwitch";
import { SquareButton } from "../../components/Button/SquareButton";
import settings_icon from "./settings_icon.svg";
import { API_SERVER } from "../../config";

export function ProfilePage() {
    const { userId } = useParams();
    const [user, setUser] = useState({});
    const [status, setStatus] = useState("loading");
    const navigate = useNavigate();

    useEffect(() => {
        api_get(
            "user/" + userId,
            (data) => {
                if (data.response == "success") {
                    setUser(data.user);
                    setStatus("success");
                } else {
                    setStatus(data.response);
                }
            },
            (error) => {
                setStatus("404");
            }
        );
    }, []);

    if (status == "loading") {
        return <Loading />;
    } else if (status != "success") {
        return <ErrorPage error={status} />;
    }

    const ProfileStats = ({label, stat}) => {
        return <>
            <span className="profile-stats__label">{label}:</span>
            <span className="profile-stats">{stat}</span>
        </>
    }

    return (
        <div className="block-default profile-page">
            <div className="profile-page__header">
                <img
                    src={`${API_SERVER}/static/avatar/${user.id}`}
                    alt="user avatar"
                    className="avatar"
                />
                <div>
                    <h1>{user.username}</h1>
                    <span className={"profile-badge " + user.badge[0]}>
                        {user.badge[1]}
                    </span>
                </div>
                <h2>{user.name}</h2>
            </div>
            <div className="profile-page__stats">
                <ProfileStats label="Присоединился" stat={user.joined}/>
                <ProfileStats label="Решено тестов" stat={256}/>
            </div>
            <TabSwitch style="secondary" mode="horizontal" onChange={()=>{}}>
                <TabLabel>Пройденные тесты</TabLabel>
                <TabLabel>Еще че то</TabLabel>                
            </TabSwitch>
            <div className="tab-content">

            </div>
            <SquareButton className="edit-profile-btn" onClick={() => navigate(`/user/${userId}/edit`)}>
                <img src={settings_icon}/>
            </SquareButton>
        </div>
    );
}
