import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from "jwt-decode";

import { createCustomSelector } from '../../redux/createCustomSelector';
import MsRestError from '@hefame/microservice-rest-error';


//La nomenclatura del primer argumento createAsyncThunk es "nombre del slice/nombre del thunk".
export const redux_usuario_inicializar = createAsyncThunk('usuario/redux_usuario_inicializar',
	async (payload, redux) => {

		//Si no hay token pues pijos
		const { token } = payload;
		if (!token) {
			const msError = new MsRestError('NO_TOKEN', 'No se encontró el token', 'redux_usuario_inicializar')
			return redux.rejectWithValue({ error: msError.toJSON(), needLogin: true });
		}

		//Aquí se obtienen los datos del token para su posterior return 
		const tokenData = jwtDecode (token);
		if (!tokenData.exp) {
			const msError = new MsRestError('INVALID_TOKEN', 'El token no contiene los campos requeridos', 'redux_usuario_inicializar')
			return redux.rejectWithValue({ error: msError.toJSON(), needLogin: true });
		}

		//tokenTTL son los segundos qu te quedan para que caduque el token
		const tokenTTL = tokenData.exp - ((new Date()).getTime() / 1000);		
		if (tokenTTL < 0) {
			const msError = new MsRestError('EXPIRED_TOKEN', 'El token está caducado', 'redux_usuario_inicializar')
			return redux.rejectWithValue({ error: msError.toJSON(), needLogin: true });
		}

		console.log(`Se establece logout dentro de ${parseInt(tokenTTL)} segundos`)

		//esta es la cuenta atrás del token para hacer logout
		const timeoutLogout = setTimeout(() => {
			console.log('Realizando logout...');
			window.location.href = '/logout';
		}, Math.min(parseInt(tokenTTL * 1000), 2_147_483_000)) // El MAX timeout posible es de 2.147.483 segundos

		//Devuelve los datos extraidos del token
		return redux.fulfillWithValue({
			name_id: tokenData.name_id,
			session_index: tokenData.session_index,
			nombre: tokenData.ssf.nombre,
			apellidos: tokenData.ssf.apellidos,
			email: tokenData.ssf.email,
			uid: tokenData.ssf.uid,
			tokenSap: tokenData.token,
			tokenApi: token,
			pedidosSap: tokenData.pedidos,
			asignaciones: tokenData.asignaciones,
			timeout: {
				logoff: timeoutLogout
			}
		});

	}
);

redux_usuario_inicializar.extraReducers = (builder) => {

	//Cuando realiza la acción de inicializar al usuario y comienza la acción asíncrona el estado pasa a 'cargando'.
	const asyncFoo = 'inicializar';
	builder.addCase(redux_usuario_inicializar.pending, (state) => {
		state.async[asyncFoo].estado = 'cargando';
		state.async[asyncFoo].error = null;
	});

	//Aquí la promesa ya ha sido terminada, se hacen las asignaciones y se cambia el estado a 'completado'
	builder.addCase(redux_usuario_inicializar.fulfilled, (state, action) => {
		const { name_id, session_index, nombre, apellidos, email, uid, tokenSap, tokenApi, pedidosSap, asignaciones, timeout } = action.payload;
		console.log(action.payload)
		state.sso.name_id = name_id;
		state.sso.session_index = session_index;
		state.codigoEmpleado = parseInt(uid);
		state.nombre = nombre;
		state.apellidos = apellidos;
		state.email = email;
		state.tokens.sap = tokenSap;
		state.tokens.api = tokenApi;

		state.asignaciones = asignaciones;

		state.pedidos.codigoCliente = '00' + pedidosSap.codigoCliente;
		state.pedidos.codigoAlmacen = pedidosSap.codigoAlmacen;

		state.async[asyncFoo].estado = 'completado';
		state.async[asyncFoo].error = null;

		if (state.async.timeout.logoff) {
			console.log(`Se elimina el timeout ${state.async.timeout.logoff}`)
			clearTimeout(state.async.timeout.logoff);
		}
		state.async.timeout.logoff = timeout.logoff;

	});
	builder.addCase(redux_usuario_inicializar.rejected, (state, action) => {
		const estado = action.payload.needLogin ? 'needLogin' : 'error';
		console.log('LOGIN RECHAZADO:', action.payload)
		state.async[asyncFoo].estado = estado;
		state.async[asyncFoo].error = action.payload.error;
	});
}


export const usuarioSlice = createSlice({
	name: 'usuario',

	initialState: {
		async: {
			inicializar: { estado: 'inicial', error: null },
			timeout: { logoff: null }
		},
		sso: { name_id: null, session_index: null },
		codigoEmpleado: null,
		nombre: null,
		apellidos: null,
		email: null,
		asignaciones: null,
		pedidos: { codigoCliente: null, codigoAlmacen: null, },
		tokens: { sap: null, api: null }
	},
	reducers: {
		redux_usuario_logout: (state) => {

			if (state.async.timeout.logoff) {
				console.log(`Se elimina el timeout ${state.async.timeout.logoff}`)
				clearTimeout(state.async.timeout.logoff);
			}

			state.async = {
				inicializar: { estado: 'inicial', error: null },
				timeout: {
					logoff: null
				}
			}
			state.sso = { name_id: null, session_index: null };
			state.codigoEmpleado = null;
			state.nombre = null;
			state.apellidos = null;
			state.email = null;
			state.asignaciones = null;
			state.pedidos = { codigoCliente: null, codigoAlmacen: null, };
			state.tokens = { sap: null, api: null };

		}
	},
	extraReducers: (builder) => {
		redux_usuario_inicializar.extraReducers(builder);
	}
});


const s1 = [
	(state) => state.usuario.async.inicializar
]
export const redux_usuario_select_EstadoInicializacion = createCustomSelector(s1, (estadoCarga) => {
	return {
		estado: estadoCarga.estado,
		error: estadoCarga.error
	}
})

const s2 = [
	(state) => state.usuario.codigoEmpleado,
	(state) => state.usuario.nombre,
	(state) => state.usuario.apellidos,
	(state) => state.usuario.email,
]

export const redux_usuario_select_Usuario = createCustomSelector(s2, (codigoEmpleado, nombre, apellidos, email) => {
	if (codigoEmpleado)
		return { codigoEmpleado, nombre, apellidos, email }
	return null;
})

const s3 = [
	(state) => state.usuario.pedidos,
	(state) => state.usuario.codigoEmpleado
]

export const redux_usuario_select_InfoPedidos = createCustomSelector(s3, (pedidos, codigoEmpleado) => {
	if (codigoEmpleado)
		return {
			...pedidos,
			codigoEmpleado,
		}
	return null;
})



const s4 = [
	(state) => state.usuario.asignaciones,
	(state) => state.usuario.codigoEmpleado
]
export const redux_usuario_select_Asignaciones = createCustomSelector(s4, (asignaciones, codigoEmpleado) => {
	if (codigoEmpleado)
		return {
			...asignaciones,
			codigoEmpleado
		};
	return null;
})



const s5 = [
	(state) => state.usuario.tokens,
	(state) => state.usuario.codigoEmpleado
]
export const redux_usuario_select_Tokens = createCustomSelector(s5, (tokens, codigoEmpleado) => {
	return {
		...tokens,
		codigoEmpleado
	};
})


const s6 = (state) => state.usuario.sso;
export const redux_usuario_select_SSO = createCustomSelector(s6, (sso) => {
	return sso;
})

export const { redux_usuario_logout } = usuarioSlice.actions;