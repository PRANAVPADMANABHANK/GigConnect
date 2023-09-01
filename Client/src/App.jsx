import "./app.scss";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import React from "react";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";
import Home from "./pages/home/Home";
import Gigs from "./pages/gigs/Gigs";
import Gig from "./pages/gig/Gig";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Add from "./pages/add/Add";
import Orders from "./pages/orders/Orders";
import Messages from "./pages/messages/Messages";
import Message from "./pages/message/Message";
import MyGigs from "./pages/myGigs/MyGigs";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import Pay from "./pages/pay/Pay";
import Success from "./pages/success/Success";
import Profile from "./pages/profile/Profile";
import Error from "./pages/404/Error";
// import AdminDashboard from "./components/adminComponents/home/Home";
import AdminNavbar from "./components/adminComponents/adminNavbar/AdminNavbar";
// import AdminSidebar from "./components/adminComponents/adminSidebar/AdminSidebar";
import Admin404 from "./components/adminComponents/admin404/Admin404";
// import AdminHome from "./pages/adminPages/home/AdminHome";
// import AdminDashboard from "./components/adminComponents/adminDashboard/AdminDashboard";
import ForgotPassword from "../../Client/src/pages/ForgotPassword/ForgotPassword"
import ResetPassword from "../../Client/src/pages/resetPassword/ResetPassword"
import UserList from "../../Client/src/pages/adminPages/userList/UserList"
import AdminLogin from "../../Client/src/pages/adminPages/adminLogin/AdminLogin"
import Wallet from "./pages/wallet/Wallet";

function App() {
  const queryClient = new QueryClient();

  const Layout = () => {
    const isAdminRoute = window.location.pathname.startsWith("/admin"); // check the url starts with "/admin"
    

    return (
      // role based routing
      <div className="app">
        <QueryClientProvider client={queryClient}>
          {isAdminRoute ? <AdminNavbar/> : <Navbar />} {/* Conditionally render AdminNavbar for admin routes */}
          <Outlet />
          {isAdminRoute ? "" : <Footer />} {/* Conditionally render AdminFooter for admin routes */}
        </QueryClientProvider>
      </div>
    );
  };

  const router = createBrowserRouter([
    {

      // Seller and Buyer routes
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/gigs",
          element: <Gigs />,
        },
        {
          path: "/myGigs",
          element: <MyGigs />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/wallet",
          element: <Wallet />,
        },
        {
          path: "/messages",
          element: <Messages />,
        },
        {
          path: "/message/:id",
          element: <Message />,
        },
        {
          path: "/add",
          element: <Add />,
        },
        {
          path: "/gig/:id",
          element: <Gig />,
        },
        {
          path: "/register",
          element: <Register />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/pay/:id",
          element: <Pay />,
        },
        {
          path: "/success",
          element: <Success />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
        {
          path: "/forgot-password",
          element:<ForgotPassword/>
        },
        {
          path: "/reset-password/:id/:token",
          element:<ResetPassword/>
        },
        {
          path: "*",
          element: <Error />,
        },


        // Admin routes
        {
          path: "/admin/dashboard",
          element: ""
        },
        {
          path: "/admin/users",
          element: <UserList/>
        },
        {
          path: "/admin/Register",
          element: <AdminLogin/>
        },
        {
          path: "/admin/*",
          element: <Admin404 />
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
