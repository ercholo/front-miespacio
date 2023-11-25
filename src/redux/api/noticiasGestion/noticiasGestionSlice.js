import { createSlice } from '@reduxjs/toolkit';
import listadoReducer from './noticiasGestionSlice.listado'
import edicionReducer from './noticiasGestionSlice.edicion'

export const noticiasGestionSlice = createSlice({
	name: 'noticiasGestion',
	initialState:
	{
		listado: {
			consulta: {
				filtro: null,
				orden: null,
				offset: 0,
				limit: 0
			},
			estado: 'inicial',
			resultado: null,
			error: null
		},
		editor: {
			idNoticia: null,
			consulta: {
				estado: 'inicial',
				resultado: null,
				error: null
			},
			edicion: {
				estado: 'inicial',
				resultado: null,
				error: null
			},
		},
		crear: {
			estado: 'inicial',
			resultado: null,
			error: null
		},
		borrar: {
			idNoticia: null,
			estado: 'inicial',
			resultado: null,
			error: null
		}
	},
	reducers:{
		clearEditorNoticias: (state) => {
			state.editor.edicion.estado = 'inicial';
			state.editor.edicion.resultado = null;
			state.editor.edicion.error = null;
		},
		clearCreadorNoticias: (state) => {
			state.crear.estado = 'inicial';
			state.crear.resultado = null;
			state.crear.error = null;
		}
	},
	extraReducers: (builder) => {
		listadoReducer(builder);
		edicionReducer(builder);
	},
});

export const { clearEditorNoticias, clearCreadorNoticias } = noticiasGestionSlice.actions
export default noticiasGestionSlice.reducer;
