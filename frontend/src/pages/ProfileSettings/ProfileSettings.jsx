import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/User/selectors";
import { TabSwitch, TabLabel } from "../../components/TabSwitch/TabSwitch";
import "./ProfileSettings.css";
import classNames from "classnames";
import { useState } from "react";
import { Input } from "../../components/Input/Input";
import { FileInput } from "../../components/FileInput/FileInput";
import { Button } from "../../components/Button/Button";
import { API_SERVER } from "../../config";

function SecuritySession(props) {
    const {
        device,
        ip,
        expires
    } = props;

    return <div className="security__session">
        <img src={device=="Desktop" ? 
            "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_desktop_windows_48px-256.png" :
            "https://cdn3.iconfinder.com/data/icons/google-material-design-icons/48/ic_tablet_mac_48px-256.png"}/>
        <div className="device-info">
            <h2>{ip}</h2>
            <span>{device}</span>
            <span>Истекает: {expires}</span>
        </div>
        <Button>Выйти</Button>
    </div>;
}

export function ProfileSettings(props) {
    const { userId } = useParams();
    const currentUser = useSelector((state) => selectUser(state));
    const [activeTab, setActiveTab] = useState("Основные");
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: currentUser.user.email,
        avatar: currentUser.user.avatar,
    });

    const redirectToUser = () => navigate(`/user/${userId}`);

    if (currentUser.user.id != userId) {
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

            <div className={classNames({"tab-content": true, "hidden": activeTab != "Основные"})}>
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
                        invalid={form.email.search("@") == -1}
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
            <div className={classNames({"tab-content": true, "hidden": activeTab != "Безопасность"})}>
                <h2 className="section-header">Активные сессии</h2>
                {
                    currentUser.user.sessions.map(session => {
                        return <SecuritySession 
                            device={session.device}
                            ip={session.ip} 
                            expires={session.expires}
                        />;
                    })
                }
            </div>
        </div>
    );
}