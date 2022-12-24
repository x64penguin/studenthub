import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { store } from "./store";
import "./App.css";
import "./common.css";
import { Login } from "./pages/Login/Login";
import { Register } from "./pages/Register/Register";
import { ProfilePage } from "./pages/Profile/Profile";
import { ProfileSettings } from "./pages/ProfileSettings/ProfileSettings";
import { ErrorPage } from "./components/ErrorPage/ErrorPage";
import { CreateTest } from "./pages/CreateTest/CreateTest";
import {TestEdit} from "./pages/TestEdit/TestEdit";

function App() {
    return (
        <Provider store={store}>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route index element={"index"}/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/user/:userId" element={<ProfilePage/>}/>
                        <Route path="/user/:userId/edit" element={<ProfileSettings/>}/>
                        <Route path="/create" element={<CreateTest/>}/>
                        <Route path="/test/:testId/edit" element={<TestEdit/>}/>
                        <Route path="*" element={<ErrorPage error="404" description="Not Found"/>}/>
                    </Routes>
                </Layout>
            </BrowserRouter>
        </Provider>
    )
}

export default App;
