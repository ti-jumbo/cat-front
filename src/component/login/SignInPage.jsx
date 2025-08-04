import * as React from 'react';
import { AppProvider } from '@toolpad/core/AppProvider';
import { Alert, Box, Button,  FormControl,  Grid, IconButton, InputAdornment, InputLabel, OutlinedInput, Paper,  TextField, Typography } from '@mui/material';
import { useState } from 'react';
import Home from '../../controller/Home';
import { Link } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

    
export default function SignInPage() {
  const[email,setEmail] = useState("");
  const[accessKey,setAccessKey] = useState("");
  const[authorized,setAuthorized] = useState(false);
  const[showPassword, setShowPassword] = useState(false);
  const[unauthorized, setUnauthorized] = useState(true);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  async function SignIn() {
    try {
      const credentials = {
        email:String(email),
        accessKey:String(accessKey)
      };
        const response = await fetch(`http://${process.env.REACT_APP_IP_DEV_BACK}/api/user/login`, {
        
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify(credentials)
      });
        const contentType = response.headers.get("content-type");

      if (!response.ok) {
        const errorText = await response.text(); // lê como texto para entender o erro
        throw new Error(`Erro HTTP ${response.status}: ${errorText}`);
      }

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json(); // ✅ só tenta parsear se for JSON
        console.log("Sucesso:", data);
        setAuthorized(true);
        setUnauthorized(true);
      } else {
        const text = await response.text(); // fallback: texto simples
        console.log("Resposta não JSON:", text);
        setAuthorized(true);
        setUnauthorized(true);
      }
  } catch (error) {
    console.error("Erro na requisição:", error.message);
    setUnauthorized(false);
  }
}

  
  // preview-end

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
    {authorized === false ? (
      <AppProvider>
        <Box
          sx={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Grid container justifyContent="center" alignItems="center">
            <Grid item xs={12} md={8} lg={6}>
              <Paper
                elevation={1}
                sx={{
                  minWidth: 400,
                  minHeight: 400,
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h5" component="h2" gutterBottom>
                  Login
                </Typography>
                    {unauthorized === false && (
                      <Alert severity="error" onClose={() => {setUnauthorized(true)}}>
                        Usuário ou senha inválidos.
                      </Alert>
                    )}
                <Grid
                  container
                  spacing={3}
                  direction="column"
                  sx={{ mt: 8, width: 300 }}
                >
                  <Grid item>
                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      variant="outlined"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <FormControl item>
                    <InputLabel size="small" htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      label="Senha"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      variant="outlined"
                      
                      value={accessKey}
                      onChange={(e) => setAccessKey(e.target.value)}
                       endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            size="small"
                          >
                            {showPassword ? (
                              <VisibilityOff fontSize="inherit" />
                            ) : (
                              <Visibility fontSize="inherit" />
                            )}
                          </IconButton>
                        </InputAdornment>
                      }  
                    />
                  </FormControl>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="success"
                      fullWidth
                      onClick={() => SignIn()}
                    >
                      Entrar
                    </Button>
                    
                  </Grid>
                 <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link 
                      href="#" 
                      style={{ color: 'lightblue' }}
                      to={"/register"}
                      >
                      Registrar
                    </Link>
                  </Grid>
                </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </AppProvider>
    ) : (
      <Home />
    )}
  </Box>
    // preview-end
  );
}
