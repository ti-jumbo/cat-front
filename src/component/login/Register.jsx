import { Alert, Box, Button, Divider, FormControl, Grid, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material"
import { AppProvider } from "@toolpad/core/AppProvider"
import { useState } from "react";
import { Link } from "react-router-dom"






export default function Register(){
    const[optionSector,setOptionSector] = useState('');
    const[name, setName] = useState('');
    const[document, setDocument] = useState('');
    const[email, setEmail] = useState('');
    const[contact, setContact] = useState('');
    const[accessKey, setAccessKey] = useState(''); 


    const sector = ['Financeiro','Faturamento','TI','Supervisão','Gerencia','Vendas','Fornecedor','Cliente'];


    async function registerUser() {
      try {
        const data = {
          name:name,
          email:email,
          document:document,
          setor:optionSector,
          contact:contact,
          accessKey:accessKey
        } 

        const response = await fetch(`http://${process.env.REACT_APP_IP_DEV_BACK}/api/user/createuser`, {
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify(data)
        })
        return response;
      } catch(error) {
          console.log('Erro ao cadastrar usuario',error);
          alert('Algo deu errado ao cadastrar usuario contate o suporte')
      }
    }
    
    return (
        <AppProvider>
            <Box
                sx={{
                    py: { xs: 2, md: 10 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    width: '100%',
                }}
            >
           <Grid container justifyContent="center" alignItems="center" >
            <Grid item xs={12} sm={8} md={6} lg={12}>
              <Paper
                elevation={1}
                sx={{
                  width:'100%',
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Registre-se
                </Typography>

                <Grid
                  container
                  spacing={2}
                  direction="column"
                  sx={{ mt: 1, width: '100%' }}
                >
                  <Grid item sx={{ flex: 1, mb: 1 }}>
                    <TextField
                      label="Nome completo"
                      type="name"
                      fullWidth
                      variant="outlined"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Grid>
                  <Stack item maxWidth={'100%'} direction="row"  divider={<Divider orientation="vertical" flexItem />} spacing={2}>
                    <FormControl sx={{ flex: 1,  mb: 1 }}>
                        <InputLabel id="Select sector"> Setor </InputLabel>
                        <Select 
                            labelId="Select sector"
                            label="Setor"
                            id="sector"
                            fullWidth
                            value={optionSector}
                            onChange={(e) => setOptionSector(e.target.value)}
                        >
                            {sector.map((option) => 
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            )}
                        </Select>
                        </FormControl>
                        <FormControl  sx={{ flex: 1,  mb: 1 }}> 
                            <TextField
                                label="Informe o CPF"
                                type="cpf"
                                fullWidth
                                variant="outlined"
                                value={document}
                                onChange={(e) => setDocument(e.target.value)}
                            >
                            </TextField>
                        </FormControl>
                  </Stack>
                  <Grid item>
                    <TextField
                      label="Informe o email"
                      type="email"
                      fullWidth
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid>
                    <TextField
                        label="Contato"
                        type="contact"
                        fullWidth
                        variant="outlined"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                    >

                    </TextField>
                  </Grid>
                  <Grid item>
                    <TextField
                      label="Senha"
                      type="password"
                      fullWidth
                      variant="outlined"
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                    />
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color='success'
                      fullWidth
                      onClick={() => registerUser()}
                    >
                      Cadastrar
                    </Button>
                    
                  </Grid>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link
                            href="#" 
                            style={{ color: 'lightblue' }}
                            to={"/"}
                            >
                                Voltar a tela de login
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid> 
            </Box>
        </AppProvider>
    )
}