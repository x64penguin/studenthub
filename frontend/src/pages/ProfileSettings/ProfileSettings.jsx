import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/User/selectors";
import { TabSwitch, TabLabel, cnTab } from "../../components/TabSwitch/TabSwitch";
import "./ProfileSettings.css";
import { useState } from "react";
import { Input } from "../../components/Input/Input";
import { FileInput } from "../../components/FileInput/FileInput";
import { Button } from "../../components/Button/Button";
import { API_SERVER } from "../../config";
import { api_get } from "../../utils";

function SecuritySession(props) {
    const {
        device,
        ip,
        expires,
        onClick
    } = props;

    return <div className="security__session">
        <img alt="device icon" src={device === "Desktop" ?
            "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_desktop_windows_48px-256.png" :
            "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_tablet_mac_48px-256.png"}/>
        <div className="device-info">
            <h2>{ip}</h2>
            <span>{device}</span>
            <span>Истекает: {expires}</span>
        </div>
        <Button onClick={onClick}>Выйти</Button>
    </div>;
}

export function ProfileSettings() {
    const { userId } = useParams();
    const currentUser = useSelector(selectUser);
    const [activeTab, setActiveTab] = useState("Основные");
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: currentUser.email,
        avatar: null,
    });

    const redirectToUser = () => navigate(`/user/${userId}`);

    if (currentUser.id !== userId) {
        return redirectToUser();
    }

    const formSubmit = (event) => {
        event.preventDefault();
        let formData = new FormData();
        formData.append("email", form.email);
        formData.append("avatar", form.avatar);
        
        fetch(API_SERVER + "/api/edit_profile/" + userId, {
            method: "POST",
            body: formData
        }).then(redirectToUser);
    };

    const sessionLogout = (ip) => {
        api_get("logout_ip/" + ip);
        window.location.reload();
    }

    return (
        <div className="block-default profile-edit">
            <TabSwitch
                mode="horizontal"
                style="secondary"
                onChange={(n) => setActiveTab(n)}
            >
                <TabLabel>Основные</TabLabel>
                <TabLabel>Безопасность</TabLabel>
            </TabSwitch>

            <div className={cnTab(activeTab === "Основные")}>
                <form onSubmit={formSubmit}>
                    <FileInput
                        label="Аватар"
                        accept="image/*"
                        name="avatar"
                        onChange={(event) =>
                            setForm({ ...form, avatar: event.target.files[0] })
                        }
                    />
                    <Input
                        label="Почта"
                        name="email"
                        value={form.email}
                        invalid={form.email.search("@") === -1}
                        onChange={(event) =>
                            setForm({ ...form, email: event.target.value })
                        }
                    />
                    <div className="form-buttons">
                        <Button style="secondary" onClick={redirectToUser}>Отмена</Button>
                        <Button type="submit">Сохранить</Button>
                    </div>
                </form>
            </div>
            <div className={cnTab(activeTab === "Безопасность")}>
                <h2 className="section-header">Активные сессии</h2>
                {
                    currentUser.sessions.map((session, index)=> {
                        return <SecuritySession 
                            device={session.device}
                            ip={session.ip} 
                            expires={session.expires}
                            onClick={() => sessionLogout(session.ip)}
                            key={index}
                        />;
                    })
                }
            </div>
        </div>
    );
}
