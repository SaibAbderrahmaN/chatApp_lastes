import React, { useState } from "react";
import {
  Box,
  Stack,
  Typography,
  IconButton,
  Link,
  Divider,
} from "@mui/material";
import { MagnifyingGlass, Plus } from "phosphor-react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { ChatList } from "../../data";
import ChatElement from "../../components/ChatElement";
import {
  Search,
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import CreateGroup from "../../sections/Dashboard/CreateGroup";
import { useSelector } from "react-redux";
import { socket } from "../../socket";
import GroupChatElement from "../../components/GroupChatElement";
import { useSearchParams } from "react-router-dom";
import NoChat from "../../assets/Illustration/NoChat";
import ChatComponent from "./Conversation";

const Group = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [searchParams] = useSearchParams();

  const [myRooms, setMyRooms] = useState([])

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }
  const handleOpenDialog = () => {
    setOpenDialog(true);
  }
  const theme = useTheme();
  const {Admins , Drivers ,Clients} =useSelector((state)=>state.app)
  const {Groups} =useSelector((state)=>state.auth)
  console.log(Groups)


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
                    mu groups
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
          sx={{
            height: "100%",
            width: "calc(100vw - 420px )",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#FFF"
                : theme.palette.background.paper,
            borderBottom:
              searchParams.get("type") === "individual-chat" &&
              searchParams.get("id")
                ? "0px"
                : "6px solid #0162C4",
          }}
        >
          {searchParams.get("type") === "individual-chat" &&
          searchParams.get("id") ? (
            <ChatComponent />
          ) : (
            <Stack
              spacing={2}
              sx={{ height: "100%", width: "100%" }}
              alignItems="center"
              justifyContent={"center"}
            >
              <NoChat />
              <Typography variant="subtitle2">
                Select a conversation or start a{" "}
                <Link
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: "none",
                  }}
                  to="/"
                >
                  new one
                </Link>
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
