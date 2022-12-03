import "./FileInput.css";

export function FileInput(props) {
    const { className = "", onChange, accept, label, name } = props;

    if (!label) {
        return (
            <input
                type="file"
                className={"file-input " + className}
                onChange={onChange}
                accept={accept}
                id={name}
            />
        );
    } else {
        return (
            <div className={"input-group " + className}>
                <label>{label}</label>
                <input
                    type="file"
                    className="file-input"
                    onChange={onChange}
                    accept={accept}
                    id={name}
                />
            </div>
        );
    }
}
