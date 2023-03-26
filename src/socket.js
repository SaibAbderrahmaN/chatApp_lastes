import io from "socket.io-client";

let socket;

const connectSocket = (user_id) => {
  socket = io("http://localhost:3000", {
    "transports": [ "websocket", "polling" ],
    "extraHeaders": {
      "ApiKey": "uQvkv3xmMxuQ1urZceYP8aHoF34mkcmI"
    }, 
    query: {
      user_id: window.localStorage.getItem("user_id"),
      type: window.localStorage.getItem("type")
    }
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected: ${reason}`);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
    // Possibly attempt to reconnect the socket here
  });
};

export { socket, connectSocket };


/*import io from "socket.io-client"; // Add this

let socket;

const connectSocket = (user_id) => {
  socket = io("http://localhost:3000", {
    "transports": [ "websocket","polling"],
    "extraHeaders": {
     "ApiKey": "uQvkv3xmMxuQ1urZceYP8aHoF34mkcmI"
      }, 
    query: {user_id:window.localStorage.getItem("user_id") , type:window.localStorage.getItem("type")},
  });
} // Add this -- our server will run on port 4000, so we connect to it from here

export {socket, connectSocket};

*/
/*




import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

function NotificationSound() {
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const audioRef = useRef(null);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('notification', () => {
      setHasNewNotification(true);
    });
  }, []);

  useEffect(() => {
    if (hasNewNotification) {
      audioRef.current.play();
    }
  }, [hasNewNotification]);

  function handleNewNotification() {
    socketRef.current.emit('new-notification');

    // Reset notification after 3 seconds
    setTimeout(() => {
      setHasNewNotification(false);
    }, 3000);
  }

  return (
    <div>
      {hasNewNotification && <p>New notification received!</p>}
      <button onClick={handleNewNotification}>Trigger Notification</button>
      <audio ref={audioRef} src="path/to/notification-sound.mp3" />
    </div>
  );
}

export default NotificationSound; */