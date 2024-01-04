import { ofertas } from './data/oferta';

import { TextField, Autocomplete, Stack } from '@mui/material/';


export const FiltrosOfertas = () => {

    const localizaciones = ofertas.flatMap(oferta => oferta.localizaciones.map(loc => loc.titulo)).filter((localizacion, i, arr) => arr.indexOf(localizacion) === i);
    const categorias = ofertas.flatMap(oferta => oferta.localizaciones.map(loc => loc.titulo)).filter((localizacion, i, arr) => arr.indexOf(localizacion) === i);

    return (

        <Stack spacing={3} sx={{ width: 500, padding: 3}}>

            <Autocomplete
                multiple
                id="tags-outlined"
                options={localizaciones}
                // getOptionLabel={(option) => { option.localizaciones.titulo }}
                // defaultValue={localizaciones[1]}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Localizaciones"
                        placeholder="Favoritas"
                    />
                )}
            />

        
            <Autocomplete
                multiple
                id="tags-outlined"
                options={categorias}
                // getOptionLabel={(option) => { option.localizaciones.titulo }}
                // defaultValue={localizaciones[1]}
                filterSelectedOptions
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Categorías"
                        placeholder="Favoritas"
                    />
                )}
            />


            
        </Stack>
    );
}
