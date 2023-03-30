import React, { useEffect } from "react";
import {  Dialog, DialogContent, Slide, Stack, Tab, Tabs } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { FetchFriendRequests, FetchFriends, FetchUsers,FetchAdmins , FetchClient} from "../../redux/slices/app";
import { AdminElement, ClientElement, FriendElement, FriendRequestElement, UserElement } from "../../components/UserElement";
import { socket } from "../../socket";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const DriversList = () => {
  const dispatch = useDispatch();

  const { Drivers  } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(FetchUsers());
  }, []);


  return (
    <>
      {Drivers?.map((el, idx) => {
        return <UserElement key={idx} {...el} />;
      })}
    </>
  );
};
const AdminsList = () => {
  const dispatch = useDispatch();

  const { Admins } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(FetchAdmins());
  }, []);

  return (
    <>
      {Admins?.map((el, idx) => {
        return <AdminElement key={idx} {...el} />;
      })}
    </>
  );
};
const ClientList = () => {
  const dispatch = useDispatch();

  const { Clients } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(FetchClient());
  }, []);

  return (
    <>
      {Clients?.map((el, idx) => {
        return <ClientElement key={idx} {...el} />;
      })}
    </>
  );
};

const FriendsList = () => {
  const dispatch = useDispatch();

  const { friends 
   } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(FetchFriends());
  }, []);

  return (
    <>
      {friends?.map((el, idx) => {
        return <FriendElement key={idx} {...el} />;
      })}
    </>
  );
};

const RequestsList = () => {
  const dispatch = useDispatch();

  const { friendRequests } = useSelector((state) => state.app);

  useEffect(() => {
    dispatch(FetchFriendRequests());
  }, []);

  return (
    <>
      {friendRequests.map((el, idx) => {
        return <FriendRequestElement key={idx} {...el.sender} id={el._id} />;
      })}
    </>
  );
};

const Friends = ({ open, handleClose }) => {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      sx={{ p: 4 }}
    >
      {/* <DialogTitle>{"Friends"}</DialogTitle> */}
      <Stack p={2} sx={{ width: "100%" }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="drivers" />
          <Tab label="admins" />
          <Tab label="Clients" />
        </Tabs>
      </Stack>
      <DialogContent>
        <Stack sx={{ height: "100%" }}>
          <Stack spacing={2.4}>
            {(() => {
              switch (value) {
                case 0: // display all users in this list
                  return <DriversList />;

                case 1: // display friends in this list
                  return <AdminsList />;

                case 2: // display request in this list
                  return <ClientList />;

                default:
                  break;
              }
            })()}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default Friends;
