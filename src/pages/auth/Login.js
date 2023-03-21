import { Link as RouterLink } from "react-router-dom";
// sections
import { Stack, Typography } from "@mui/material";
import Login from "../../sections/auth/LoginForm";

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4" style={{textAlign:"center"}}>Login to wegoFleet messenger</Typography>

        <Stack direction="row" spacing={0.5}>

        </Stack>
      </Stack>
      {/* Form */}
      <Login />

    </>
  );
}
