import * as React from 'react';
import Chip from '@mui/material/Chip';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { styled } from '@mui/material/styles';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import InfoIcon from '@mui/icons-material/Info';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DoneIcon from '@mui/icons-material/Done';
import {
  GridEditModes,
  useGridApiContext,
  useGridRootProps,
} from '@mui/x-data-grid';

export const STATUS_OPTIONS = ['Pending', 'Open', 'Completed', 'Rejected'];

const StyledChip = styled(Chip)(({ theme }) => ({
  justifyContent: 'left',
  '& .icon': {
    color: 'inherit',
  },
  '&.Pending': {
    color: (theme.vars || theme).palette.info.dark,
    border: `1px solid ${(theme.vars || theme).palette.info.main}`,
  },
  '&.Completed': {
    color: (theme.vars || theme).palette.success.dark,
    border: `1px solid ${(theme.vars || theme).palette.success.main}`,
  },
  '&.Open': {
    color: (theme.vars || theme).palette.warning.dark,
    border: `1px solid ${(theme.vars || theme).palette.warning.main}`,
  },
  '&.Rejected': {
    color: (theme.vars || theme).palette.error.dark,
    border: `1px solid ${(theme.vars || theme).palette.error.main}`,
  },
}));

const Status = React.memo((props) => {
  const { status } = props;

  let icon = null;
  if (status === 'Rejected') {
    icon = <ReportProblemIcon className="icon" />;
  } else if (status === 'Pending') {
    icon = <InfoIcon className="icon" />;
  } else if (status === 'Open') {
    icon = <AutorenewIcon className="icon" />;
  } else if (status === 'Completed') {
    icon = <DoneIcon className="icon" />;
  }

  let label = status;
  if (status === 'Open') {
    label = 'Em execução';
  }

  return (
    <StyledChip
      className={status}
      icon={icon}
      size="small"
      label={label}
      variant="outlined"
      sx={{ pointerEvents: 'none' }}
    />
  );
});

function EditStatus(props) {
  const { id, value, field } = props;
  const rootProps = useGridRootProps();
  const apiRef = useGridApiContext();

  const handleChange = async (event) => {
    try {
      const isValid = await apiRef.current.setEditCellValue({
        id,
        field,
        value: event.target.value,
      });

      if (isValid && rootProps.editMode === GridEditModes.Cell) {
        apiRef.current.stopCellEditMode({ id, field, cellToFocusAfter: 'below' });

        // Dispara manualmente o evento onCellEditCommit
        apiRef.current.publishEvent('cellEditCommit', {
          id,
          field,
          value: event.target.value,
        });
      }
    } catch (error) {
      console.log("Erro ao clicar no componente status", error);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') {
      apiRef.current.stopCellEditMode({ id, field, ignoreModifications: true });
    }
  };

  return (
    <Select
      value={value}
      onChange={handleChange}
      MenuProps={{
        onClose: handleClose,
      }}
      sx={{
        height: '100%',
        '& .MuiSelect-select': {
          display: 'flex',
          alignItems: 'center',
          pl: 1,
        },
      }}
      autoFocus
      fullWidth
    >
      {STATUS_OPTIONS.map((option) => {
        let IconComponent = null;
        if (option === 'Rejected') {
          IconComponent = ReportProblemIcon;
        } else if (option === 'Pending') {
          IconComponent = InfoIcon;
        } else if (option === 'Open') {
          IconComponent = AutorenewIcon;
        } else if (option === 'Completed') {
          IconComponent = DoneIcon;
        }

        let label = option;
        if (option === 'Open') {
          label = 'Em execução';
        }

        return (
          <MenuItem key={option} value={option}>
            <ListItemIcon sx={{ minWidth: 36 }}>
              <IconComponent fontSize="small" />
            </ListItemIcon>
            <ListItemText primary={label} sx={{ overflow: 'hidden' }} />
          </MenuItem>
        );
      })}
    </Select>
  );
}

export function renderStatus(params) {
  if (params.value == null) {
    return '';
  }

  return <Status status={params.value} />;
}

export function renderEditStatus(params) {
  return <EditStatus {...params} />;
}
