import React, { useState ,useEffect} from "react";
import { Alert, Box, Divider, IconButton, Stack, Typography,} from "@mui/material";
import {  CircleDashed, MagnifyingGlass, Users,} from "phosphor-react";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { useTheme } from "@mui/material/styles";
import useResponsive from "../../hooks/useResponsive";
import BottomNav from "../../layouts/dashboard/BottomNav";
import { Search, SearchIconWrapper, StyledInputBase,} from "../../components/Search";
import Friends from "../../sections/Dashboard/Friends";
import {useDispatch , useSelector } from "react-redux";
import ChatElement from "../../components/ChatElement";
import { useNavigate} from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { socket } from "../../socket";
import { AddDirectConversation, SetCurrentConversation } from "../../redux/slices/conversation";



const Chats = () => {
  const theme = useTheme();
  const isDesktop = useResponsive("up", "md");
  const [openDialog, setOpenDialog] = useState(false);
  const [Create, setCreate] = useState(-1);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const {Groups} =useSelector((state)=>state.auth)
  const { conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );
  useEffect(() => {
    if(Create==1){
      toast.error(" you are already friends", {
        position: "top-center",
      });
      setCreate(-1)
    
    }else if (Create==0) {

      toast.success("you can start send messages  successfully", {
        position: "top-center",
      });
      setCreate(-1)

    }

 
  }, [Create])
  



  socket.on('start_conversation' , async(data , conversation)=>{
    setCreate(data)
    console.log(conversation)
    setOpenDialog(false);
  await  dispatch(AddDirectConversation(conversation))
  await  dispatch(SetCurrentConversation({
      id: conversation.id,
      name:  conversation.client ?`${conversation.client.first_name} ${conversation.client.last_name}`: conversation.driver ?`${conversation.driver.first_name} ${conversation.driver.last_name}`: conversation.admin ?`${conversation.admin.first_name} ${conversation.admin.last_name}`: conversation.company ?`${conversation.company.first_name} ${conversation.company.last_name}`: "unknownUser",
      id_customer:  conversation.client ? {id_client:conversation.client.id} : conversation.driver ?{id_driver:conversation.driver.id}: conversation.admin ?{id_admin:conversation.admin.id}: conversation.company ?{id_company:conversation.company.id}: "unknownUser",
      online:  conversation.client ? conversation.client.chat_Online== 1 : conversation.driver ? conversation.driver.chat_Online== 1 : conversation.admin ? conversation.admin.chat_Online== 1 : conversation.company ?conversation.company.chat_Online== 1 : false,
      time: "9:36",
      unread: 0,
      pinned: false,
      type: conversation.client ?`client`: conversation.driver ?`driver`: conversation.admin ?`admin`: conversation.company ?`company`: "unknownUser",


    }))
    navigate(`/app?id=${conversation.id}&type=individual-chat`);

  })
  return (
    <>
      <Box
        sx={{
          position: "relative",
          height: "100%",
          width: isDesktop ? 320 : "100vw",
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background,

          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
      <ToastContainer />

        {!isDesktop && (
          // Bottom Nav
          <BottomNav />
        )}

        <Stack p={3} spacing={2} sx={{ maxHeight: "100vh" }}>
          <Stack
            alignItems={"center"}
            justifyContent="space-between"
            direction="row"
          >
            <Typography variant="h5">Chats</Typography>

            <Stack direction={"row"} alignItems="center" spacing={1}>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}
                sx={{ width: "max-content" }}
              >
                <Users />
              </IconButton>
              <IconButton sx={{ width: "max-content" }}>
                <CircleDashed />
              </IconButton>
            </Stack>
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
          <Stack spacing={1}>
            <Divider />
          </Stack>
          <Stack sx={{ flexGrow: 1, height: "100%",overflow: "scroll" }}>
            <SimpleBarStyle timeout={500} clickOnTrack={false}>
              <Stack spacing={2.4}>
                <Typography variant="subtitle2" sx={{ color: "#676667" }}  key={30}>
                 mu Chats
                </Typography>
                {/* Chat List */}
                {conversations.map((el, idx) => {
                  return <ChatElement {...el} key={idx} />;
                })}
              
              </Stack>
            </SimpleBarStyle>
          </Stack>
        </Stack>
      </Box>
      {openDialog && (
        <Friends open={openDialog} handleClose={handleCloseDialog} />
      )}
    </>
  );
};

export default Chats;
