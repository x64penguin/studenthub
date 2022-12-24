import "./ErrorPage.css"

export function ErrorPage({ error, description }) {
    return <div className="error-page__wrapper">
        <span className="error__title">{error} |</span>
        <span className="error__description"> {description || ''}</span>
    </div>
}