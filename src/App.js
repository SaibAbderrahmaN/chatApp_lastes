
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ThemeSettings from "./components/settings";
import ThemeProvider from "./theme";
import Router from "./routes";
import { closeSnackBar, showSnackbar } from "./redux/slices/app";
import "./style.css"
import { socket ,connectSocket} from "./socket";
import { FetchDirectConversations } from "./redux/slices/conversation";
const vertical = "bottom";
const horizontal = "center";

const Alert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

function App() {
  const dispatch = useDispatch();


  const { user_id ,type } = useSelector(
    (state) => state.auth
  );
  if (!socket) {
    connectSocket(user_id);
  }
  useEffect(() => {
    socket.emit("user_connect" ,{ id:user_id ,type } ,(data)=>{
        dispatch(FetchDirectConversations({ conversations: data }))
    })

  }, [socket])

  
  const { severity, message, open } = useSelector(
    (state) => state.app.snackbar
  );
  return (
    <>
      <ThemeProvider>
        <ThemeSettings>
          {" "}
          <Router />{" "}
        </ThemeSettings>
      </ThemeProvider>

      {message && open ? (
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          autoHideDuration={4000}
          key={vertical + horizontal}
          onClose={() => {
            console.log("This is clicked");
            dispatch(closeSnackBar());
          }}
        >
          <Alert
            onClose={() => {
              console.log("This is clicked");
              dispatch(closeSnackBar());
            }}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
    </>
  );
}

export default App;
