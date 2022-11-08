import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { store } from "./store"
import "./App.css"

function App() {
    return (
        <Provider store={store}>
            <Layout>
                <BrowserRouter>
                    <Routes>
                        <Route index element={"index"}/>
                    </Routes>
                </BrowserRouter>
            </Layout>
        </Provider>
    )
}

export default App;
