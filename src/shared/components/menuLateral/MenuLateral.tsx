import { Avatar, Box, Divider, Drawer, IconButton, Link, List, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { useMatch, useNavigate, useResolvedPath } from 'react-router-dom';
import { useAppThemeContext, useDrawerContext } from '../../contexts';
import { memo } from 'react';

interface IListItemLinkProps {
    label: string;
    icon: JSX.Element;
    to: string;
    onClick: (() => void) | undefined;
}

const ListItemLink = ({ icon, label, to, onClick }: IListItemLinkProps) => {

    const navigate = useNavigate();

    const resolvedPath = useResolvedPath(to);

    const match = useMatch({ path: resolvedPath.pathname, end: false });

    const handleClick = () => {
        navigate(to);
        onClick?.();
    };

    return (
        <ListItemButton selected={!!match} onClick={handleClick} >
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={label} />
        </ListItemButton>
    );
};

interface IMenuLateralProps {
    children: React.ReactNode;
}

const MenuLateralMemo = ({ children }: IMenuLateralProps) => {

    const theme = useTheme();

    const mdDown = useMediaQuery(theme.breakpoints.down('md'));

    const { isDrawerOpen, toggleDrawerOpen, drawerOptions } = useDrawerContext();

    const { toggleTheme, themeName } = useAppThemeContext();

    return (
        <>
            <Drawer open={isDrawerOpen} variant={mdDown ? 'temporary' : 'persistent'} onClose={toggleDrawerOpen}>
                <Box width={theme.spacing(37)} height='100%' display='flex' flexDirection='column'>
                    <Box width='100%' height={theme.spacing(20)} display='flex' alignItems='center' justifyContent='center'>
                        <Avatar
                            sx={{ height: theme.spacing(12), width: theme.spacing(12) }}
                            alt="Logo Plantao"
                            src="/logo.png"
                        />
                    </Box>

                    <Divider />

                    <Box flex={1}>
                        <List component='nav'>
                            {drawerOptions.map(drawerOption => (
                                !drawerOption.group &&
                                <ListItemLink
                                    key={drawerOption.path}
                                    label={drawerOption.label}
                                    icon={drawerOption.icon}
                                    to={drawerOption.path}
                                    onClick={mdDown ? toggleDrawerOpen : undefined}
                                />
                            ))}

                            <Typography
                                variant="h6"
                                component={Link}
                                underline="none"
                                padding={2}
                            >
                                Cadastro de Materiais
                            </Typography>
                            {drawerOptions.map(drawerOption => (
                                drawerOption.group === 'Cadastro de Materiais' &&
                                <ListItemLink
                                    key={drawerOption.path}
                                    label={drawerOption.label}
                                    icon={drawerOption.icon}
                                    to={drawerOption.path}
                                    onClick={mdDown ? toggleDrawerOpen : undefined}
                                />
                            ))}

                            <Typography
                                variant="h6"
                                component={Link}
                                underline="none"
                                padding={2}
                            >
                                Entrada de Materiais
                            </Typography>
                            {drawerOptions.map(drawerOption => (
                                drawerOption.group === 'Entrada de Materiais' &&
                                <ListItemLink
                                    key={drawerOption.path}
                                    label={drawerOption.label}
                                    icon={drawerOption.icon}
                                    to={drawerOption.path}
                                    onClick={mdDown ? toggleDrawerOpen : undefined}
                                />
                            ))}

                            <Typography
                                variant="h6"
                                component={Link}
                                underline="none"
                                padding={2}
                            >
                                Saida de Materiais
                            </Typography>
                            {drawerOptions.map(drawerOption => (
                                drawerOption.group === 'Saida de Materiais' &&
                                <ListItemLink
                                    key={drawerOption.path}
                                    label={drawerOption.label}
                                    icon={drawerOption.icon}
                                    to={drawerOption.path}
                                    onClick={mdDown ? toggleDrawerOpen : undefined}
                                />
                            ))}
                        </List>
                    </Box>

                    <Box>
                        <List component='nav'>
                            <ListItemButton onClick={toggleTheme} >
                                <ListItemIcon>
                                    <IconButton sx={{ ml: 1 }} color="inherit">
                                        {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
                                    </IconButton>
                                </ListItemIcon>
                                
                                <ListItemText primary={themeName === 'light' ? 'Tema escuro' : 'Tema claro'} />
                            </ListItemButton>
                        </List>
                    </Box>
                </Box>
            </Drawer>

            <Box height='100vh' marginLeft={mdDown ? 0 : isDrawerOpen ? theme.spacing(37) : 0}>
                {children}
            </Box>
        </>
    );
};

export const MenuLateral = memo(MenuLateralMemo);