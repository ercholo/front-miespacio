import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import SAP from '../../api/sap';

export const descargarAlbaranPdf = createAsyncThunk('albaranPdf/descargarPdf',
	async ({ numeroAlbaran, modoVisualizacion }, redux) => {

		try {
			let respuesta = await SAP(redux).descargarAlbaranPdf(numeroAlbaran);
			return redux.fulfillWithValue({ pdf: respuesta, numeroAlbaran, modoVisualizacion });
		} catch (error) {
			let mensaje = SAP.generarErrorFetch(error);
			return redux.rejectWithValue({ error: mensaje, numeroAlbaran, modoVisualizacion });
		}
		
	}
);

export const descargaAlbaranPdfSlice = createSlice({
	name: 'albaranPdf',
	initialState: {
		descargas: {},
		tmpNumeroAlbaran: null,
		tmpModoVisualizacion: null
	},
	reducers: {
		preparaDescargaAlbaranPdf: (state, action) => {
			state.tmpNumeroAlbaran = action.payload.numeroAlbaran;
			state.tmpModoVisualizacion = action.payload.modoVisualizacion;
		},
		completarDescargaAlbaranPdf: (state, action) => {
			state.descargas[action.payload].modoVisualizacion = 'completado'
		},
		descartarErroresAlbaranPdf: (state, action) => {
			state.descargas[action.payload].estado = 'inicial';
			state.descargas[action.payload].error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(descargarAlbaranPdf.pending, (state) => {
				state.descargas[state.tmpNumeroAlbaran] = {
					estado: 'cargando',
					error: null,
					pdf: null,
					modoVisualizacion: state.tmpModoVisualizacion
				};
				state.tmpNumeroAlbaran = null;
				state.tmpModoVisualizacion = null;
			})
			.addCase(descargarAlbaranPdf.fulfilled, (state, action) => {
				let { pdf, numeroAlbaran, modoVisualizacion } = action.payload;
				state.descargas[numeroAlbaran] = {
					estado: 'completado',
					error: null,
					pdf,
					modoVisualizacion: modoVisualizacion
				};
			})
			.addCase(descargarAlbaranPdf.rejected, (state, action) => {
				let { error, numeroAlbaran, modoVisualizacion } = action.payload;
				state.descargas[numeroAlbaran] = {
					estado: 'error',
					error,
					pdf: null,
					modoVisualizacion: modoVisualizacion
				};
			});
	},
});

export const { preparaDescargaAlbaranPdf, completarDescargaAlbaranPdf, descartarErroresAlbaranPdf } = descargaAlbaranPdfSlice.actions;
