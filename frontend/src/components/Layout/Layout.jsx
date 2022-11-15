import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userSlice } from "../../store/User";
import { api_get, api_post, get } from "../../utils";
import { Loading } from "../Loading/Loading"
import { Navbar } from "../Navbar/Navbar"
import "./Layout.css"

export function Layout(props) {
    const dispatch = useDispatch();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        api_get("user", (data) => {
            console.log(data);
            dispatch(userSlice.actions.update(data));
            setLoaded(true);
        })
    });

    return (
        <div className="layout">
            { loaded ? <>
                    <Navbar/>
                    <main>
                        { props.children }
                    </main>
                </> : 
                <Loading/> }
        </div>
    );
}