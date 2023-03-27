import { createSlice } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import { connectSocket, socket } from "../../socket";

// ----------------------------------------------------------------------

const initialState = {
  sideBar: {
    open: false,
    type: "CONTACT", // can be CONTACT, STARRED, SHARED
  },
  isLoggedIn: true,
  tab: 0, // [0, 1, 2, 3]
  snackbar: {
    open: null,
    severity: null,
    message: null,
  },
  users: [], // all users of app who are not friends and not requested yet
  Drivers:[],
  Clients:[],
  Admins:[],
  friends: [], // all friends
  friendRequests: [], // all friend requests
  chat_type: null,
  room_id: null,

};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // Toggle Sidebar
    toggleSideBar(state) {
      state.sideBar.open = !state.sideBar.open;
    },
    updateSideBarType(state, action) {
      state.sideBar.type = action.payload.type;
    },
    updateTab(state, action) {
      state.tab = action.payload.tab;
    },

    openSnackBar(state, action) {
      console.log(action.payload);
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },
    closeSnackBar(state) {
      console.log("This is getting executed");
      state.snackbar.open = false;
      state.snackbar.message = null;
    },
    updateUsers(state, action) {
      state.users = action.payload.users;
    },
    updateDrivers(state, action) {
      state.Drivers = action.payload.Drivers;
    },
    updateAdmins(state, action) {
      state.Admins = action.payload.Admins;
    },
    updateClients(state, action) {
      state.Clients = action.payload.Clients;
    },
    updateFriends(state, action) {
      state.friends = action.payload.friends;
    },
    updateFriendRequests(state, action) {
      state.friendRequests = action.payload.requests;
    },
    updateSocket(state, action) {
      state.socket = action.payload.socket;
    },
    selectConversation(state, action) {
      state.chat_type = "individual";
      state.room_id = action.payload.room_id;
    },
  },
});
if (!socket) {
  connectSocket(window.localStorage.getItem("user_id"));
}
// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const closeSnackBar = () => async (dispatch, getState) => {
  dispatch(slice.actions.closeSnackBar());
};

export const showSnackbar =
  ({ severity, message }) =>
  async (dispatch, getState) => {
    dispatch(
      slice.actions.openSnackBar({
        message,
        severity,
      })
    );

    setTimeout(() => {
      dispatch(slice.actions.closeSnackBar());
    }, 4000);
  };

export function ToggleSidebar() {
  return async (dispatch, getState) => {
    dispatch(slice.actions.toggleSideBar());
  };
}
export function UpdateSidebarType(type) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateSideBarType({ type }));
  };
}
export function UpdateTab(tab) {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateTab({ tab }));
  };
}

export function FetchUsers() {
  return async (dispatch, getState ) => {

    socket.on("driverChat",  async(data) => {
      await data.map((client)=>{
        client.type= "driver"
        client.id_driver = client.id
        client.fullName= client.first_name + " " + client.last_name

      })

     dispatch(slice.actions.updateDrivers({ Drivers: data }));
    });

  };
}

export function FetchFriends() {
  return async (dispatch, getState) => {
    socket.on("AdminsChat",  async(data) => {
      dispatch(slice.actions.updateAdmins({ Admins: data }));
     });
  };
}
export function FetchAdmins() {
  return async (dispatch, getState) => {
    socket.on("AdminsChat",  async(data) => {
      await data.map((client)=>{
        client.type= "admin"
        client.id_admin = client.id
        client.fullName= client.first_name + " " + client.last_name
      })
       dispatch(slice.actions.updateAdmins({ Admins: data }));
     });
  };
}
export function FetchClient() {
  return async (dispatch, getState) => {
    socket.on("ClientsChat",  async(data) => {
      await data.map((client)=>{
        client.type= "client"
        client.id_client = client.id
        client.fullName= client.first_name + " " + client.last_name

      })

       await dispatch(slice.actions.updateClients({ Clients: data }));
     });
    };
  }
  


export function FetchFriendRequests() {
  return async (dispatch, getState) => {
    await axios
      .get(
        "/user/get-requests",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        dispatch(
          slice.actions.updateFriendRequests({ requests: response.data.data })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
}

export function updateSocket(socket) {
    return async (dispatch, getState) => {
      dispatch(slice.actions.updateSocket({socket}));
    }
}

export const SelectConversation = ({ room_id }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.selectConversation({ room_id }));
  };   }