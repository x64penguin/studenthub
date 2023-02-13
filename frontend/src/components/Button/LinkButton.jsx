export function LinkButton(props) {
    const {
        link,
        children,
        css,
        style = "primary",
        className = ""
    } = props;

    return <a style={css} className={"button " + style + " " + className}
              href={link}>
        {children}
    </a>
}