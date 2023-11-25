import { addDays } from "date-fns";
import React from "react";
import { useSelector } from "react-redux"
import { redux_usuario_select_Asignaciones, redux_usuario_select_Usuario } from "../../../../redux/usuario/usuarioSlice";
import { PasoGeneral } from "./PasoGeneral"
import { PasoHoteles } from "./PasoHoteles"
import { PasoInicial } from "./PasoInicial";
import { PasoResumen } from "./PasoResumen"
import { PasoTransporte } from "./PasoTransporte"
import { PasoViajeros } from "./PasoViajeros"


export const PASOS = ['Inicio', 'General', 'Viajeros', 'Transporte', 'Hoteles', 'Resumen'];

export const TIPOS_VIAJE = [
	{ clave: 'empleado', texto: 'Viaje de empleado' },
	{ clave: 'asamblea', texto: 'Asambleas' },
	{ clave: 'formacion', texto: 'Formación' },
	{ clave: 'consejo', texto: 'Gastos Consejo' },
	{ clave: 'interventores', texto: 'Gastos Interventores' },
	{ clave: 'socios', texto: 'Gastos Socios' },
];

export const MEDIOS_TRANSPORTE = [
	{ clave: 'tren', texto: 'En tren' },
	{ clave: 'avion', texto: 'En avión' },
	{ clave: 'coche-alquiler', texto: 'En coche de alquiler' },
	{ clave: 'propio', texto: 'No se requiere' }
]

export const OPCIONES_HOTELES = [
	{ clave: 0, texto: 'No requiero alojamiento' },
	{ clave: 1, texto: 'Reservar en un hotel' },
	{ clave: 2, texto: 'Reservar en dos hoteles' },
	{ clave: 3, texto: 'Reservar en tres hoteles' },
]

export const NUMERO_EMPLEADOS_MAX = 9;




export const Paso = ({ numeroPaso, ...formulario }) => {
	switch (numeroPaso) {
		case 0: return <PasoInicial {...formulario} />
		case 1: return <PasoGeneral {...formulario} />
		case 2: return <PasoViajeros {...formulario} />
		case 3: return <PasoTransporte {...formulario} />
		case 4: return <PasoHoteles {...formulario} />
		default: return <PasoResumen {...formulario} />
	}
}


export const useFormularioViajes = () => {

	const usuario = useSelector(redux_usuario_select_Usuario);
	const asignaciones = useSelector(redux_usuario_select_Asignaciones);

	// PASO 0
	const [aceptaNormativa, setAceptaNormativa] = React.useState(false);

	// PASO 1
	const [motivo, setMotivo] = React.useState('');
	const [tipo, setTipo] = React.useState(TIPOS_VIAJE[0].clave);
	const [pep, setPep] = React.useState('');

	// PASO 2
	const datosEmpleadosIniciales = [];
	for (let i = 0; i < NUMERO_EMPLEADOS_MAX; i++) datosEmpleadosIniciales.push({ nombre: '', centroCoste: asignaciones.centroCoste })
	datosEmpleadosIniciales[0].nombre = `${usuario.nombre} ${usuario.apellidos}`;
	const [numeroViajeros, setNumeroViajeros] = React.useState(1);
	const [datosViajeros, setDatosViajeros] = React.useState(datosEmpleadosIniciales);

	// PASO 3
	const [medioTransporte, setMedioTransporte] = React.useState(MEDIOS_TRANSPORTE[0].clave);
	const [fechaViaje, setFechaViaje] = React.useState(addDays(new Date(), 1));
	const [origen, setOrigen] = React.useState('');
	const [destino, setDestino] = React.useState('');
	const [horaSalida, setHoraSalida] = React.useState(new Date("2000-01-01 08:00:00"));
	const [horaLlegada, setHoraLlegada] = React.useState(new Date("2000-01-01 18:00:00"));

	// PASO 4
	const datosHotelesIniciales = [];
	for (let i = 0; i < OPCIONES_HOTELES.length - 1; i++) datosHotelesIniciales.push({
		fechaEntrada: addDays(new Date(), 1),
		numeroNoches: 1,
		nombre: '',
		solicitaParking: false
	})
	const [numeroHoteles, setNumeroHoteles] = React.useState(OPCIONES_HOTELES[1].clave);
	const [datosHoteles, setDatosHoteles] = React.useState(datosHotelesIniciales);

	// PASO 5
	const [observaciones, setObservaciones] = React.useState('');
	const [email, setEmail] = React.useState('');


	const dispatcher = React.useCallback((accion, payload) => {
		switch (accion) {
			case 'setAceptaNormativa': return setAceptaNormativa(payload)
			case 'setMotivo': return setMotivo(payload);
			case 'setTipo': return setTipo(payload);
			case 'setPep': return setPep(payload);
			case 'setNumeroViajeros': return setNumeroViajeros(Math.max(Math.min(parseInt(payload) || 1, 9), 1));
			case 'setNombreViajero': {
				return setDatosViajeros(viejos => viejos.map((empleado, i) => {
					if (i === payload.index) return {
						...empleado,
						nombre: payload.payload
					}
					return empleado;
				})
				)
			}
			case 'setCentroCosteViajero': {
				return setDatosViajeros(viejos => viejos.map((viajero, i) => {
					if (i === payload.index) return {
						...viajero,
						centroCoste: payload.payload
					}
					return viajero;
				}))
			}
			case 'setMedioTransporte': return setMedioTransporte(payload)
			case 'setFechaViaje': return setFechaViaje(payload);
			case 'setOrigen': return setOrigen(payload);
			case 'setDestino': return setDestino(payload);
			case 'setHoraSalida': return setHoraSalida(payload);
			case 'setHoraLlegada': return setHoraLlegada(payload);
			case 'setNumeroHoteles': return setNumeroHoteles(payload);
			case 'setFechaEntradaHotel': {
				return setDatosHoteles(viejos => viejos.map((hotel, i) => {
					if (i === payload.index) return {
						...hotel,
						fechaEntrada: payload.payload
					}
					return hotel;
				}))
			}
			case 'setNumeroNochesHotel': {
				return setDatosHoteles(viejos => viejos.map((hotel, i) => {
					if (i === payload.index) return {
						...hotel,
						numeroNoches: Math.min(Math.max(1, parseInt(payload.payload) || 1), 99)
					}
					return hotel;
				}))
			}
			case 'setNombreHotel': {
				return setDatosHoteles(viejos => viejos.map((hotel, i) => {
					if (i === payload.index) return {
						...hotel,
						nombre: payload.payload
					}
					return hotel;
				}))
			}
			case 'setSolicitaParkingHotel': {
				return setDatosHoteles(viejos => viejos.map((hotel, i) => {
					if (i === payload.index) return {
						...hotel,
						solicitaParking: Boolean(payload.payload)
					}
					return hotel;
				}))
			}
			case 'setObservaciones': return setObservaciones(payload);
			case 'setEmail': return setEmail(payload);


			default: return console.log(`Acción incorrecta ${accion}`)
		}
	}, [setMotivo, setTipo, setPep, setNumeroViajeros, setDatosViajeros, setMedioTransporte, setFechaViaje, setOrigen, setDestino, setHoraSalida, setHoraLlegada, setNumeroHoteles, setDatosHoteles, setObservaciones, setEmail])


	const reset = React.useCallback(() => {
		setAceptaNormativa(false);

		// PASO 1
		setMotivo('');
		setTipo(TIPOS_VIAJE[0].clave);
		setPep('');

		// PASO 2
		const datosEmpleadosIniciales = [];
		for (let i = 0; i < NUMERO_EMPLEADOS_MAX; i++) datosEmpleadosIniciales.push({ nombre: '', centroCoste: asignaciones.centroCoste })
		datosEmpleadosIniciales[0].nombre = `${usuario.nombre} ${usuario.apellidos}`;
		setNumeroViajeros(1);
		setDatosViajeros(datosEmpleadosIniciales);

		// PASO 3
		setMedioTransporte(MEDIOS_TRANSPORTE[0].clave);
		setFechaViaje(addDays(new Date(), 1));
		setOrigen('');
		setDestino('');
		setHoraSalida(new Date("2000-01-01 08:00:00"));
		setHoraLlegada(new Date("2000-01-01 18:00:00"));

		// PASO 4
		const datosHotelesIniciales = [];
		for (let i = 0; i < OPCIONES_HOTELES.length - 1; i++) datosHotelesIniciales.push({
			fechaEntrada: addDays(new Date(), 1),
			numeroNoches: 1,
			nombre: '',
			solicitaParking: false
		})
		setNumeroHoteles(OPCIONES_HOTELES[1].clave);
		setDatosHoteles(datosHotelesIniciales);

		// PASO 5
		setObservaciones('');
		setEmail('');
	}, [setMotivo, setTipo, setPep, setNumeroViajeros, setDatosViajeros, setMedioTransporte, setFechaViaje, setOrigen, setDestino, setHoraSalida, setHoraLlegada, setNumeroHoteles, setDatosHoteles, setObservaciones, setEmail, asignaciones, usuario])

	return {
		dispatcher, reset,
		aceptaNormativa,
		motivo, tipo, pep,
		numeroViajeros, datosViajeros,
		medioTransporte, fechaViaje, origen, destino, horaSalida, horaLlegada,
		numeroHoteles, datosHoteles,
		observaciones, email
	}
}


export default Paso;