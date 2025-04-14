import React from 'react';
import { Chip } from '@mui/material';

export enum PhishingStatus {
    PENDING = 'pending',
    SENDING = 'sending',
    CLICKED = 'clicked',
    FAILED = 'failed',
  }

interface StatusChipProps {
  status: PhishingStatus;
}

const statusColors: Record<PhishingStatus, 'default' | 'primary' | 'success' | 'error' | 'warning'> = {
  [PhishingStatus.PENDING]: 'default',
  [PhishingStatus.SENDING]: 'primary',
  [PhishingStatus.CLICKED]: 'success',
  [PhishingStatus.FAILED]: 'error',
};

const StatusChip: React.FC<StatusChipProps> = ({ status }) => {
  const chipColor = statusColors[status] || 'default';

  return (
    <Chip
      label={status.charAt(0).toUpperCase() + status.slice(1)}
      color={chipColor}
      size="small"
    />
  );
};

export default StatusChip;
