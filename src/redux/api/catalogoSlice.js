import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SAP from '../../api/sap';

export const actualizarCatalogo = createAsyncThunk('catalogo/actualizarCatalogo',
	async (_, redux) => {

		let consulta = redux.getState().catalogo;
		try {
			let respuesta = await SAP(redux).consultaCatalogo(consulta.patronBusqueda, consulta.pagina, consulta.limite);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			let mensaje = SAP.generarErrorFetch(error);
			return redux.rejectWithValue(mensaje);
		}
	}
);




export const apiSlice = createSlice({
	name: 'catalogo',
	initialState: {
		estado: 'inicial',
		patronBusqueda: '',
		pagina: 1,
		limite: 50,
		materiales: [],
		error: null,
		materialSeleccionado: null
	},
	reducers: {
		setLimite: (state, action) => {
			state.limite = action.payload;
			state.pagina = 1;
		},
		setPagina: (state, action) => {
			state.pagina = action.payload;
		},
		setPatronBusqueda: (state, action) => {
			state.patronBusqueda = action.payload;
		},
		setMaterialSeleccionado: (state, action) => {
			let codigoSeleccionado = action.payload;
			state.materialSeleccionado = state.materiales.find(material => material.codigo === codigoSeleccionado)
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(actualizarCatalogo.pending, (state) => {
				state.estado = 'cargando';
				state.error = null;
			})
			.addCase(actualizarCatalogo.fulfilled, (state, action) => {
				state.materiales = action.payload;
				state.estado = 'completado';
				state.error = null;
			})
			.addCase(actualizarCatalogo.rejected, (state, action) => {
				state.materiales = [];
				state.estado = 'error';
				state.error = action.payload;
			});
	},
});



export const { setLimite, setPagina, setPatronBusqueda, setMaterialSeleccionado } = apiSlice.actions;
export default apiSlice.reducer;
