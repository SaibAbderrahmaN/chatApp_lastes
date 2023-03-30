import { Link as RouterLink } from "react-router-dom";
// sections
import { Stack, Typography } from "@mui/material";
import AdminForm from "../../sections/auth/AdminForm";

// ----------------------------------------------------------------------

export default function AdminLogin() {
  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: "relative" }}>
        <Typography variant="h4" style={{textAlign:"center"}}>Login to wegoFleet messenger as an admin </Typography>

        <Stack direction="row" spacing={0.5}>

        </Stack>
      </Stack>
      {/* Form */}
      <AdminForm  />

    </>
  );
}
