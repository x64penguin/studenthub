import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorPage } from "../../components/ErrorPage/ErrorPage";
import { Loading } from "../../components/Loading/Loading";
import { api_get } from "../../utils";
import "./Profile.css";
import { cnTab, TabLabel, TabSwitch } from "../../components/TabSwitch/TabSwitch";
import { SquareButton } from "../../components/Button/SquareButton";
import settings_icon from "./settings_icon.svg";
import { API_SERVER } from "../../config";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/User/selectors";

export function ProfilePage() {
    const { userId } = useParams();
    const [user, setUser] = useState({});
    const [status, setStatus] = useState("loading");
    const currentUser = useSelector(selectUser);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Пройденные тесты");

    useEffect(() => {
        api_get("user/" + userId, (data) => {
            if (data.response === "success") {
                setUser(data.user);
                setStatus("success");
            } else {
                setStatus(data.response);
            }
        });
    }, [setUser, setStatus, userId]);

    if (status === "loading") {
        return <Loading />;
    } else if (status !== "success") {
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
            <TabSwitch style="secondary" mode="horizontal" onChange={n => setActiveTab(n)}>
                <TabLabel>Пройденные тесты</TabLabel>
                <TabLabel>Созданные тесты</TabLabel>                
            </TabSwitch>
            <div className={cnTab(activeTab === "Пройденные тесты")}>

            </div>
            <div className={cnTab(activeTab === "Созданные тесты")}>
                {
                    currentUser.tests_created.map(test => {
                        return <a href={"/test/" + test.id + "/edit"} className="profile__created-test">
                            <img alt="icon" src={`${API_SERVER}/static/test_icon/${test.id}`}/>
                            <div className="description">
                                <h2>{test.name}</h2>
                                <span>{test.description}</span>
                            </div>
                        </a>
                    })
                }
            </div>
            { user.id === currentUser.id ?
            <SquareButton className="edit-profile-btn" onClick={() => navigate(`/user/${userId}/edit`)}>
                <img alt="settings icon" src={settings_icon}/>
            </SquareButton> : undefined
            }
        </div>
    );
}
