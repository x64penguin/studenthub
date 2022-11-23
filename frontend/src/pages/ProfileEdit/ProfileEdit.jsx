import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/User/selectors";
import { TabSwitch, TabLabel } from "../../components/TabSwitch/TabSwitch";
import "./ProfileEdit.css";
import classNames from "classnames";
import { useState } from "react";
import { Input } from "../../components/Input/Input";
import { FileInput } from "../../components/FileInput/FileInput";
import { Button } from "../../components/Button/Button";
import { API_SERVER } from "../../config";

function SecuritySession(props) {
    const {
        device,
        ip
    } = props;
}

export function ProfileEdit(props) {
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

            <form onSubmit={formSubmit}>
                <div className={classNames({"tab-content": true, "hidden": activeTab != "Основные"})}>
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
                </div>
                <div className={classNames({"tab-content": true, "hidden": activeTab != "Безопасность"})}>

                </div>
                <div className="form-buttons">
                    <Button style="secondary" onClick={redirectToUser}>Отмена</Button>
                    <Button type="submit">Сохранить</Button>
                </div>
            </form>
        </div>
    );
}
