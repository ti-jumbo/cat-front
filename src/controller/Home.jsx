import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { createTheme, styled } from '@mui/material/styles';
import CallIcon from '@mui/icons-material/Call';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { DemoProvider, useDemoRouter } from '@toolpad/core/internal';
import { Stack, Tooltip } from '@mui/material';
import { useState } from 'react';
import NewCall from './NewCall';
import CallAndTask from './CallAndTask';
import { useEffect } from 'react';



const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});


function Home(props) {

    console.log('homecomponentRenderized')
    const { window } = props;
    const router = useDemoRouter('/Home');
    const [popoverAnchorEl, setPopoverAnchorEl] = useState('');
    const isPopoverOpen = Boolean(popoverAnchorEl);
    const [rows, setRows] = useState([]);
    const popoverId = isPopoverOpen ? 'simple-popover' : undefined;
    const [countCall, setCountCall] = useState(0)
  
    useEffect(() => {
      async function getTask() {
        try {
            const response = await fetch(`http://${process.env.REACT_APP_IP_DEV_BACK}/api/tickets/gettickets`);
            if (!response.ok) {
            throw new Error('Erro na requisição GET');
            }
            const data = await response.json();
          if (data.length > 0 && data[0].status !== "") {
        console.log("Deve entrar nesse if");
        let count = 0;
        for (let i = 0; i < data.length; i++) {
          if (data[i].status === "Open" || data[i].status === "Pending") {
            console.log("Entrou no contador");
           
            count += 1
          }
        }
        setCountCall(count)
        console.log("Total de chamados em Open ou Pending:", countCall);
      } else {
        console.log("NÃO DEVE ENTRAR AQUIIIII");
            console.log('Tickets recebidos:', data);
            setRows(data); // atualiza o estado
        }
          } catch (error) {
            console.error('Erro na requisição:', error);
        }
        
        }
      getTask();
      }, []);

      
    const NAVIGATION = [
        {
            segment: 'novochamado',
            title: 'Novo chamado',
            icon:'',   
        },
        {
            segment: 'chamadosconcluido',
            title: 'Chamados concluido',
            icon: <CallMadeIcon />,
            action: <Chip label={0} color="success" size="small" />,
        },
        {
            segment: 'chamadosaberto',
            title: 'Chamados aberto',
            icon: <CallReceivedIcon />,
            action: <Chip label={countCall} color="error" size="small" />,
        },
    ];

    const handlePopoverClose = (event) => {
        event.stopPropagation();
        setPopoverAnchorEl(null);
    };

    function CustomAppTitle() {
    return (
        <Stack direction="row" alignItems="center" spacing={2}>
        <img src="/logo192.jpg" alt="Logo" width={'6%'}></img>
        <Typography variant="h6">Sistema de tarefas e chamado</Typography>
        <Tooltip title="callandtask">
        </Tooltip>
        </Stack>
    );
        }   


    

  // Remove this const when copying and pasting into your project.
  const demoWindow = window !== undefined ? window() : undefined;

  const popoverMenuAction = (
    <React.Fragment>
      <Menu
        id={popoverId}
        open={isPopoverOpen}
        anchorEl={popoverAnchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        disableAutoFocus
        disableAutoFocusItem
      >
        <MenuItem onClick={handlePopoverClose}>Novo Chamado</MenuItem>
      </Menu>
    </React.Fragment>
  );



  return (
    // Remove this provider when copying and pasting into your project.
    <DemoProvider window={demoWindow}>
      {/* preview-start */}
      <AppProvider
        navigation={[
          {
            segment: 'chamados',
            title: 'Chamados',
            icon: <CallIcon />,
            action: popoverMenuAction,
            children: NAVIGATION,
          },
        ]}
        router={router}
        theme={demoTheme}
        window={demoWindow}
      >
        <DashboardLayout 
          slots={{
            appTitle: CustomAppTitle
          }}
        > 
        
          <NewCall pathname={router.pathname} />
          <CallAndTask pathname={router.pathname} />
          
        </DashboardLayout>
      </AppProvider>
      {/* preview-end */}
    </DemoProvider>
  );

};
Home.propTypes = {
/**
 * Injected by the documentation to work in an iframe.
 * Remove this when copying and pasting into your project.
 */
window: PropTypes.func,
};

export default Home;


//// agora vem a parte de caso for novo chamado deve aparecer os compentetes para criar novo chamado