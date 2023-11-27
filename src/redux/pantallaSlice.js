import {useEffect} from 'react';

import { createSlice } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';

export const pantallaSlice = createSlice({
	name: 'api',
	initialState: {
		titulo: 'Mi Espacio'// 👩 👵 👩‍🦰 👩‍🦱 👩‍🦳 👱‍♀️' //🎀
	},
	reducers: {
		setTituloPantalla: (state, action) => {
			state.titulo = action.payload
		}
	}
});

export const usePantalla = (titulo) => {

	let dispatch = useDispatch();
	let pantalla = useSelector(state => state.pantalla);

	useEffect(() => {
		if (pantalla.titulo !== titulo) {
			dispatch(setTituloPantalla({ titulo }))
		}
	})
	return pantalla;
}

export const { setTituloPantalla } = pantallaSlice.actions;