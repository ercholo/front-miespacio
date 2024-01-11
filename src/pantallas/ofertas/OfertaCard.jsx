import DownloadIcon from '@mui/icons-material/Download';
import { Card, CardActions, CardContent, CardMedia, Chip, Button, Typography } from '@mui/material/';
import PropTypes from 'prop-types';

export const OfertaCard = ({ id, titulo, descripcion, imagen, enlace, categoria, localizaciones, tags }) => {

    return (

        <Card
            raised
            sx={{
                maxWidth: "auto",
                margin: "0 auto",
                // padding: "0.1em",
                borderRadius: 0
            }}
        >
            <CardMedia
                component="img"
                height="250"
                image={imagen}
                title={titulo}
                alt={titulo}
                sx={{
                    // maxWidth: 300,
                    // minWidth: 150,
                    // padding: "1em 1em 0 1em",
                    // objectFit: "contain"
                }}
            />

            <CardContent sx={{ height: 99 }}>
                
                <Typography variant="caption" color="text.secondary" gutterBottom >
                    <strong> {categoria?.titulo} </strong>
                </Typography>

                <Typography gutterBottom variant="h5" component="div">
                    {titulo}
                </Typography>

                <Typography variant="body2" color="text.secondary" mb="2" gutterBottom>
                    {descripcion}
                </Typography>


                <Typography variant="body2" noWrap gutterBottom sx={{ mt: "auto", mb: "auto" }} component={"div"}>
                    {
                        localizaciones.map((localizacion, i) =>
                            <Chip key={i} size="small" label={`${localizacion?.titulo}`} variant="outlined" sx={{ mr: 0.5, color: "red" }} />)
                    }
                </Typography>

                <Typography variant="body2" noWrap gutterBottom sx={{ mt: 1 }} component={"div"} >
                    {
                        tags.map((tag, i) =>
                            <Chip key={i} size="small" label={`#${tag.titulo}`} variant="outlined" sx={{ mr: 0.5 }} />)
                    }
                </Typography>


            </CardContent>

            <CardActions display="flex" sx={{ mt: {xs: 14, sm: 12, md: 12, lg: 9}, flexDirection: 'row-reverse'}} >
                <Button variant='outlined' size="small" startIcon={<DownloadIcon />  } > Descargar </Button>
            </CardActions>

        </Card>

    );
}

OfertaCard.propTypes = {
    children: PropTypes.node,
    id: PropTypes.number,
    titulo: PropTypes.string,
    descripcion: PropTypes.string,
    imagen: PropTypes.string,
    enlace: PropTypes.string,
    categoria: PropTypes.object,
    localizaciones: PropTypes.array,
    tags: PropTypes.array
}