import { API } from "../../../../api/api";
import React from "react";
import { useStore } from "react-redux";

const useVehiculos = () => {
    const redux = useStore();

    const [qVehiculos, setqVehiculos] = React.useState({
        estado: 'cargando',
        error: null,
        vehiculos: [],
        seleccionado: ''
    });
    const [qVehiculo, setqVehiculo] = React.useState({
        estado: 'inicial',
        error: null,
        vehiculo: null
    });



    const fnSeleccionarVehiculo = React.useCallback((matricula) => {
        setqVehiculos(e => {
            return {
                ...e,
                seleccionado: matricula
            }
        })
    }, [setqVehiculos])

    const fnCargarVehiculos = React.useCallback(async () => {
        setqVehiculos({ estado: 'cargando', error: null, vehiculos: [], seleccionado: '' })
        try {
            const vehiculos = await API(redux).vehiculos.get();
            setqVehiculos({ estado: 'completado', error: null, vehiculos, seleccionado: '' })
        } catch (error) {
            setqVehiculos({ estado: 'error', error, vehiculos: [], seleccionado: '' })
        }
    }, [redux, setqVehiculos]);

    const fnCargarReservasVehiculoSeleccionado = React.useCallback(async () => {
        if (qVehiculos.seleccionado === '') return;

        setqVehiculo({ estado: 'cargando', error: null, vehiculo: null })
        try {
            const vehiculo = await API(redux).vehiculos.idVehiculo.get(qVehiculos.seleccionado, {
                desde: new Date(),
                hasta: undefined
            });

            vehiculo.reservas = vehiculo.reservas.map(r => { return {...r, fechaInicio: new Date(r.fechaInicio), fechaFin: new Date(r.fechaFin)} })
            vehiculo.reservas.sort((a, b) => a.fechaInicio.getTime() - b.fechaInicio.getTime())
            
            setqVehiculo({ estado: 'completado', error: null, vehiculo })
        } catch (error) {
            setqVehiculo({ estado: 'error', error, vehiculo: null })
        }
    }, [redux, qVehiculos, setqVehiculo])


    // Carga inicial
    React.useEffect(() => { fnCargarVehiculos() }, [fnCargarVehiculos]);

    // Si cambia el vehiculo seleccionado, buscamos sus datos
    React.useEffect(() => { fnCargarReservasVehiculoSeleccionado() }, [fnCargarReservasVehiculoSeleccionado, qVehiculos.seleccionado]);


    return {
        qVehiculos,
        vehiculos: qVehiculos.vehiculos,
        matriculaSeleccionada: qVehiculos.seleccionado,

        qVehiculo,
        vehiculo: qVehiculo.vehiculo,


        fnSeleccionarVehiculo,
        fnCargarReservasVehiculoSeleccionado,
        fnCargarVehiculos
    }

}

export default useVehiculos;