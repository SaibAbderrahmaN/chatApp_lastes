import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import SideNav from "./SideNav";
import { useDispatch, useSelector } from "react-redux";
import { FetchAdmins, FetchClient, FetchUsers } from "../../redux/slices/app";
import { socket, connectSocket } from "../../socket";
import { SelectConversation, showSnackbar } from "../../redux/slices/app";
import {UpdateDirectConversation,AddDirectConversation} from "../../redux/slices/conversation";
const DashboardLayout = () => {
  const [searchParams] = useSearchParams();

  const isDesktop = useResponsive("up", "md");
  const dispatch = useDispatch();

  const { isLoggedIn } = useSelector((state) => state.auth);

  const user_id = window.localStorage.getItem("user_id");

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";
          window.location.reload();
        }
      };
      dispatch(FetchAdmins());
      dispatch(FetchClient());
      dispatch(FetchUsers());
      window.onload();

      if (!socket) {
        connectSocket(user_id);
      }

  

      socket.on("request_sent", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });
    }

    // Remove event listener on component unmount
    return () => {
      socket?.off("request_sent");
    };
  }, [isLoggedIn, socket]);

  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  }

  


  return (
    <>
      <Stack direction="row">
        {isDesktop && (
          // SideBar
          <SideNav key={55} />
        )}

        <Outlet />
      </Stack>
    </>
  );
};

export default DashboardLayout;
