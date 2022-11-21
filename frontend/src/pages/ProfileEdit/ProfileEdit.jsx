import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/User/selectors";
import { TabSwitch, TabLabel } from "../../components/TabSwitch/TabSwitch";
import "./ProfileEdit.css";
import classNames from "classnames";
import { useState } from "react";
import { Input } from "../../components/Input/Input";

export function ProfileEdit(props) {
    const { userId } = useParams();
    const currentUser = useSelector((state) => selectUser(state));
    const [activeTab, setActiveTab] = useState("Основные");
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: currentUser.user.email,
        avatar: currentUser.user.avatar,
    });

    if (currentUser.user.id != userId) {
        return navigate(`/user/${userId}`);
    }

    console.log(activeTab);

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
                <Input
                    label="Почта"
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                    invalid={form.email.search("@") == -1}
                />
            </div>
            <div className={classNames({"tab-content": true, "hidden": activeTab != "Безопасность"})}>
                
            </div>
        </div>
    );
}
