import { Button } from "@mui/material";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const BotonAbrirDialogo = ({fnSetAbierto}) => {
    return <Button size="large" variant="contained" onClick={() => fnSetAbierto(true)} startIcon={<SupportAgentIcon />}>
        Crear una nueva solicitud
    </Button>
}

export default BotonAbrirDialogo;