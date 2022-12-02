import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {api_get} from "../../utils";

export function TestEdit(props) {
    const { testId } = useParams();
    const { test, setTest } = useState({});

    useEffect(() => {
        api_get("test", (data) => {

        });
    }, []);
}