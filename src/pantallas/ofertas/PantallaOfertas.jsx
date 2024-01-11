import { OfertaCard } from "./OfertaCard"
import { FiltrosOfertas } from "./FiltrosOfertas";

import { Box } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from "react";

export const PantallaOfertas = () => {

    const [ ofertasFiltradas , setOfertasFiltradas ] = useState([]);

    return (

        <>
            <FiltrosOfertas setOfertasFiltradas={setOfertasFiltradas} />
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2}>

                    {
                        ofertasFiltradas.map(oferta => (

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
        </>
    )
}
