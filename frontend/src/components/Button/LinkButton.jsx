export function LinkButton(props) {
    const {
        link,
        children,
        style = "primary",
        className = ""
    } = props;

    return <a className={"button " + style + " " + className}
              href={link}>
        {children}
    </a>
}