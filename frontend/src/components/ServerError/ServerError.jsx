import "./ServerError.css"

export function ServerError({ error }) {
    if (!error) {
        return null;
    }
    
    return <span className="server-error-msg">{error}</span>
}