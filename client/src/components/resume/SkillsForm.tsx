import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { type Skill, SkillCategory } from '../../types/resume.types';
import { AIEnhanceButton } from './AIEnhanceButton';
import { aiService } from '../../services/ai.service';

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

export const SkillsForm: React.FC<SkillsFormProps> = ({ data, onChange }) => {
  const [skills, setSkills] = useState<Skill[]>(data);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>(
    SkillCategory.TECHNICAL
  );
  const [jobDescription, setJobDescription] = useState('');

  const handleAdd = () => {
    if (!newSkillName.trim()) return;

    const newSkill: Skill = {
      name: newSkillName.trim(),
      category: newSkillCategory,
      order: skills.length,
    };

    const updated = [...skills, newSkill];
    setSkills(updated);
    onChange(updated);
    setNewSkillName('');
  };

  const handleRemove = (index: number) => {
    const updated = skills.filter((_, i) => i !== index);
    setSkills(updated);
    onChange(updated);
  };

  const handleSuggestSkills = async () => {
    if (!jobDescription.trim()) return;

    try {
      const suggestedSkills = await aiService.suggestSkills(jobDescription);
      
      const newSkills = suggestedSkills.map((skillName, index) => ({
        name: skillName,
        category: SkillCategory.TECHNICAL,
        order: skills.length + index,
      }));

      const updated = [...skills, ...newSkills];
      setSkills(updated);
      onChange(updated);
      setJobDescription('');
    } catch (error) {
      console.error('Skill suggestion failed:', error);
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || SkillCategory.OTHER;
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as Record<SkillCategory, Skill[]>);

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Skills
      </Typography>

      {/* Add Skill Section */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              label="Skill Name"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="e.g., React, Python, Leadership"
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
                label="Category"
              >
                {Object.values(SkillCategory).map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              disabled={!newSkillName.trim()}
            >
              Add Skill
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* AI Skill Suggestion */}
      <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          AI Skill Suggestions
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Paste a job description here to get AI-powered skill suggestions..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            size="small"
          />
          <Box sx={{ pt: 1 }}>
            <AIEnhanceButton
              onEnhance={handleSuggestSkills}
              label="Suggest Skills"
              disabled={!jobDescription.trim()}
            />
          </Box>
        </Box>
      </Box>

      {/* Display Skills by Category */}
      {Object.entries(groupedSkills).map(([category, categorySkills]) => (
        <Box key={category} sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            {category}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {categorySkills.map((skill, index) => (
              <Chip
                key={`${skill.name}-${index}`}
                label={skill.name}
                onDelete={() => {
                  const skillIndex = skills.findIndex((s) => s === skill);
                  handleRemove(skillIndex);
                }}
                deleteIcon={<DeleteIcon />}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>
      ))}

      {skills.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
          No skills added yet. Add your skills manually or use AI suggestions.
        </Typography>
      )}
    </Paper>
  );
};
