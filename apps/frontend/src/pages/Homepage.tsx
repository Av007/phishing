import { useState, useCallback, useEffect, useMemo } from 'react';
import { formatDistance } from 'date-fns';
import _ from 'lodash';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import {
  DataGrid,
  GridRowModel,
  GridRowModesModel,
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
import StatusChip, { PhishingStatus } from '../components/status';
import { TrackActions } from '../components/TrackActions';
import { getEnvsUrl } from '../helpers/envs';

const Homepage = () => {
  const { token } = useAuth();
  const [username] = useState(localStorage.getItem('email'));
  const [data, setData] = useState<GridRowModel[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const simulationUrl = getEnvsUrl('VITE_SIMULATION_URL');

  const columns = useMemo(
    () => [
      { field: '_id', headerName: 'ID' },
      { field: 'email', headerName: 'email', width: 200 },
      {
        field: 'status',
        headerName: 'Status',
        renderCell: (params: { value: PhishingStatus }) => (
          <StatusChip status={params.value} />
        ),
      },
      {
        field: 'trackId',
        headerName: 'Link',
        sortable: false,
        filterable: false,
        renderCell: (params: { value: string }) => (
          <TrackActions trackId={params.value} endpointUrl={simulationUrl} />
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Created',
        width: 200,
        renderCell: (param: { value: string }) =>
          formatDistance(param.value, Date.now(), {
            addSuffix: true,
          }),
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
      fetchResults();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchResults]);
  

  const rowSelected = async (newRowSelectionModel: any) => {
    for (const item of newRowSelectionModel) {
      if (!selected.includes(item)) {
        setSelected(newRowSelectionModel);
      }
    }
  };

  const CustomToolbar = () => {
    const [open, setOpen] = useState(false);
    const [emailInput, setEmailInput] = useState('');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
      setOpen(false);
      setEmailInput('');
    };

    const handleAddEmails = async () => {
      await apiSimulation.post('phishing/send', { emails: emailInput });

      fetchResults();
      handleClose();
    };

    const handleBulkSend = () => {
      if (selected.length === 0) {
        return;
      }
      setOpenConfirm(true);
    };

    const confirmSend = async () => {
      await api.post('api/bulk/send', {trackIds: selected});
      fetchResults();
      setOpenConfirm(false);
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
                onChange={(e) => setEmailInput(e.target.value)}
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
          onRowModesModelChange={setRowModesModel}
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
