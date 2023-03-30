import { createSlice } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";

const user_id = window.localStorage.getItem("user_id");
const type = window.localStorage.getItem("type");

const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  group_chat: {
    current_chat: null,
    current_message_chat: [],
  },
};

const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    
    fetchDirectConversations(state, action) {
      const list = action.payload.conversations.map((el) => {
        return {
          id: el.id,
          name:  el.client ?`${el.client.first_name} ${el.client.last_name}`: el.driver ?`${el.driver.first_name} ${el.driver.last_name}`: el.admin ?`${el.admin.first_name} ${el.admin.last_name}`: el.company ?`${el.company.first_name} ${el.company.last_name}`: "unknownUser",
          id_customer:  el.client ? {id_client:el.client.id} : el.driver ?{id_driver:el.driver.id}: el.admin ?{id_admin:el.admin.id}: el.company ?{id_company:el.company.id}: "unknownUser",
          online:  el.client ? el.client.chat_Online== 1 : el.driver ? el.driver.chat_Online== 1 : el.admin ? el.admin.chat_Online== 1 : el.company ?el.company.chat_Online== 1 : false,
          msg: faker.music.songName(),
          time: "9:36",
          unread: 0,
          pinned: false,
          type: el.client ?`client`: el.driver ?`driver`: el.admin ?`admin`: el.company ?`company`: "unknownUser",
        };
      });

      state.direct_chat.conversations = list;
    },
    updateDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el) => {
          if (el.id !== this_conversation.id) {
            return el;
          } else {
            const user = this_conversation.participants.find(
              (elm) => elm._id.toString() !== user_id
            );
            return {
              id: this_conversation._id._id,
              user_id: user._id,
              name: `${user.firstName} ${user.lastName}`,
              online: user.status === "Online",
              img: faker.image.avatar(),
              msg: faker.music.songName(),
              time: "9:36",
              unread: 0,
              pinned: false,
            };
          }
        }
      );
    },
    addDirectConversation(state, action) {
      const this_conversation = action.payload;
      console.log(this_conversation)
      state.direct_chat.conversations = state.direct_chat.conversations.filter(
        (el) => el.id !== this_conversation.id
      );
      state.direct_chat.conversations.push({
        id: this_conversation.id,
        name:  this_conversation.client ?`${this_conversation.client.first_name} ${this_conversation.client.last_name}`: this_conversation.driver ?`${this_conversation.driver.first_name} ${this_conversation.driver.last_name}`: this_conversation.admin ?`${this_conversation.admin.first_name} ${this_conversation.admin.last_name}`: this_conversation.company ?`${this_conversation.company.first_name} ${this_conversation.company.last_name}`: "unknownUser",
        id_customer:  this_conversation.client ? {id_client:this_conversation.client.id} : this_conversation.driver ?{id_driver:this_conversation.driver.id}: this_conversation.admin ?{id_admin:this_conversation.admin.id}: this_conversation.company ?{id_company:this_conversation.company.id}: "unknownUser",
        online:  this_conversation.client ? this_conversation.client.chat_Online== 1 : this_conversation.driver ? this_conversation.driver.chat_Online== 1 : this_conversation.admin ? this_conversation.admin.chat_Online== 1 : this_conversation.company ?this_conversation.company.chat_Online== 1 : false,
        msg: faker.music.songName(),
        time: "9:36",
        unread: 0,
        pinned: false,
        type: this_conversation.client ?`client`: this_conversation.driver ?`driver`: this_conversation.admin ?`admin`: this_conversation.company ?`company`: "unknownUser",
    });
    },
    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation = action.payload;
    },
    setCurrentChat(state, action) {
      state.group_chat.current_chat = action.payload;
    },
    fetchCurrentMessages(state, action) {
      const messages = action.payload.messages;
       
        const formatted_messages = messages && messages.map((el) => ({
        id: el.id,
        fullName:(el.driver?.fullName)|| (el.admin?.fullName) || (el.client?.fullName),
        type: "msg",
        subtype: el.type,
        message: el.message,
        incoming:(el.driver?.id != user_id && type === "driver") || (el.admin?.id != user_id && type === "admin") || (el.client?.id != user_id && type === "client") ,
        outgoing:(el.driver?.id == user_id && type === "driver") || (el.admin?.id == user_id && type === "admin") || (el.client?.id == user_id && type === "client")  
         })); 
      state.direct_chat.current_messages = formatted_messages;
    },
    fetchChatMessages(state, action) {
      const messages = action.payload.messages;
      const formatted_messages = messages && messages.map((el) => ({
        id: el.id,
        fullName:(el.driver?.fullName)|| (el.admin?.fullName) || (el.client?.fullName),
        type: "msg",
        subtype: el.type,
        message: el.message,
        incoming:(el.driver?.id != user_id && type === "driver") || (el.admin?.id != user_id && type === "admin") || (el.client?.id != user_id && type === "client") ,
        outgoing:(el.driver?.id == user_id && type === "driver") || (el.admin?.id == user_id && type === "admin") || (el.client?.id == user_id && type === "client")  
         })); 
      state.group_chat.current_message_chat = formatted_messages;
    },



    addDirectMessage(state, action) {
      state.direct_chat.current_messages.push(action.payload.message);
    },
    addChatDirectMessage(state, action) {
      state.group_chat. current_message_chat.push(action.payload.message);
    }
    
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const FetchDirectConversations = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchDirectConversations({ conversations }));
  };
};
export const AddDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectConversation({ conversation }));
  };
};
export const UpdateDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateDirectConversation({ conversation }));
  };
};

export const SetCurrentConversation = (current_conversation) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentConversation(current_conversation));
  };
};
export const SetCurrentChat = (current_chat) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentChat(current_chat));
  };
};


export const FetchCurrentMessages = ({messages}) => {
  return async(dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentMessages({messages}));
  }
}
export const fetchChatMessages = ({messages}) => {
  return async(dispatch, getState) => {
    dispatch(slice.actions.fetchChatMessages({messages}));
  }
}

export const AddDirectMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectMessage({message}));
  }
}
export const addChatDirectMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addChatDirectMessage({message}));
  }
}