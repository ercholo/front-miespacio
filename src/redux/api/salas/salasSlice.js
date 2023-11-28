import { createSlice } from '@reduxjs/toolkit';
import { misReservasReducer } from "./salasSlice.misReservas";
import { zonasReducer } from "./salasSlice.zonas";
import { salasReducer } from "./salasSlice.salas";
import { reservasReducer } from "./salasSlice.reservas";

export const salasSlice = createSlice({
	name: 'salas',
	initialState:
	{
		zonas: {
			estado: 'inicial',
			resultado: null,
			error: null
		},
		salas: {
			estado: 'inicial',
			resultado: null,
			error: null
		},
		reservas: {
			estado: 'inicial',
			resultado: null,
			error: null
		},
		misReservas: {
			estado: 'inicial',
			resultado: null,
			error: null
		},
		cancelacionReserva: {
			idReserva: null,
			estado: 'inicial',
			resultado: null,
			error: null
		},
		creacionReservaSala: {
			estado: 'inicial',
			resultado: null,
			error: null
		},
		zonaSeleccionada: null,
		salaSeleccionada: null,
	},
	extraReducers: (builder) => {
		misReservasReducer(builder);
		zonasReducer(builder);
		salasReducer(builder);
		reservasReducer(builder);
	},
});
