import "./ErrorPage.css"

export function ErrorPage({ error, description }) {
    return <div className="block-default error-page__wrapper">
        <h1>{error}</h1>
        <span>{description || ''}</span>
    </div>
}