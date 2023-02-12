import {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import {Loading} from "../../components/Loading/Loading";
import {api_get} from "../../utils";
import "./Profile.css";
import {cnTab, TabLabel, TabSwitch} from "../../components/TabSwitch/TabSwitch";
import {SquareButton} from "../../components/Button/SquareButton";
import settings_icon from "./settings_icon.svg";
import {API_SERVER} from "../../config";
import {useSelector} from "react-redux";
import {selectUser} from "../../store/User/selectors";
import {LinkButton} from "../../components/Button/LinkButton";

export function ProfilePage() {
    const { userId } = useParams();
    const [user, setUser] = useState(undefined);
    const currentUser = useSelector(selectUser);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("Пройденные тесты");

    useEffect(() => {
        api_get("user/" + userId, (data) => {
            if (data.response === "success") {
                setUser(data.user);
                document.title = data.user.username;
            }
        });
    }, [setUser, userId]);

    if (user === undefined) {
        return <Loading />;
    }

    const renderTestCard = (test) => {
        return <div className="profile__created-test">
            <img alt="icon" src={`${API_SERVER}/static/test_icon/${test.id}`}/>
            <div className="description">
                <Link to={"/test/" + test.id}><h2>{test.name}</h2></Link>
                <span>{test.description}</span>
            </div>
            {
                test.author === currentUser.id ?
                    <LinkButton
                        link={"/test/" + test.id + "/edit"}
                        className="created-test__button">
                            Редактировать
                    </LinkButton> : null
            }
        </div>
    }

    return (
        <div className="block-default profile-page mx-a">
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
            <ProfileStats/>
            <TabSwitch style="secondary" mode="horizontal" onChange={n => setActiveTab(n)}>
                <TabLabel>Пройденные тесты</TabLabel>
                <TabLabel>Созданные тесты</TabLabel>                
            </TabSwitch>
            <div className={cnTab(activeTab === "Пройденные тесты")}>

            </div>
            <div className={cnTab(activeTab === "Созданные тесты")}>
                {
                    user.tests_created.map(renderTestCard)
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

function ProfileStats({profile}) {

}