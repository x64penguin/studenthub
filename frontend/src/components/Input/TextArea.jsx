export function TextArea(props) {
    const {
        label,
        className = "",
        onChange,
        placeholder
    } = props;

    if (!label) {
        return (
            <textarea
                placeholder={placeholder}
                className={"input-default " + className}
                onChange={onChange}
            />
        );
    } else {
        return (
            <div className={"input-group " + className}>
                <label>{label}</label>
                <textarea
                    className={"input-default"}
                    onChange={onChange}
                />
            </div>
        );
    }
}