import { OfertaCard } from "./OfertaCard"
import { FiltrosOfertas } from "./FiltrosOfertas";
import { ofertas } from "../ofertas/data/oferta"

import { Box } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';

export const PantallaOfertas = () => {

    return (
        <div>
            <FiltrosOfertas />
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>

                    {
                        ofertas.map(oferta => (

                            <Grid
                                sx={{ flexGrow: 1  }}
                                xs={12}
                                sm={6}
                                md={4}
                                lg={4}
                                key={oferta.id}
                            >

                                <OfertaCard
                                    key={oferta.id}
                                    {...oferta}
                                />

                            </Grid>
                        ))
                    }

                </Grid>
            </Box>
        </div>
    )
}
