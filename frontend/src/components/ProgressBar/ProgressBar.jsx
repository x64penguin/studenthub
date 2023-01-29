import "./ProgressBar.css";
import classNames from "classnames";
import {motion} from "framer-motion";

export function ProgressBar({percentage, className="", style={width: "100%"}}) {
    return <div style={style} className={classNames(["progress-bar", className])}>
        <motion.div
            initial={{width: 0}}
            animate={{width: percentage + "%"}}>

        </motion.div>
    </div>;
}