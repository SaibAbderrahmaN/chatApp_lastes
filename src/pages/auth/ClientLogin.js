import { Link as RouterLink } from "react-router-dom";
// sections
import { Stack, Typography } from "@mui/material";
import ClientLoginForm from "../../sections/auth/ClientLoginForm";

// ----------------------------------------------------------------------

export default function ClientLogin() {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4" style={{textAlign:"center"}}>Login to wegoFleet messenger as a client </Typography>

        <Stack direction="row" spacing={0.5}>

        </Stack>
      </Stack>
      {/* Form */}
      <ClientLoginForm/>

    </>
  );
}
