/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import type { PersonalInfo } from '../../types/resume.types';
import { AIEnhanceButton } from './AIEnhanceButton';
import { aiService } from '../../services/ai.service';

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ data, onChange }) => {
  const [localData, setLocalData] = useState<PersonalInfo>(data);
  const [aiError, setAiError] = useState<string>('');

  useEffect(() => {
    setLocalData(data);
  }, [data]);

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    const updated = { ...localData, [field]: value };
    setLocalData(updated);
    onChange(updated);
  };

  const handleGenerateSummary = async () => {
    if (!localData.fullName) {
      setAiError('Please enter your name first');
      return;
    }

    try {
      setAiError('');
      const jobTitle = localData.fullName.split(' ')[0] || 'Professional';
      const summary = await aiService.generateSummary(jobTitle);
      handleChange('summary', summary);
    } catch (error: any) {
      setAiError(error.response?.data?.message || 'AI service unavailable');
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Personal Information
      </Typography>

      {aiError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setAiError('')}>
          {aiError}
        </Alert>
      )}

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Full Name"
            value={localData.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={localData.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            required
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Phone"
            value={localData.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Location"
            value={localData.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="City, State"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="LinkedIn"
            value={localData.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="linkedin.com/in/yourprofile"
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Website / Portfolio"
            value={localData.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="yourwebsite.com"
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              label="Professional Summary"
              multiline
              rows={4}
              value={localData.summary || ''}
              onChange={(e) => handleChange('summary', e.target.value)}
              placeholder="Brief professional summary highlighting your key skills and experience..."
            />
            <Box sx={{ pt: 1 }}>
              <AIEnhanceButton
                onEnhance={handleGenerateSummary}
                label="Generate"
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
