import { createBrowserRouter } from "react-router-dom";
import { Login } from "../views/Login";
import { Register } from "../views/Register";
import { Home } from "../views/Home";
import { Profile } from "../views/Profile";
import { MeetAddView } from "../views/MeetAddView";
import { MeetEditView } from "../views/MeetEditView";
import { LinkView } from "../views/Link";
import { RoomView } from "../views/Room";
import { Banned } from "../views/Banned";

export const getRouter = (token: string) => {
    if (!token) {
        return createBrowserRouter([
            {
                path: "*",
                id: "login",
                element: <Login />,
            },
            {
                path: "/register",
                id: "register",
                element: <Register />,
            },
        ]);
    } else {
        const router = [
            {
                path: "*",
                id: "home",
                element: <Home />,
            },
            {
                path: "/user",
                id: "user",
                element: <Profile />,
            },
            {
                path: "/room/:link",
                id: "room",
                element: <RoomView />,
            },
            {
                path: "/banned",
                id: "banned",
                element: <Banned />,
            },
        ];

        const mobile = window.innerWidth <= 992;

        if (!mobile) {
            router.push({
                path: "/add",
                id: "add",
                element: <MeetAddView />,
            });

            router.push({
                path: "/edit/:meetId",
                id: "edit",
                element: <MeetEditView />,
            });
        } else {
            router.push({
                path: "/link",
                id: "link",
                element: <LinkView />,
            });
        }

        return createBrowserRouter(router);
    }
};
