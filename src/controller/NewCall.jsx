
import * as React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { Alert, AlertTitle, Button, colors, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, Modal, Paper, Select, Stack, TextField, Tooltip } from '@mui/material';
import { useState } from 'react';
import { hasValue } from '@aalencarv/common-utils';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel'


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

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};



export default function NewCall({ pathname }) {
    const [optionProblem, setOptionProblem] = useState();
    const [software, setSoftware] = useState('');
    const [priority, setPriority] = useState();
    const [optionSetor, setOptionSetor] = useState('');
    const [opcaoContato, setOpcaoContato] = useState('');
    const [contactInfo, setContactInfo] = React.useState('');
    const [subject, setSubject] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [successOpenCall, setSuccessOpenCall] = useState(false);

    async function insertBack() {
        const requestData = {
            product: software,
            sector: optionSetor,
            contactWay: opcaoContato,
            contact: contactInfo,
            title: subject,
            description: description,
            priority: priority,
            status: 'Open'
        };

        fetch(`http://${process.env.REACT_APP_IP_DEV_BACK}/api/tickets/createtickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro na requisição POST');
                }
                return response.json();
            })
            .then(data => {
                console.log('Sucesso:', data);
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            }
            );
    }

    function saveCall() {
        if (hasValue(software) && hasValue(optionSetor) && hasValue(opcaoContato) && hasValue(contactInfo) && hasValue(subject) && hasValue(description) && hasValue(priority)) {
            insertBack();
            setOptionProblem(false);
            setSuccessOpenCall(true);
            cleanInf()
        } else {
            setShowWarning(true);
        }
    }

    function priorityProblem(id) {
        switch (id) {
            case 1:
                setOptionProblem(true);
                setPriority("HIGH");
                break;
            case 2:
                setOptionProblem(true);
                setPriority("MEDIUM");
                break;
            case 3:
                setOptionProblem(true);
                setPriority("LOW")
                break;
        }
    }
    function cleanInf() {
        setSoftware('')
        setPriority('')
        setOptionSetor('')
        setOpcaoContato('')
        setContactInfo('')
        setSubject('')
        setDescription('')
    }
    return (
        <Box
            sx={{
                py: { xs: 2, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '100%',
            }}
        >
            {pathname === "/chamados/novochamado" ? (
                <Box sx={{ width: '100%' }}>
                    <Grid container spacing={2} alignContent="center" justifyContent="center">
                        {successOpenCall && (
                            <Box mb={{ xs: 1, sm: 2 }} width="100%">
                                <Alert severity="success">
                                    Chamado aberto com sucesso vamos retornar o mais rapido possivel
                                </Alert>
                            </Box>
                        )}

                        <Stack
                            spacing={{ xs: 1, sm: 2, md: 3 }}
                            direction="column"
                            alignItems="center"
                            sx={{ maxWidth: { xs: '100%', md: 800 }, mx: 'auto', width: '100%' }}
                        >
                            <Button
                                sx={{
                                     height: 'auto',
                                    '& .MuiChip-label': {
                                    display: 'block',
                                    whiteSpace: 'normal',
                                    fontSize: { xs: 16, sm: 18, md: 20 },
                                    p: { xs: 0.5, sm: 1 },
                                    } 
                                }}
                                color='error'
                                variant='contained'
                                clickable
                                onClick={() => priorityProblem(1)}
                            >Sistema não operacional: Sistema encontra-se fora do ar ou tem algo que está divergente e com isso torna o programa não funcional</Button>
                            <Button
                                sx={{
                                    height: 'auto',
                                    '& .MuiChip-label': {
                                        display: 'block',
                                        whiteSpace: 'normal',
                                        fontSize: { xs: 16, sm: 18, md: 20 },
                                        p: { xs: 0.5, sm: 1 },
                                    },
                                }}
                                component="a"
                                href="#basic-chip"
                                color='warning'
                                variant='contained'
                                clickable
                                onClick={() => priorityProblem(2)}
                            >Sistema divergente: Sistema está com alguma informação divergente onde tem a necessidade de verificar o problema
                            </Button>
                            <Button
                                sx={{
                                    height: 'auto',
                                    '& .MuiChip-label': {
                                        display: 'block',
                                        whiteSpace: 'normal',
                                        fontSize: { xs: 16, sm: 18, md: 20 },
                                        p: { xs: 0.5, sm: 1 },
                                    },
                                }}
                                
                                component="a"
                                href="#basic-chip"
                                color='success'
                                variant='contained'
                                clickable
                                onClick={() => priorityProblem(3)}
                            >
                                Duvidas ou Sugestão: Sistema está funcionando corretamente mas tem uma duvida ou Sugestão de melhoria
                            </Button>
                        </Stack>

                        <Dialog
                            open={optionProblem}
                            onClose={() => setOptionProblem(false)}
                            maxWidth="xl"
                            fullWidth
                        >
                            <DialogTitle sx={{ fontWeight: 'bold', p: 2 }}>
                                Informar dados do Ticket-Task
                            </DialogTitle>
                            <DialogContent sx={{ p: { xs: 1, sm: 1 } }}>
                                <Box>
                                    <Grid
                                        p={2}
                                        container
                                        spacing={{ xs: 1, sm: 2 }}
                                        sx={{
                                            py: 2,
                                            display: 'flex',
                                            m: 0,
                                            justifyContent: 'center',
                                            flexDirection: { xs: 'column', md: 'row' },
                                            alignItems: 'stretch',
                                            mx: 'auto',
                                            maxWidth: { xs: '100%', xl:'90%', sm: '80%', md: '60%' },
                                            gap: 2,
                                            borderRadius: 3,
                                            boxShadow: 20,
                                            minWidth: '90%',
                                        }}
                                    >
                                        {showWarning && (
                                            <Box mb={2} width="100%">
                                                <Alert severity="warning">
                                                    Revise as informações, tem algo faltando.
                                                </Alert>
                                            </Box>
                                        )}
                                        <Box
                                            sx={{
                                                width: { xs: '100%', xl:'90%', sm: '80%', md: '60%' },
                                                maxHeight: '80vh',
                                                overflowY: 'auto',
                                                paddingBlock: 1,
                                            }}

                                        >
                                            <Typography
                                                id="modal-description"
                                                variant="body2"
                                                color="text.secondary"
                                                gutterBottom
                                                sx={{ fontSize: { xs: 12, sm: 14 } }}
                                            >
                                                Preencha os campos abaixo.
                                            </Typography>
                                            <Stack
                                                spacing={{ xs: 1, sm: 2 }}
                                                direction="row"
                                                useFlexGap
                                                sx={{ flexWrap: 'wrap' }}
                                                justifyContent={'center'}
                                            >
                                                <FormControl sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 }, mb: 2 }}>
                                                    <InputLabel id="software-label">Programa</InputLabel>
                                                    <Select
                                                        labelId="software-label"
                                                        id="software"
                                                        error={software === '' || software === ' ' ? true : false}
                                                        value={software}
                                                        onChange={(e) => setSoftware(e.target.value)}
                                                        label="Programa"
                                                        fullWidth
                                                        color="success"
                                                    >
                                                        {softwares.map((option) => (
                                                            <MenuItem key={option} value={option}>
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                <FormControl sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 }, mb: 2 }}>
                                                    <InputLabel id="setor-label">Setor</InputLabel>
                                                    <Select
                                                        labelId="setor-label"
                                                        id="setor"
                                                        value={optionSetor}
                                                        onChange={(e) => setOptionSetor(e.target.value)}
                                                        label="Setor"
                                                        fullWidth
                                                        color="success"
                                                    >
                                                        {setores.map((option) => (
                                                            <MenuItem key={option} value={option}>
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>

                                                <FormControl sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 }, mb: 2 }}>
                                                    <InputLabel id="contact-label">Forma de Contato</InputLabel>
                                                    <Select
                                                        labelId="contact-label"
                                                        id="contact"
                                                        value={opcaoContato}
                                                        onChange={(e) => setOpcaoContato(e.target.value)}
                                                        label="Forma de Contato"
                                                        fullWidth
                                                        color="success"
                                                    >
                                                        {formaContato.map((option) => (
                                                            <MenuItem key={option} value={option}>
                                                                {option}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <Box sx={{ width: '100%' }}>
                                                    <TextField
                                                        fullWidth
                                                        error={contactInfo === '' || contactInfo === ' ' ? true : false}
                                                        label="Número ou E-mail"
                                                        defaultValue={contactInfo}
                                                        onBlur={(e) => setContactInfo(e.target.value)}
                                                        variant="outlined"
                                                        sx={{ mb: 2 }}
                                                        color="success"
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Assunto"
                                                        error={subject === '' || subject === ' ' ? true : false}
                                                        defaultValue={subject}
                                                        onBlur={(e) => setSubject(e.target.value)}
                                                        variant="outlined"
                                                        sx={{ mb: 2 }}
                                                        color="success"
                                                    />
                                                    <TextField
                                                        fullWidth
                                                        label="Descrição"
                                                        error={description === '' || description === ' ' ? true : false}
                                                        defaultValue={description}
                                                        onBlur={(e) => setDescription(e.target.value)}
                                                        multiline
                                                        rows={4}
                                                        variant="outlined"
                                                        color="success"
                                                    />
                                                </Box>

                                                <DialogActions sx={{ justifyContent: 'flex-end', p: 2, width: '100%' }}>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<CancelIcon />}
                                                        sx={{ borderRadius: 8 }}
                                                        onClick={() => {
                                                            setOptionProblem(false);
                                                            setShowWarning(false);
                                                            cleanInf()
                                                        }}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="success"
                                                        startIcon={<SaveIcon />}
                                                        sx={{ borderRadius: 8 }}
                                                        onClick={() => saveCall()}
                                                    >
                                                        Salvar
                                                    </Button>
                                                </DialogActions>
                                            </Stack>
                                        </Box>
                                    </Grid>
                                </Box>
                            </DialogContent>
                        </Dialog>
                    </Grid>
                </Box>
            ) : (
                ""
            )}
        </Box>
    );
}
