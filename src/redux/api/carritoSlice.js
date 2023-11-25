import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import FEDICOM from '../../api/fedicom';
import { redux_usuario_select_InfoPedidos } from '../usuario/usuarioSlice';

export const realizarCompra = createAsyncThunk('carrito/realizarCompra',
	async (_, redux) => {
		let materiales = redux.getState().carrito.materiales;
		let infoPedidos = redux_usuario_select_InfoPedidos.from(redux.getState());

		let pedido = {
			codigoCliente: String(infoPedidos.codigoCliente),
			numeroPedidoOrigen: String((Math.random() * 10000).toFixed(0) + (Math.random() * 10000).toFixed(0)),
			codigoAlmacenServicio: infoPedidos.codigoAlmacen,
			lineas: materiales.map((mat, i) => {
				return {
					orden: i,
					codigoArticulo: mat.codigo,
					cantidad: mat.cantidad
				}
			})
		}

		try {
			let respuesta = await FEDICOM(redux).crearPedido(pedido);
			return redux.fulfillWithValue(respuesta);
		} catch (error) {
			console.log(error);
			let mensaje = FEDICOM.generarErrorFetch(error);
			return redux.rejectWithValue(mensaje);
		}
	}
);


export const carritoSlice = createSlice({
	name: 'carrito',
	initialState: {
		materiales: [],
		estado: 'inicial',
		resultado: null,
		error: null
	},
	reducers: {
		setMaterialEnCarrito: (state, action) => {
			if (!action.payload.cantidad) {
				state.materiales = [...state.materiales.filter(m => m.codigo !== action.payload.codigo)]
			} else {
				state.materiales = [action.payload, ...state.materiales.filter(m => m.codigo !== action.payload.codigo)];
			}
		},
		addMaterialEnCarrito: (state, action) => {
			if (parseInt(action.payload.cantidad) > 0) {
				if (state.materiales.find(m => m.codigo === action.payload.codigo)) {
					state.materiales = state.materiales.map(m => {
						if (m.codigo !== action.payload.codigo) return m;
						let nuevaCantidad = m.cantidad + parseInt(action.payload.cantidad)
						return { ...m, cantidad: nuevaCantidad }
					});
				} else {
					state.materiales = [action.payload, ...state.materiales];
				}
			}
		},
		limpiarCarrito: (state, _) => {
			state.materiales = [];
		},
		limpiarEstadoCreacionPedido: (state, _) => {
			state.estado = 'inicial';
			state.resultado = null;
			state.error = null;
		},
		marcarCreacionPedidoVisualizada: (state, _) => {
			state.estado = 'visualizada';
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(realizarCompra.pending, (state) => {
				state.resultado = null;
				state.estado = 'cargando';
				state.error = null;
			})
			.addCase(realizarCompra.fulfilled, (state, action) => {
				state.resultado = action.payload;
				state.estado = 'completado';
				state.error = null;
				state.materiales = [];
			})
			.addCase(realizarCompra.rejected, (state, action) => {
				state.resultado = null;
				state.estado = 'error';
				state.error = action.payload;
			});
	},
});



export const { setMaterialEnCarrito, addMaterialEnCarrito, limpiarCarrito, limpiarEstadoCreacionPedido, marcarCreacionPedidoVisualizada } = carritoSlice.actions;
export default carritoSlice.reducer;
