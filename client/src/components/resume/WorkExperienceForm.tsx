import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Checkbox,
  FormControlLabel,
  Collapse,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import type { WorkExperience } from '../../types/resume.types';
import { RichTextEditor } from '../common/RichTextEditor';

interface WorkExperienceFormProps {
  data: WorkExperience[];
  onChange: (data: WorkExperience[]) => void;
}

export const WorkExperienceForm: React.FC<WorkExperienceFormProps> = ({
  data,
  onChange,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(
    new Set([0])
  );

  const toggleExpand = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const handleAdd = () => {
    const newExperience: WorkExperience = {
      companyName: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      order: data.length,
    };
    const newData = [...data, newExperience];
    onChange(newData);
    setExpandedItems(new Set([...expandedItems, data.length]));
  };

  const handleDelete = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    // Update order
    const reorderedData = newData.map((item, i) => ({
      ...item,
      order: i,
    }));
    onChange(reorderedData);
    
    // Remove from expanded items
    const newExpanded = new Set(expandedItems);
    newExpanded.delete(index);
    setExpandedItems(newExpanded);
  };

  const handleUpdate = (index: number, field: keyof WorkExperience, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      {/* Section Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Work Experience
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          size="small"
        >
          Add Experience
        </Button>
      </Box>

      {/* Experience Items */}
      {data.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
          No work experience added yet. Click "Add Experience" to get started.
        </Typography>
      ) : (
        data.map((exp, index) => (
          <Paper
            key={index}
            variant="outlined"
            sx={{
              p: 2,
              mb: 2,
              '&:last-child': { mb: 0 },
            }}
          >
            {/* Item Header with Expand/Collapse and Delete */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <IconButton
                  size="small"
                  onClick={() => toggleExpand(index)}
                  sx={{ p: 0.5 }}
                >
                  {expandedItems.has(index) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
                <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                  {exp.position || 'New Position'} {exp.companyName && `@ ${exp.companyName}`}
                </Typography>
              </Box>
              
              {/* Delete Button - Properly positioned */}
              <IconButton
                color="error"
                size="small"
                onClick={() => handleDelete(index)}
                sx={{ 
                  ml: 2,
                  flexShrink: 0, // Prevent shrinking
                }}
                aria-label="Delete experience"
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            {/* Collapsible Form Fields */}
            <Collapse in={expandedItems.has(index)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Row 1: Position and Company Name */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Position / Title"
                    value={exp.position}
                    onChange={(e) => handleUpdate(index, 'position', e.target.value)}
                    fullWidth
                    required
                    size="small"
                  />
                  <TextField
                    label="Company Name"
                    value={exp.companyName}
                    onChange={(e) => handleUpdate(index, 'companyName', e.target.value)}
                    fullWidth
                    required
                    size="small"
                  />
                </Box>

                {/* Row 2: Start Date and End Date */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <TextField
                    label="Start Date"
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => handleUpdate(index, 'startDate', e.target.value)}
                    fullWidth
                    required
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    label="End Date"
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => handleUpdate(index, 'endDate', e.target.value)}
                    fullWidth
                    disabled={exp.current}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>

                {/* Row 3: Current Position Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exp.current}
                      onChange={(e) => {
                        handleUpdate(index, 'current', e.target.checked);
                        if (e.target.checked) {
                          handleUpdate(index, 'endDate', '');
                        }
                      }}
                    />
                  }
                  label="I currently work here"
                />

                {/* Row 4: Description (Rich Text Editor) */}
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    Description
                  </Typography>
                  <RichTextEditor
                    value={exp.description}
                    onChange={(value) => handleUpdate(index, 'description', value)}
                    placeholder="Describe your responsibilities, achievements, and impact..."
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Use bullet points to highlight key achievements and responsibilities
                  </Typography>
                </Box>
              </Box>
            </Collapse>
          </Paper>
        ))
      )}
    </Paper>
  );
};
