import { ofertas } from './data/oferta';
import PropTypes from 'prop-types';

import { useEffect, useState } from 'react';

import { TextField, Autocomplete, Box, Chip } from '@mui/material/';
import Grid from '@mui/material/Unstable_Grid2';

export const FiltrosOfertas = ({ setOfertasFiltradas }) => {

    const [valueLocalizacion, setValueLocalizacion] = useState([]);
    const [valueCategoria, setValueCategoria] = useState([]);
    const [valueTag, setValueTag] = useState([]);

    //Leo las localizaciones y categorías de los cards y elimino las repeticiones.
    const localizaciones = ofertas.flatMap(oferta => oferta.localizaciones.map(loc => loc.titulo)).filter(Boolean).filter((localizacion, i, arr) => arr.indexOf(localizacion) === i);
    const localizacionesVacias = ofertas.flatMap(oferta => oferta.localizaciones.map(loc => loc.titulo)).filter((localizacion, i, arr) => arr.indexOf(localizacion) === i);
    const tags = ofertas.flatMap(oferta => oferta.tags.map(loc => loc.titulo)).filter(Boolean).filter((tag, i, arr) => arr.indexOf(tag) === i);
    const categorias = ofertas.map(oferta => oferta.categoria.titulo).filter(Boolean).filter((titulo, i, arr) => arr.indexOf(titulo) === i);

    //Capturo el evento del cambio en la Localización
    const handleChangeLocalizacion = (event, value) => {
        event.preventDefault();
        setValueLocalizacion(value.filter(Boolean))
    }

    //Capturo el evento del cambio en la Categoría
    const handleChangeCategoria = (event, value) => {
        event.preventDefault();
        setValueCategoria(value);
    }
    //Añado el nuevo tag al value
    const handleClickTag = (tag) => {
        if (valueTag.includes(tag)) return null;
        setValueTag([...valueTag, tag]);

    }
    //Filtro el array con los datos distintos al tag y lo SetTeo
    const handleDeleteTag = (tag) => {
        setValueTag(prevValueTag => prevValueTag.filter(t => t !== tag));
    }

    // //Obtengo objetos resultantes de la selección por Categoría
    // const filtrarOfertasCategorias = useCallback(() => {
    //     return ofertas.filter(oferta => valueCategoria.includes(oferta.categoria.titulo))
    // }, [valueCategoria]);

    //Obtengo objetos resultantes de la selección por Localización
    // const filtrarOfertasLocalizaciones = useCallback(() => {
    //     return ofertas.filter(oferta =>
    //         oferta.localizaciones.some(loc => valueLocalizacion.includes(loc.titulo))
    //     )
    // }, [valueLocalizacion]);

    // const filtrarOfertasTags = useCallback(() => {
    //     return ofertas.filter(oferta =>
    //         oferta.tags.some(tag => valueTag.includes(tag.titulo))
    //     )
    // }, [valueTag]);


    useEffect(() => {

        let ofertasFiltradas = [...ofertas];

        let ofertasFiltradasVacías = [];

        if (Array.isArray(valueCategoria) && valueCategoria.length > 0) {
            ofertasFiltradas = ofertasFiltradas.filter(oferta =>
                valueCategoria.includes(oferta.categoria.titulo)
            );
        }

        if (Array.isArray(valueLocalizacion) && valueLocalizacion.length > 0) {

            ofertasFiltradasVacías = ofertasFiltradas
                .filter(oferta =>
                    oferta.localizaciones.some(loc => loc.titulo.length === 0))

            console.log(ofertasFiltradasVacías)

            ofertasFiltradas = ofertasFiltradas
                .filter(oferta =>
                    oferta.localizaciones.some(loc => valueLocalizacion.includes(loc.titulo))
                );
            ofertasFiltradas = ofertasFiltradas.concat(ofertasFiltradasVacías)
            console.log(ofertasFiltradas)
        }

        if (Array.isArray(valueTag) && valueTag.length > 0) {
            ofertasFiltradas = ofertasFiltradas.filter(oferta =>
                oferta.tags.some(tag => valueTag.includes(tag.titulo))
            );
        }

        setOfertasFiltradas(ofertasFiltradas);

        //He eliminado localizaciones y  localizacionesVacias para que no se renderice de más
    }, [valueLocalizacion, valueCategoria, valueTag]);



    return (

        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2} justifyContent="center" >
                <Grid xs={12} sm={12} md={6} lg={6} sx={{ padding: 1 }}>
                    <Autocomplete
                        multiple
                        id="localizacionesVacias"
                        options={localizaciones}
                        className='localizacionesVacias'
                        filterSelectedOptions
                        onChange={handleChangeLocalizacion}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Localizaciones"
                                placeholder="Favoritas"
                            />
                        )}
                    />
                </Grid>

                <Grid xs={12} sm={12} md={6} lg={6} sx={{ padding: 1 }}>
                    <Autocomplete
                        multiple
                        id="categorias"
                        className='categorias'
                        options={categorias}
                        filterSelectedOptions
                        onChange={handleChangeCategoria}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Categorías"
                                placeholder="Favoritas"
                            />
                        )}
                    />
                </Grid>

                <Grid container justifyContent="center" xs={12} sm={12} md={12} lg={12} >

                    {tags.map((tag, i) => (

                        <Chip
                            sx={{ mt: 1, ml: 1, mb: 2 }}
                            key={i}
                            label={tag}
                            onClick={() => handleClickTag(tag, i)}
                            onDelete={valueTag.includes(tag) ? () => handleDeleteTag(tag, i) : null}
                            // color={valueTag.includes(tag) ? "success" : "info"}
                            color="success"
                            variant={valueTag.includes(tag) ? "" : "outlined"}
                        // deleteIcon={valueTag.includes(tag) ? "" : <IconButton disabled> </IconButton>}
                        />

                    ))
                    }
                </Grid>
            </Grid>
        </Box>
    );
}

FiltrosOfertas.propTypes = {
    setOfertasFiltradas: PropTypes.func,
}