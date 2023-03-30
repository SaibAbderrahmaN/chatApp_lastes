import React, { useEffect, useRef, useState } from "react";
import { Box, Stack, Typography, IconButton, Link, Divider,} from "@mui/material";
import { MagnifyingGlass, Plus } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";
import {Search,SearchIconWrapper,StyledInputBase,} from "../../components/Search";
import CreateGroup from "../../sections/Dashboard/CreateGroup";
import { useDispatch, useSelector } from "react-redux";
import { socket ,connectSocket} from "../../socket";
import GroupChatElement from "../../components/GroupChatElement";
import { useSearchParams } from "react-router-dom";
import NoChat from "../../assets/Illustration/NoChat";
import { AddDirectMessage, UpdateDirectConversation } from "../../redux/slices/conversation";
import { ChatGroupComponent } from "./GroupConversation"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



const Group = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [NewMessage, setNewMessage] = useState({});
  const [searchParams] = useSearchParams();
  const messageListRef = useRef(null);
  const dispatch = useDispatch();

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }
  const handleOpenDialog = () => {
    setOpenDialog(true);
  }
  const theme = useTheme();
  const {Groups} =useSelector((state)=>state.auth)
  const { user_id , type } = useSelector(
    (state) => state.auth
  );
  const { current_messages} = useSelector(
    (state) => state.conversation.direct_chat
  );
  if (!socket) {
    connectSocket(user_id);
  }
  useEffect(() => {
    dispatch(
      AddDirectMessage({
        id: NewMessage.id,
        type: "msg",
        subtype: NewMessage.type,
        message: NewMessage.message,
        incoming:(NewMessage.id_driver != user_id && type === "driver") || (NewMessage?.id_admin != user_id && type === "admin") || (NewMessage.id_client != user_id && type === "client") ,
        outgoing:(NewMessage.id_driver == user_id && type === "driver") || (NewMessage?.id_admin == user_id && type === "admin") || (NewMessage.id_client == user_id && type === "client")  
        })
    );

  }, [NewMessage])
  

  socket.on("receive-message", (data) => {
    setNewMessage(data)
 
  });

  useEffect(() => {
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [current_messages]);

  return (
    <>
      <Stack direction="row" sx={{ width: "100%" }}>
        {/* Left */}
        <Box
         
          sx={{
            overflowY: "scroll",

            height: "100vh",
            width: 320,
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,

            boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
          }}
        >
          <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
            <Stack
              alignItems={"center"}
              justifyContent="space-between"
              direction="row"
            >
              <Typography variant="h5">Groups</Typography>
            </Stack>
            <Stack sx={{ width: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search…"
                  inputProps={{ "aria-label": "search" }}
                />
              </Search>
            </Stack>
            <Stack
              justifyContent={"space-between"}
              alignItems={"center"}
              direction={"row"}
            >
              <Typography variant="subtitle2" sx={{}} component={Link}>
                Create New Group
              </Typography>
              <IconButton onClick={handleOpenDialog}>
                <Plus style={{ color: theme.palette.primary.main }} />
              </IconButton>
            </Stack>
            <Divider />
            <Stack sx={{ flexGrow: 1, overflow: "scroll", height: "100%" }}>
              <SimpleBarStyle timeout={500} clickOnTrack={false}>
                <Stack spacing={2.4}>
                  <Typography variant="subtitle2" sx={{ color: "#676667" }}>
                    my groups
                  </Typography>
                  {/* Chat List */}
                  {Groups.map((el, idx) => {
                    return <GroupChatElement {...el}  key={idx}/>;
                  })}
                </Stack>
              </SimpleBarStyle>
            </Stack>
          </Stack>
        </Box>


        {/* Right */}
        <Box
          ref={messageListRef}
          sx={{
            height: "100%",
            width: "calc(100vw - 420px )",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#FFF"
                : theme.palette.background.paper,
            borderBottom:
              searchParams.get("type") === "group-chat" &&
              searchParams.get("id")
                ? "0px"
                : "6px solid #0162C4",
          }}
        >
          {searchParams.get("type") === "group-chat" &&
          searchParams.get("id") ? (
            <ChatGroupComponent  room={searchParams.get("id")} />
          ) : (
            <Stack
              spacing={2}
              sx={{ height: "100%", width: "100%" }}
              alignItems="center"
              justifyContent={"center"}
            >
              <NoChat />
              <Typography variant="subtitle2">
                Select a group to  start a{" "}
              </Typography>
            </Stack>
          )}
        </Box>
      </Stack>
      {openDialog && <CreateGroup open={openDialog} handleClose={handleCloseDialog} />}
    </>
  );
};

export default Group;
