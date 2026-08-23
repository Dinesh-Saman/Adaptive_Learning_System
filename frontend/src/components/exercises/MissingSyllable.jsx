import React, { useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';

export default function MissingSyllable({ question, onSubmit }) {
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(false);

  const handleOptionClick = (opt) => {
    setSelected(opt);
    if (opt === question.answer) {
      setError(false);
      setTimeout(() => onSubmit(true), 1000);
    } else {
      setError(true);
      setTimeout(() => {
        setError(false);
        setSelected(null);
      }, 1000);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>ක්‍රියාකාරකම: රූපය බලා නිවැරදි මුල් අක්ෂර කොටස තෝරන්න</Typography>
      
      {/* Options */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4, justifyContent: 'center' }}>
        {question.options.map(opt => (
          <Button 
            key={opt}
            variant={selected === opt ? "contained" : "outlined"}
            color={error && selected === opt ? "error" : (selected === opt ? "success" : "primary")}
            onClick={() => handleOptionClick(opt)}
            sx={{ fontSize: '1.5rem', minWidth: 60, borderRadius: 2 }}
          >
            {opt}
          </Button>
        ))}
      </Box>

      {/* Target Word & Pic */}
      <Paper elevation={2} sx={{ display: 'flex', alignItems: 'center', p: 3, maxWidth: 400, mx: 'auto', borderRadius: 2 }}>
        <Typography variant="h4" sx={{ minWidth: 60, borderBottom: '2px solid', borderColor: selected ? 'success.main' : 'text.primary', textAlign: 'center', pb: 1, mr: 1, color: selected ? 'success.main' : 'text.primary' }}>
          {selected || "___"}
        </Typography>
        <Typography variant="h4" sx={{ mr: 4 }}>
          {question.word_suffix}
        </Typography>
        <Box component="img" src={question.image} sx={{ width: 100, height: 100, objectFit: 'contain' }} />
      </Paper>
    </Box>
  );
}
