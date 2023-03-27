import { Stack, Box } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";

import { ChatHeader, ChatFooter } from "../../components/Chat";
import useResponsive from "../../hooks/useResponsive";
import { Chat_History } from "../../data";
import {
  DocMsg,
  LinkMsg,
  MediaMsg,
  ReplyMsg,
  TextMsg,
  Timeline,
} from "../../sections/Dashboard/Conversation";
import { useDispatch, useSelector } from "react-redux";
import { FetchCurrentMessages, SetCurrentConversation } from "../../redux/slices/conversation";
import { socket } from "../../socket";
import { useSearchParams } from "react-router-dom";

const Conversation = ({ isMobile, menu , Chat_History }) => {
  const dispatch = useDispatch();
  const { Groups } = useSelector(
    (state) => state.auth
  );
  const [searchParams] = useSearchParams();
  const  room_id  = searchParams.get("id");
  useEffect(() => {
    const current = Groups.find((el) => el.id == room_id);
    socket.emit("getMessages", current.id, (data) => {
      dispatch(FetchCurrentMessages({ messages: data }));
    });
    dispatch(SetCurrentConversation(current));
  }, [room_id]);
  const { conversations, current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );

  return (
    <Box p={isMobile ? 1 : 3}>
      <Stack spacing={3}>
        {current_messages && current_messages?.map((el, idx) => {
          switch (el.type) {
            case "divider":
              return (
                // Timeline
                <Timeline el={el} key={12} />
              );

            case "msg":
              switch (el.subtype) {
                case "img":
                  return (
                    // Media Message
                    <MediaMsg el={el} menu={menu} key={13}/>
                  );

                case "doc":
                  return (
                    // Doc Message
                    <DocMsg el={el} menu={menu} key={14} />
                  );
                case "link":
                  return (
                    //  Link Message
                    <LinkMsg el={el} menu={menu} key={15} />
                  );

                case "reply":
                  return (
                    //  ReplyMessage
                    <ReplyMsg el={el} menu={menu} key={17} />
                  );

                default:
                  return (
                    // Text Message
                    <TextMsg el={el} menu={menu} key={18} />
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

const ChatComponent = ({ room }) => {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();
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
      <ChatFooter id={room} />
    </Stack>
  );
};

export default ChatComponent;

export {Conversation};