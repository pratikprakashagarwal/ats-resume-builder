import React, { useState } from 'react';
import { Button, CircularProgress, Tooltip } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

interface AIEnhanceButtonProps {
  /** Async function to call when button is clicked */
  onEnhance: () => Promise<void>;
  /** Button label text */
  label?: string;
  /** Whether the button should be disabled */
  disabled?: boolean;
  /** Tooltip text to show on hover */
  tooltip?: string;
}

/**
 * AIEnhanceButton - Reusable button component for AI enhancement features
 * Automatically handles loading states and error display
 * @example
 * <AIEnhanceButton
 *   onEnhance={handleGenerateSummary}
 *   label="Generate with AI"
 *   tooltip="Use AI to generate a professional summary"
 * />
 */
export const AIEnhanceButton: React.FC<AIEnhanceButtonProps> = ({
  onEnhance,
  label = 'Enhance with AI',
  disabled = false,
  tooltip = 'Click to enhance with AI',
}) => {
  // Track loading state locally
  const [loading, setLoading] = useState(false);

  /**
   * Handles button click and manages loading state
   * Ensures loading state is cleared even if operation fails
   */
  const handleClick = async () => {
    setLoading(true);
    try {
      await onEnhance();
    } catch (error) {
      console.error('AI enhancement failed:', error);
      // Error is handled by parent component
    } finally {
      // Always clear loading state
      setLoading(false);
    }
  };

  return (
    <Tooltip title={disabled ? 'Feature disabled' : tooltip} arrow>
      <span> {/* Wrapper needed for disabled button tooltip */}
        <Button
          variant="outlined"
          color="secondary"
          startIcon={loading ? <CircularProgress size={16} /> : <AutoFixHighIcon />}
          onClick={handleClick}
          disabled={loading || disabled}
          size="small"
          sx={{
            minWidth: '140px', // Prevent layout shift when text changes
            transition: 'all 0.2s', // Smooth transitions
          }}
        >
          {loading ? 'Enhancing...' : label}
        </Button>
      </span>
    </Tooltip>
  );
};
