/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  Checkbox,
  FormControlLabel,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { Education } from '../../types/resume.types';

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export const EducationForm: React.FC<EducationFormProps> = ({ data, onChange }) => {
  const [educationList, setEducationList] = useState<Education[]>(data);

  const handleAdd = () => {
    const newEducation: Education = {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      order: educationList.length,
    };
    const updated = [...educationList, newEducation];
    setEducationList(updated);
    onChange(updated);
  };

  const handleRemove = (index: number) => {
    const updated = educationList.filter((_, i) => i !== index);
    setEducationList(updated);
    onChange(updated);
  };

  const handleChange = (index: number, field: keyof Education, value: any) => {
    const updated = [...educationList];
    updated[index] = { ...updated[index], [field]: value };
    setEducationList(updated);
    onChange(updated);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Education</Typography>
        <Button startIcon={<AddIcon />} onClick={handleAdd} variant="contained">
          Add Education
        </Button>
      </Box>

      {educationList.map((edu, index) => (
        <Box key={index} sx={{ mb: 3 }}>
          {index > 0 && <Divider sx={{ my: 3 }} />}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="subtitle1" color="primary">
              Education #{index + 1}
            </Typography>
            <IconButton
              onClick={() => handleRemove(index)}
              color="error"
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Institution"
                value={edu.institution}
                onChange={(e) => handleChange(index, 'institution', e.target.value)}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Degree"
                value={edu.degree}
                onChange={(e) => handleChange(index, 'degree', e.target.value)}
                required
                placeholder="Bachelor of Science"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Field of Study"
                value={edu.fieldOfStudy}
                onChange={(e) => handleChange(index, 'fieldOfStudy', e.target.value)}
                placeholder="Computer Science"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={edu.startDate}
                onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="End Date"
                type="date"
                value={edu.endDate}
                onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
                disabled={edu.current}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={edu.current}
                    onChange={(e) => handleChange(index, 'current', e.target.checked)}
                  />
                }
                label="Currently Studying"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description (Optional)"
                multiline
                rows={2}
                value={edu.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                placeholder="GPA, honors, relevant coursework..."
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      {educationList.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
          No education added yet. Click "Add Education" to get started.
        </Typography>
      )}
    </Paper>
  );
};
