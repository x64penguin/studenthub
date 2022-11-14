import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { store } from "./store"
import "./App.css"
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route index element={"index"}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                    </Routes>
                </Layout>
            </BrowserRouter>
        </Provider>
    )
}

export default App;
