import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Autocomplete, TextField } from '@mui/material';

// ----------------------------------------------------------------------

RHFAutocomplete.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
  id: PropTypes.string,

};

export default function RHFAutocomplete({name, label, helperText,...other }) {
  const { control, setValue } = useFormContext();
  

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Autocomplete
          {...field}
          onChange={(event, newValue) => setValue(name, newValue, { shouldValidate: true })}
          renderInput={(params) => (
            <TextField
              label={label}
              error={!!error}
              helperText={error ? error?.message : helperText}
              {...params}
            />
          )}
          getOptionSelected={(option, value) =>
               (option.id_driver && value?.id_driver && option.id_driver === value?.id_driver) || 
               (option.id_admin && value.id_admin && option.id_admin === value.id_admin) || 
               (option.id_client && value.id_client && option.id_client === value.id_client)}

          
             getOptionLabel={(option) =>
               option.name + (option.id_driver ? " (Driver)" : "") + (option.id_admin ? " (Admin)" : "") + (option.id_client ? " (Client)" : "")
             }

          {...other}
        />
      )}
    />
  );
}
