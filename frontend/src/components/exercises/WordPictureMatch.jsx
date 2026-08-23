import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid } from '@mui/material';

export default function WordPictureMatch({ question, onSubmit }) {
  const [words, setWords] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [matches, setMatches] = useState({}); // { picUrl: matchedWord }
  const [errorPic, setErrorPic] = useState(null);

  useEffect(() => {
    // Reset state when question changes
    setWords([...question.words].sort(() => Math.random() - 0.5));
    setPictures([...question.pictures].sort(() => Math.random() - 0.5));
    setSelectedWord(null);
    setMatches({});
    setErrorPic(null);
  }, [question]);

  const handleWordClick = (word) => {
    // Don't select if already matched
    if (Object.values(matches).includes(word)) return;
    setSelectedWord(word);
  };

  const handlePicClick = (pic) => {
    if (!selectedWord) return;
    
    // Check if match is correct
    const isCorrect = question.pairs[selectedWord] === pic;
    
    if (isCorrect) {
      setMatches(prev => ({ ...prev, [pic]: selectedWord }));
      setSelectedWord(null);
      setErrorPic(null);
    } else {
      // Wrong match
      setErrorPic(pic);
      setTimeout(() => setErrorPic(null), 1000);
    }
  };

  useEffect(() => {
    // Check if all matched
    if (question && Object.keys(matches).length > 0 && Object.keys(matches).length === question.words.length) {
      // Complete! Tell parent it was correct
      const timer = setTimeout(() => onSubmit(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [matches, question, onSubmit]);

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>{question.type === 'WordPictureMatch' ? 'ක්‍රියාකාරකම: රූපයට ගැළපෙන වචනය තෝරන්න' : 'Match'}</Typography>
      
      {/* Word Bank */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        {words.map(w => {
          const isMatched = Object.values(matches).includes(w);
          return (
            <Button 
              key={w} 
              variant={selectedWord === w ? "contained" : "outlined"}
              color={isMatched ? "success" : "primary"}
              disabled={isMatched}
              onClick={() => handleWordClick(w)}
              sx={{ borderRadius: 4, textTransform: 'none', fontSize: '1.2rem' }}
            >
              {w}
            </Button>
          )
        })}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Tap a word above, then tap the matching picture.
      </Typography>

      {/* Pictures List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {pictures.map(pic => {
          const matchedWord = matches[pic];
          const isError = errorPic === pic;
          
          return (
            <Paper 
              key={pic} 
              variant="outlined" 
              sx={{ 
                display: 'flex', alignItems: 'center', p: 1, 
                borderColor: isError ? 'error.main' : (matchedWord ? 'success.main' : 'divider'),
                borderWidth: 2
              }}
            >
              <Box 
                component="img" 
                src={pic} 
                alt="pic" 
                sx={{ width: 80, height: 80, objectFit: 'contain', mr: 2, borderRadius: 1 }} 
              />
              
              <Box 
                onClick={() => !matchedWord && handlePicClick(pic)}
                sx={{ 
                  flex: 1, 
                  p: 2, 
                  border: '1px dashed', 
                  borderColor: matchedWord ? 'transparent' : 'grey.400',
                  bgcolor: matchedWord ? 'success.light' : 'transparent',
                  borderRadius: 1,
                  cursor: matchedWord ? 'default' : 'pointer',
                  textAlign: 'center'
                }}
              >
                {matchedWord ? (
                  <Typography variant="h6" color="success.contrastText">{matchedWord}</Typography>
                ) : (
                  <Typography variant="body1" color="text.secondary">Tap to assign word</Typography>
                )}
              </Box>
            </Paper>
          )
        })}
      </Box>
    </Box>
  );
}
