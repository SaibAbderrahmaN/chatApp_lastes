import { Stack, Box } from "@mui/material";
import React, { useEffect, useState} from "react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { ChatHeader, ChatFooter } from "../../components/Chat";
import useResponsive from "../../hooks/useResponsive";
import {DocMsg,LinkMsg,MediaMsg,ReplyMsg,TextMsg,Timeline} from "../../sections/Dashboard/Conversation";
import { useDispatch, useSelector } from "react-redux";
import { addChatDirectMessage, fetchChatMessages, FetchCurrentMessages, SetCurrentChat } from "../../redux/slices/conversation";
import { connectSocket, socket } from "../../socket";
import { useSearchParams } from "react-router-dom";

const Conversation = ({ isMobile, menu  }) => {
  const dispatch = useDispatch();
  const [NewMessage, setNewMessage] = useState({})
  const { Groups,user_id ,type } = useSelector(
    (state) => state.auth
  );
  if (!socket) {
    connectSocket(user_id);
  }
  const [searchParams] = useSearchParams();
  const  room_id  = searchParams.get("id");
  const { conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { current_message_chat ,current_chat } = useSelector(
    (state) => state.conversation.group_chat
  ); 
  
  useEffect(()=>{
      if(searchParams.get("type") === "individual-chat"){
        console.log('individual-chat')
      const current =  conversations.find((el) => el.id == room_id);
      socket.emit("get_current_chat_Messages", { id:current?.id,},(data) => {
        console.log(data)
        dispatch(fetchChatMessages({ messages: data }));
      })
      dispatch(SetCurrentChat(current));
    }
     },[room_id])
  
  useEffect(() => {
    if(searchParams.get("type") === "group-chat"){
      console.log("group_chat")
    const current = Groups.find((el) => el.id == room_id);
    socket.emit("getMessages", { id:current?.id,name:current?.name},(data) => {
      dispatch(FetchCurrentMessages({ messages: data }));
    });
  }
   }, [room_id]);

   useEffect(() => {
    if (current_chat?.id == NewMessage?.id_conversation) {
      dispatch(
       addChatDirectMessage({
          id: NewMessage.id,
          type: "msg",
          subtype: NewMessage.type,
          message: NewMessage.message,
          incoming:(NewMessage.id_driver != user_id && type === "driver") || (NewMessage?.id_admin != user_id && type === "admin") || (NewMessage.id_client != user_id && type === "client") ,
          outgoing:(NewMessage.id_driver == user_id && type === "driver") || (NewMessage?.id_admin == user_id && type === "admin") || (NewMessage.id_client == user_id && type === "client")  
          })
      );
    }
 
   }, [NewMessage.message])
   

   socket.on("newChatMessageComing", (data) => {

    setNewMessage(data)
    
  });


  return (
    <Box p={isMobile ? 1 : 3}>
      <Stack spacing={3}>
        { current_message_chat && current_message_chat?.map((el, idx) => {
          switch (el.type) {
            case "divider":
              return (
                <Timeline el={el} key={idx} />
              );

            case "msg":
              switch (el.subtype) {
                case "img":
                  return (
                    // Media Message
                    <MediaMsg el={el} menu={menu} key={idx}/>
                  );

                case "doc":
                  return (
                    // Doc Message
                    <DocMsg el={el} menu={menu} key={idx} />
                  );
                case "link":
                  return (
                    //  Link Message
                    <LinkMsg el={el} menu={menu} key={idx} />
                  );

                case "reply":
                  return (
                    //  ReplyMessage
                    <ReplyMsg el={el} menu={menu} key={idx} />
                  );

                default:
                  return (
                    // Text Message
                    <TextMsg el={el} menu={menu} key={idx} />
                  );
              }

            default:
              return <></>;
          }
        })}
      </Stack>
    </Box>
  );
};
const ChatComponent = () => {
  const [searchParams] = useSearchParams();
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();
  const  room_id  = searchParams.get("id");

  return (
    <Stack
      height={"100%"}
      maxHeight={"100vh"}
      width={isMobile ? "100vw" : "auto"}
    >
      {/*  */}
      <ChatHeader />
      <Box
        width={"100%"}
        sx={{
          position: "relative",
          flexGrow: 1,
          overflow: "scroll",

          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FA"
              : theme.palette.background,

          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <SimpleBarStyle timeout={500} clickOnTrack={false}>
          <Conversation   menu={true} isMobile={isMobile} />
        </SimpleBarStyle>
      </Box>

      {/*  */}
      <ChatFooter id={room_id} />
    </Stack>  );
};



export default ChatComponent;

export {Conversation};