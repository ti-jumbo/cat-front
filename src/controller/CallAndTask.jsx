import { Box, Dialog, DialogTitle, DialogContent, IconButton, Typography, Button, Grid, Snackbar, Alert, FormControl, InputLabel, Select, MenuItem, TextField, Icon, DialogActions, Stack } from "@mui/material";
import { DataGrid, GridMenuIcon } from "@mui/x-data-grid";
import { useEffect, useState, useCallback } from "react";
import InfoIcon from "@mui/icons-material/Info";
import SaveIcon from '@mui/icons-material/Save';
import Cancel from '@mui/icons-material/Cancel'
import {
  renderEditStatus,
  renderStatus,
  STATUS_OPTIONS,
} from "../component/status";
import { hasValue } from "@aalencarv/common-utils";
import { LocalizationProvider } from "@toolpad/core/AppProvider";


export default function CallAndTask({ pathname }) {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [infId, setInfId] = useState();
  const [software, setSoftware] = useState('');
  const [priority, setPriority] = useState();
  const [optionSetor, setOptionSetor] = useState('');
  const [opcaoContato, setOpcaoContato] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState()


  const softwares = [
    "Sinergia 1.0",
    "Sinergia 2.0", 
    "Winthor",
    "Ion Vendas",
    "Ion Rotas",
    "Sistema de chamado",
  ];

  const setores = [
    "Administrativo",
    "Vendas",
    "Logistica",
    "TI",
  ]

  const formaContato = [
    "Ligação",
    "Mensagem",
    "E-mail",
  ]

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://${process.env.REACT_APP_IP_DEV_BACK}/api/tickets/gettickets`);
      if (!response.ok) {
        throw new Error("Failed to fetch tickets");
      }
      const data = await response.json();
      setRows(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleOpenDialog = (ticket) => {
    setSelectedTicket(ticket);
    if (selectedTicket) {
      setInfId(selectedTicket.id)
      setSoftware(selectedTicket.product)
      setOptionSetor(selectedTicket.sector)
      setOpcaoContato(selectedTicket.contactWay)
      setStatus(selectedTicket.status)
      setSubject(selectedTicket.title)
      setPriority(selectedTicket.priority)
      setContactInfo(selectedTicket.contact)
      setDescription(selectedTicket.description)



      setOpenDialog(true);
    }

  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTicket(null);
  };

  const handleCellEditCommit = useCallback(async () => {
    
      try {
        const response = await fetch(
          `http://${process.env.REACT_APP_IP_DEV_BACK}/api/tickets/updateticket/${infId}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              product:software,
              sector:optionSetor,
              status: status,
              description:description
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Erro ao atualizar status: ${await response.text()}`);
        }

        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === infId ? { 
              ...row, 
              product:software,
              sector:optionSetor,
              status: status,
              description: description
            } : row
          )
        );
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
        setError("Erro ao atualizar status. Tente novamente.");
      }
    })
  ;

  const columns = [
    { field: "id", headerName: "ID", width: 30 },
    { field: "sector", headerName: "Setor", width: 150 },
    { field: "product", headerName: "Sistema", width: 100 },
    {
      field: "status",
      headerName: "Status",
      renderCell: renderStatus,
      renderEditCell: renderEditStatus,
      type: "singleSelect",
      valueOptions: STATUS_OPTIONS,
      width: 200,
      editable: false,
    },
    { field: "priority", headerName: "Prioridade", width: 100 },
    { field: "title", headerName: "Título", width: 150 },
    {
      field: "detail",
      type: "actions",
      headerName: "Informação",
      width: 100,
      getActions: (params) => [
        <IconButton
          key={`info-${params.id}`}
          color="info"
          size="large"
          onClick={() => handleOpenDialog(params.row)}
        >
          <InfoIcon />
        </IconButton>,
      ],
    },
    {
      field: "SubTicket",
      headerName: "SubTicket",
      type: "actions",
      width: 100,
      getActions: (params) => [
        <IconButton
          color='secondary'
          size="large"
        >
          <GridMenuIcon />
        </IconButton>
      ],
    },
  ];

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      {pathname === "/chamados/chamadosaberto" ? (
        <Box sx={{ height: 500, width: "95%" }}>
          <Grid container spacing={1} p={1}>
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={fetchTickets}
              >
                Atualizar
              </Button>
            </Grid>
          </Grid>
          <DataGrid
            rows={rows}
            columns={columns}
            onCellEditCommit={handleCellEditCommit}
            initialState={{
              pagination: { paginationModel: { pageSize: 5 } },
            }}
            pageSizeOptions={[5, 10, 50]}
            disableRowSelectionOnClick
            loading={loading}
          />
          <Dialog open={openDialog} PaperProps={{
            sx: {
              borderRadius: 1,
              border: '1px solid #333',
              boxShadow: 10,
              minWidth:'80%'
            },
          }}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Detalhes do Ticket</DialogTitle>
            <DialogContent >
              {selectedTicket ? (
              
                  <Grid
                    p={2}
                    container 
                    spacing={{ xs: 1, sm: 2, md:2}}
                    sx={{
                      
                      display: "flex",
                      flexDirection: 'column',
                      padding:1,                      
                      mx: 'auto',
                      maxWidth: { xs: '100%', sm:'100%', md: '100%' },
                      gap:1,
                      borderRadius: 1,
                      boxShadow: 1,
                      minWidth: '90%',
                      
                    }}
                  >
                    <Grid>
                      <FormControl  sx={{ flex: 1, minWidth: { xs: '30%', sm: '30%', md: '30%' }, px: 2, maxWidth: { xs: '30%', sm: '30%', md: '30%' } }}>
                        <TextField
                          label="ID"
                          error={hasValue(infId) ? false : true}
                          defaultValue={infId}
                          onBlur={(e) => setInfId(e.target.value)}
                          variant="outlined"
                          disabled
                          fullWidth
                        />
                      </FormControl>
                      
                      <IconButton color="info" size='large' sx={{alignItems:'end', justifyContent:'end', justifyItems:"end", }}>+</IconButton>
                    </Grid>
                    <Grid
                      container spacing={1}
                      direction="row"
                      p={2}
                      width={'100%'}
                    >
                      <FormControl sx={{ minWidth: { xs: '25%', sm: '25%', md: '25%' } }}>
                        <InputLabel id="software-label" color="success">Programa</InputLabel>
                        <Select
                          labelId="software-label"
                          id="software"
                          color="warning"
                          error={hasValue(software) ?  false : true}
                          value={software}
                          onChange={(e) => setSoftware(e.target.value)}
                          label="Programa"
                          fullWidth
                        >
                          {softwares.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ minWidth: { xs: '25%', sm: '25%', md: '25%' } }}>
                        <InputLabel id="setor-label" color="success">Setor</InputLabel>
                        <Select
                          labelId="setor-label"
                          id="setor"
                          color="warning"
                          error={hasValue(optionSetor) ? false : true}
                          value={optionSetor}
                          onChange={(e) => setOptionSetor(e.target.value)}
                          label="Setor"
                          fullWidth
                        >
                          {setores.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ minWidth: { xs: '21.5%', sm: '21.5%', md: '21.5%'  } }}>
                        <InputLabel id="status-label" color="success" >Status</InputLabel>
                        <Select
                          labelId="status-label"
                          id="STATUS"
                          color="warning"
                          error={hasValue(status) ? false : true}
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          label="Status"
                          fullWidth
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <FormControl sx={{ minWidth: { xs: '25%', sm: '25%', md: '25%' } }}>
                        <InputLabel id="contact-label">Forma de Contato</InputLabel>
                        <Select
                          labelId="contact-label"
                          id="contact"
                          value={opcaoContato}
                          onChange={(e) => setOpcaoContato(e.target.value)}
                          label="Forma de Contato"
                          disabled
                          fullWidth
                        >
                          {formaContato.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>                  
                      <FormControl sx={{ minWidth: { xs: '99%', sm: '99%', md: '99%' } }}>
                        <TextField
                          fullWidth
                          error={hasValue(contactInfo) ? false : true}
                          label="Número ou E-mail"
                          defaultValue={contactInfo}
                          onBlur={(e) => setContactInfo(e.target.value)}
                          variant="outlined"
                          sx={{ mb: 2 }}
                          disabled
                        />
                      </FormControl>
                      <FormControl sx={{ minWidth: { xs: '99%', sm: '99%', md: '99%' } }}>
                        <TextField
                          fullWidth
                          label="Assunto"
                          error={hasValue(subject) ? false : true}
                          defaultValue={subject}
                          onBlur={(e) => setSubject(e.target.value)}
                          variant="outlined"
                          sx={{ mb: 2 }}
                          disabled
                        />
                      </FormControl>
                      <FormControl sx={{ minWidth: { xs: '99%', sm: '99%', md: '99%' } }}>
                        <TextField
                          fullWidth
                          label="Descrição"
                          error={hasValue(description) ? false : true}
                          defaultValue={description}
                          onBlur={(e) => setDescription(e.target.value)}
                          multiline
                          rows={4}
                          variant="outlined"
                          
                        />
                      </FormControl>
                    </Grid>
                    <DialogActions sx={{ justifyContent: 'flex-end', p: 2, width: '100%' }}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Cancel />}
                        sx={{ mr: 2, borderRadius: 8 }}
                        onClick={() => handleCloseDialog()}
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="outlined"
                        color="success"
                        startIcon={<SaveIcon />}
                        sx={{ borderRadius: 8 }}
                        onClick={() => handleCellEditCommit()}
                      >
                        Salvar
                      </Button>
                    </DialogActions>
                  </Grid>
              
              ) : (
                <Typography>Nenhum ticket selecionado.</Typography>
              )}
            </DialogContent>
          </Dialog>
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError(null)}
          >
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Snackbar>
        </Box>
      ) : (
        <Box></Box>
      )}
    </Box>
  );
}
