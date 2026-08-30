import { useState, useCallback, useEffect, useMemo, ChangeEvent } from 'react';
import _ from 'lodash';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridRowModel,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import {
  AppBar,
  Toolbar,
  Box,
  Link,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
} from '@mui/material';
import { useAuth } from '../provider/AuthProvider';
import { api, apiSimulation } from '../helpers/api';
import StatusChip, { PhishingStatus } from '../components/Status';
import { TrackActions } from '../components/TrackActions';
import { getEnvsUrl } from '../helpers/envs';

const Homepage = () => {
  const { token } = useAuth();
  const [username] = useState(localStorage.getItem('email'));
  const [data, setData] = useState<GridRowModel[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [open, setOpen] = useState(false);

  const simulationUrl = getEnvsUrl('VITE_SIMULATION_URL');

  const columns: GridColDef[] = useMemo(
    () => [
      { field: '_id', headerName: 'ID' },
      { field: 'email', headerName: 'email', width: 200 },
      {
        field: 'status',
        headerName: 'Status',
        type: 'string',
        renderCell: (params: GridRenderCellParams) => (
          <StatusChip status={params.value as PhishingStatus} />
        ),
      },
      {
        field: 'trackId',
        headerName: 'Link',
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams) => (
          <TrackActions trackId={params.value as string} endpointUrl={simulationUrl} id={params.row._id as string} />
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        width: 200,
        renderCell: (params: GridRenderCellParams) => {
          const past = Temporal.Instant.from(params.value as string);
          const now = Temporal.Now.instant();
          const duration = past.until(now);
          const totalSeconds = duration.total({ unit: 'seconds' });
          const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
          if (totalSeconds >= 86400) return rtf.format(-Math.round(totalSeconds / 86400), 'day');
          if (totalSeconds >= 3600) return rtf.format(-Math.round(totalSeconds / 3600), 'hour');
          if (totalSeconds >= 60) return rtf.format(-Math.round(totalSeconds / 60), 'minute');
          return rtf.format(-Math.round(totalSeconds), 'second');
        },
      },
    ],
    [simulationUrl],
  );

  const fetchResults = useCallback(
    _.debounce(() => {
      api
        .get('api/phishing', { params: {} })
        .then((response) => {
          const { data } = response;
          setData(
            data.map((item: any) => ({
              ...item,
              id: item._id,
            })),
          );
        })
        .catch((error) => {
          console.error('API Error:', error);
        });
    }, 500),
    [token],
  );

  useEffect(() => {
    fetchResults();
    const interval = setInterval(() => {
      if (open || openConfirm) {
        return;
      }
      fetchResults();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchResults, open, openConfirm]);
  

  const rowSelected = (newRowSelectionModel: any) => {
    setSelected(newRowSelectionModel);
  };

  function update() {
    fetchResults()
  }
  

  const CustomToolbar = () => {
    const [emailInput, setEmailInput] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
      setOpen(false);
      setEmailInput('');
    };

    const handleAddEmails = async () => {
      await apiSimulation.post('api/phishing/send', { emails: emailInput });

      update();
      handleClose();
    };

    const handleBulkSend = () => {
      if (selected.length === 0) {
        return;
      }
      setOpenConfirm(true);
    };

    const confirmSend = async () => {
      await api.post('api/bulk/send', {ids: selected});
      setOpenConfirm(false);
      update();
    };

    const cancelSend = () => setOpenConfirm(false);

    return (
      <>
        <GridToolbarContainer>
          <Button
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            style={{ marginLeft: 'auto' }}
          >
            Add emails
          </Button>

          <Button
            color="primary"
            startIcon={<SendIcon />}
            onClick={handleBulkSend}
          >
            Bulk send
          </Button>
        </GridToolbarContainer>

        <Dialog open={openConfirm} onClose={cancelSend}>
          <DialogTitle>Confirm Bulk Send</DialogTitle>
          <DialogContent>
            Are you sure you want to send to {selected.length} recipient(s)?
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelSend}>Cancel</Button>
            <Button onClick={confirmSend} color="primary" variant="contained">
              Send
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>Add Emails</DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Enter emails (comma-separated)"
                multiline
                rows={3}
                fullWidth
                value={emailInput}
                onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setEmailInput(e.target.value)}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleAddEmails}
              disabled={!emailInput}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  };

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Box display="flex" alignItems="center" gap={2}>
            {token && (
              <Chip
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  backgroundColor: 'transparent',
                }}
                label={username}
                variant="outlined"
              />
            )}
            <Link
              sx={{
                color: 'white',
                textDecoration: 'none',
                fontWeight: 'bold',
                ':hover': { color: 'lightgray' },
              }}
              href="/logout"
            >
              Logout
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: '100%' }}>
        <DataGrid
          initialState={{
            filter: {
              filterModel: {
                items: [],
              },
            },
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          filterMode="server"
          slots={{ toolbar: CustomToolbar }}
          onRowSelectionModelChange={rowSelected}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          rows={data}
          columns={columns}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Box>
    </>
  );
};

export default Homepage;
