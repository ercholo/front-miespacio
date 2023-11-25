import { Alert, AlertTitle, Typography } from "@mui/material";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";

const AlertaAdjuntoGrande = ({ mostrar }) => {

    if (!mostrar) return;
    
    return <Alert severity="info" sx={{ mt: 2 }}>
        <AlertTitle>Tamaño de archivo excedido.</AlertTitle>
        El archivo adjunto es superior a <strong>1MB</strong>.
        <Typography variant="body2" component="div" sx={{ mt: 3, mb: 1, display: 'flex', alignContent: 'center', gap: 1 }} >
            <AutoAwesomeOutlinedIcon />
            <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '120%' }} >Recomendación</Typography>
        </Typography>
        <Typography variant="body2" component="div" sx={{ ml: 4 }} >
            Para compartir archivos grandes, es recomendable subirlos a la plataforma de <a href="https://hefame.sharepoint.com/" target="_blank" underline="hover" rel="noreferrer" >PharePoint</a> y añadir el enlace del archivo en el cuerpo del mensaje.
        </Typography>
        <Typography variant="body2" component="div" sx={{ ml: 4 }}>
            Asegúrate de configurar correctamente la administración de acceso al mismo antes de compartirlo.
        </Typography>
    </Alert>

}

export default AlertaAdjuntoGrande;