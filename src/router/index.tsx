import { createBrowserRouter } from "react-router-dom";
import { Login } from "../views/Login";
import { Register } from "../views/Register";
import { Home } from "../views/Home";
import { Profile } from "../views/Profile";
import { MeetAddView } from "../views/MeetAddView";
import { MeetEditView } from "../views/MeetEditView";

export const getRouter = (token: string) => {
    if(!token) {
        return createBrowserRouter([
            {
                path: '*',
                id: 'login',
                element: <Login />
            },
            {
                path: '/register',
                id: 'register',
                element: <Register />
            }
        ]);
    }else{
        
        const router = [
            {
                path: '*',
                id: 'home',
                element: <Home />
            },
            {
                path:'/user',
                id: 'user',
                element: <Profile />
            }
        ];

        const mobile = window.innerWidth <= 992;

        if(!mobile) {
            router.push({
                path:'/add',
                id: 'add',
                element: <MeetAddView />
            });
            
            router.push({
                path:'/edit/:meetId',
                id: 'edit',
                element: <MeetEditView />
            });
        }

        return createBrowserRouter(router);
    }
};