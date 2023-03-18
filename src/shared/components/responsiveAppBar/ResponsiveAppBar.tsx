import { AppBar, Icon, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useDrawerContext } from '../../contexts';


export const ResponsiveAppBar: React.FC = () => {

    const theme = useTheme();
    const smDown = useMediaQuery(theme.breakpoints.down('sm'));
    const mdDown = useMediaQuery(theme.breakpoints.down('md'));
    const { toggleDrawerOpen } = useDrawerContext();

    return (
        <AppBar position='static' color='primary' enableColorOnDark>
            <Toolbar>
                {smDown &&
                    <IconButton onClick={toggleDrawerOpen}>
                        <Icon>menu</Icon>
                    </IconButton>
                }
                <Typography variant={smDown ? 'h5' : mdDown ? 'h5' : 'h4'} noWrap component="div" sx={{ flexGrow: 1 }}>
                    Controle de estoque
                </Typography>
            </Toolbar>
        </AppBar>
    );
};