import React, { useState } from "react";
import * as Yup from "yup";
import { Button, Dialog, DialogContent, DialogTitle, Slide, Stack,} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import FormProvider from "../../components/hook-form/FormProvider";
import { RHFTextField } from "../../components/hook-form";
import RHFAutocomplete from "../../components/hook-form/RHFAutocomplete";
import { useSelector } from "react-redux";
import { connectSocket, socket } from "../../socket";


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});



const CreateGroupForm = ({ handleClose }) => {
  const auth = useSelector((state)=>state.auth)
  const app = useSelector((state)=> console.log(state))

  const [GroupsExixest, setGroupsExixest] = useState([])
  const NewGroupSchema = Yup.object().shape({
    name: Yup.string().required("Title is required"),
    members: Yup.array().min(2, "Must have at least 2 members"),
  });

  const defaultValues = {
    name: "",

    tags: [],
  };
  if (!socket) {
    connectSocket(auth.user_id);
  }



  const Id_Creation = {};
  switch (auth.type) {
    case "driver":
      Id_Creation.id_driver = auth.user_id      ;
      break;
    case "client":
      Id_Creation.id_client = auth.user_id;
      break;
    case "admin":
      Id_Creation.id_admin = auth.user_id;
      break;
    case "company":
      Id_Creation.id_company = auth.id;
      break;
    default:
      Id_Creation.id_notExisted = 1;
      break;
  }

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data) => {
    console.log(data)
    try {
        data.members.push(Id_Creation)
        socket.emit("join-room", data, setGroupsExixest)
        socket.on('createRoom',(data)=>{
          console.log(data)
          alert(`${data.name} group was created successfully !`)
        })
   
      } catch (error) {
      console.error(error);
    }
  };


  const {Admins , Drivers ,Clients} =useSelector((state)=>state.app)
  const mergedArray = [
  ...Admins.map((item) => ({ ...item, enum: "Admins" })),
  ...Drivers.map((item) => ({ ...item, enum: "Drivers" })),
  ...Clients.map((item) => ({ ...item, enum: "Clients" }))
];


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="name" label="name" />
        <RHFAutocomplete
          name="members"
          label="Members"
          multiple
          freeSolo
          options={ mergedArray?.map((client,id) => ({
            id:id,
            name: client.fullName,
            ...(client.id_driver && { id_driver: client.id_driver }),
            ...(client.id_admin && { id_admin: client.id_admin }),
            ...(client.id_client && { id_client: client.id_client })
          }))}
          ChipProps={{ size: "medium" }}
        />
        <Stack spacing={2} direction={"row"} alignItems="center" justifyContent={"end"}  >   <Button onClick={handleClose}>Cancel</Button>   <Button type="submit" variant="contained" >     Create   </Button> </Stack>
      </Stack>
    </FormProvider>
  );
};

const CreateGroup = ({ open, handleClose }) => {
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
      <DialogTitle>{"Create New Group"}
      
      </DialogTitle>

      <DialogContent sx={{ mt: 4 }}>
        {/* Create Group Form */}
       <CreateGroupForm handleClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroup;
