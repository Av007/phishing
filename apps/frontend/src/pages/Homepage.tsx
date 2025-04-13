import { useState, useCallback } from 'react';
import axios from 'axios';
import _ from 'lodash';
import AddIcon from '@mui/icons-material/Add';
import {
  DataGrid,
  GridRowModel,
  GridRowModes,
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

const Homepage = () => {
  const { token } = useAuth();
  const [username] = useState(localStorage.getItem('email'));
  const [data, setData] = useState<GridRowModel[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

  const columns = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'description', headerName: 'Description', width: 300 },
    { field: 'price', headerName: 'Price' },
    { field: 'stock', headerName: 'Stock' },
  ];

  const fetchResults = useCallback(
    _.debounce(() => {
      api
        .get('api/products', {
          params: {},
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
        .then((response) => {
          const items = response?.data || [];
          setData(items);
        })
        .catch((error) => {
          console.error('API Error:', error);
        });
    }, 500),
    [token],
  );

  const rowSelected = async (newRowSelectionModel: any) => {
    for (const item of newRowSelectionModel) {
      if (!selected.includes(item)) {
        setSelected(newRowSelectionModel);

        await apiSimulation.put(
          'phishing/send',
          { emails: '' },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          },
        );
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
      const emails = emailInput
        .split(',')
        .map((email) => email.trim())
        .filter((email) => email.length > 0);

      const {data} = await apiSimulation.post('phishing/send', { emails });

      // TODO: add request

      setRowModesModel((oldModel) => {
        const updatedModel = { ...oldModel };
        newRows.forEach((row) => {
          updatedModel[row.id] = {
            mode: GridRowModes.Edit,
            fieldToFocus: 'name',
          };
        });
        return updatedModel;
      });

      handleClose();
    };

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
        </GridToolbarContainer>

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
