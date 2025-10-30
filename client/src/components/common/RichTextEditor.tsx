import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Box, FormLabel, FormHelperText } from '@mui/material';

interface RichTextEditorProps {
  /** Current value of the editor */
  value: string;
  /** Callback when content changes */
  onChange: (value: string) => void;
  /** Label for the editor */
  label?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Helper text shown below editor */
  helperText?: string;
  /** Whether the field has an error */
  error?: boolean;
  /** Minimum height of editor */
  minHeight?: number;
}

/**
 * RichTextEditor - A formatted text editor component
 * Provides toolbar with formatting options (bold, italic, lists, etc.)
 * Used for work experience descriptions and other formatted text
 */
export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Enter description...',
  helperText,
  error = false,
  minHeight = 150,
}) => {
  /**
   * Quill editor modules configuration
   * Defines which formatting tools are available in the toolbar
   */
  const modules = {
    toolbar: [
      // Text formatting
      ['bold', 'italic', 'underline'],
      
      // Lists
      [{ list: 'ordered' }, { list: 'bullet' }],
      
      // Indentation
      [{ indent: '-1' }, { indent: '+1' }],
      
      // Clear formatting
      ['clean'],
    ],
  };

  /**
   * Formats allowed in the editor
   * Restricts to only the formats we want to support
   */
  const formats = [
    'bold',
    'italic',
    'underline',
    'list',
    'bullet',
    'indent',
  ];

  return (
    <Box sx={{ mb: 2 }}>
      {/* Label */}
      {label && (
        <FormLabel
          sx={{
            display: 'block',
            mb: 1,
            fontWeight: 500,
            fontSize: '0.875rem',
            color: error ? 'error.main' : 'text.primary',
          }}
        >
          {label}
        </FormLabel>
      )}

      {/* Rich Text Editor */}
      <Box
        sx={{
          // Container styling
          border: '1px solid',
          borderColor: error ? 'error.main' : 'divider',
          borderRadius: 1,
          overflow: 'hidden',
          
          // Editor styling
          '& .quill': {
            backgroundColor: 'background.paper',
          },
          
          // Toolbar styling
          '& .ql-toolbar': {
            backgroundColor: 'background.default',
            borderBottom: '1px solid',
            borderColor: 'divider',
            borderTop: 'none',
            borderLeft: 'none',
            borderRight: 'none',
          },
          
          // Editor content area styling
          '& .ql-container': {
            border: 'none',
            minHeight: `${minHeight}px`,
            fontSize: '0.875rem',
            fontFamily: 'inherit',
          },
          
          // Placeholder styling
          '& .ql-editor.ql-blank::before': {
            color: 'text.secondary',
            fontStyle: 'normal',
          },
          
          // Focus state
          '&:focus-within': {
            borderColor: error ? 'error.main' : 'primary.main',
            outline: error ? 'none' : '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
          },
        }}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
        />
      </Box>

      {/* Helper Text */}
      {helperText && (
        <FormHelperText error={error} sx={{ mx: 1.75, mt: 0.5 }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};
