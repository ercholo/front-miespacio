import { Box, Grid, List, ListItemButton, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import React from "react";
import SavingsIcon from "@mui/icons-material/Savings";
import PaymentsIcon from "@mui/icons-material/Payments";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import SendIcon from "@mui/icons-material/Send";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import GroupsIcon from "@mui/icons-material/Groups";
import { useAutorizacion } from "../../hooks/useAutorizacion";
import { useNavigate } from "react-router";

export default function PanelAccesosRapidos() {
    const navigate = useNavigate();
    const autorizacionConvenio = useAutorizacion({ areaPersonal: ["HF"] });

    return (
        <Paper elevation={3}>
            <Box sx={{ background: (t) => t.palette.grey[100], my: 0, py: 1.2, pl: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ mr: 2, display: "flex" }}>
                        <SendIcon />
                    </Box>
                    <Box>
                        <Typography variant="h6">Accesos rápidos</Typography>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ my: 0, py: 0, px: 2, mb: 1 }}>
                <Grid container sx={{ px: 0, mb: 4, py: 1 }}>
                    <Grid item md={autorizacionConvenio ? 4 : 6}>
                        <List sx={{ width: "100%", p: 0 }} component="nav">
                            <ListItemButton onClick={() => navigate("/nomina")}>
                                <ListItemIcon>
                                    <PaymentsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Mis nóminas" />
                            </ListItemButton>
                            <ListItemButton onClick={() => navigate("/accesos")}>
                                <ListItemIcon>
                                    <FingerprintIcon />
                                </ListItemIcon>
                                <ListItemText primary="Mis accesos" />
                            </ListItemButton>
                        </List>
                    </Grid>

                    <Grid item md={autorizacionConvenio ? 4 : 6}>
                        <List sx={{ width: "100%", p: 0 }} component="nav">
                            <ListItemButton onClick={() => navigate("/gestiones/planificador-reuniones")}>
                                <ListItemIcon>
                                    <GroupsIcon />
                                </ListItemIcon>
                                <ListItemText primary="Reserva de Salas" />
                            </ListItemButton>
                            <ListItemButton onClick={() => navigate("/gestiones/viajes")}>
                                <ListItemIcon>
                                    <AirplaneTicketIcon />
                                </ListItemIcon>
                                <ListItemText primary="Solicitud de viaje" />
                            </ListItemButton>
                        </List>
                    </Grid>
                    {autorizacionConvenio && (
                        <Grid item md={4}>
                            <List sx={{ width: "100%", p: 0 }} component="nav">
                                <ListItemButton onClick={() => navigate("/vales/catalogo")}>
                                    <ListItemIcon>
                                        <AddShoppingCartIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Vales de emplead@" />
                                </ListItemButton>
                                <ListItemButton onClick={() => navigate("/anticipos")}>
                                    <ListItemIcon>
                                        <SavingsIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Anticipos y préstamos" />
                                </ListItemButton>
                            </List>
                        </Grid>
                    )}
                </Grid>
            </Box>
        </Paper>
    );
}
