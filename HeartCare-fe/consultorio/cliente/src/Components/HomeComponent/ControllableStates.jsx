import React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const ControllableStates = ({ value, onChange, options, labelName, readOnly }) => {
  return (
    <div>
      <br />
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (!readOnly) onChange(newValue);
        }}
        options={options}
        sx={{
          width: 300,
          '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4dc869',
          },
          '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4dc869',
          },
          '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4dc869',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#4dc869',
          },
        }}
        renderInput={(params) => <TextField {...params} label={labelName} />}
        disabled={readOnly}
      />
    </div>
  );
};

export default ControllableStates;
