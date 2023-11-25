import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, useMediaQuery } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@emotion/react";


const DialogoTicketCreado = ({ abierto, fnSetAbierto, numeroTicket }) => {

    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Dialog fullScreen={fullScreen} fullWidth maxWidth="lg" open={abierto} onClose={() => fnSetAbierto(false)}>
            <DialogTitle sx={{ m: 0, mb: 0, py: 1, bgcolor: "primary.main", color: "primary.contrastText" }}>
                Crear nueva solicitud de soporte
                <IconButton
                    onClick={() => fnSetAbierto(false)}
                    sx={{ position: "absolute", right: 8, top: 4, color: (t) => t.palette.grey[800] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ px: 4, mt: 2 }}>Ticket {numeroTicket} creado con éxito</DialogContent>
            <DialogActions sx={{ px: 4, mb: 2 }}>
                <Button onClick={() => fnSetAbierto(false)} color="info" startIcon={<CloseIcon />}>
                    Cerrar
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DialogoTicketCreado;