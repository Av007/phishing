import React from 'react';
import { IconButton, Stack, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SendIcon from '@mui/icons-material/Send';
import { api } from '../helpers/api';

interface TrackActionsProps {
  trackId: string;
  endpointUrl: string;
}

export const TrackActions: React.FC<TrackActionsProps> = ({ trackId, endpointUrl }) => {
  const link = `${endpointUrl}/track/${trackId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch (err) {
      console.error('Failed to copy link: ', err);
    }
  };

  const handleSend = async () => {
    await api.post('api/send', {trackId});
  };

  return (
    <Stack direction="row" spacing={1}>
      <Tooltip title="Copy link">
        <IconButton onClick={handleCopy}>
          <ContentCopyIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Send">
        <IconButton onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};
