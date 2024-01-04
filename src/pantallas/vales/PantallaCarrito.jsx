import { Alert, Box, Button, Chip, CircularProgress, Grid, IconButton, Paper, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { limpiarCarrito, limpiarEstadoCreacionPedido, realizarCompra, setMaterialEnCarrito } from "../../redux/api/carritoSlice";
import PropTypes from 'prop-types';


const LineaArticulo = ({ codigo, nombre, descripcion, stock, precio, imagen, cantidad, bloqueado }) => {

	const dispatch = useDispatch();
	const refCantidad = React.useRef(cantidad);
	const fnActualizarCarrito = React.useCallback((e) => {
		let valor = parseInt(e.target.value);
		if (!valor && valor !== '') e.target.value = 1;
		else if (valor < 0) e.target.value = e.target.value * -1;
		else e.target.value = valor;

		if (valor > stock) e.target.value = stock;
		dispatch(setMaterialEnCarrito({ codigo, nombre, descripcion, stock, precio, imagen, cantidad: parseInt(e.target.value) }))
	}, [dispatch, codigo, nombre, descripcion, stock, precio, imagen])
	const fnEliminarCarrito = React.useCallback(() => {
		dispatch(setMaterialEnCarrito({ codigo, nombre, descripcion, stock, precio, imagen }))
	}, [dispatch, codigo, nombre, descripcion, stock, precio, imagen])

	const fnControlOnBlur = (e) => {
		if (!e.target.value?.trim().length) {
			e.preventDetault();
		}
	}
	const [sinImagen, setSinImagen] = React.useState(false);

	return <Paper elevation={1} square sx={{ pt: 3, pb: 2, px: 0, mb: 1 }}	>

		<Typography variant="body1" component="div" sx={{ fontWeight: 'bold', ml: 2 }}>
			{nombre}
		</Typography>
		<Box sx={{ mt: 1, display: 'flex' }}>
			<Box sx={{ width: '70px', height: '70px', display: 'flex', justifyContent: 'center', alignItems: 'center', ml: 2 }}>
				{sinImagen ?
					<BrokenImageIcon sx={{ width: '70px', height: '70px', color: t => t.palette.grey[200], mb: 3 }} />
					:
					<img alt="" src={imagen} style={{ maxWidth: '70px', maxHeight: '70px' }}
						onError={() => setSinImagen(true)}
					/>
				}
			</Box>
			<Box sx={{ ml: 2 }}>
				<Typography variant="caption">CN {codigo}</Typography>
				<Typography variant="body2" sx={{ alignSelf: 'flex-end', fontSize: '110%' }}>
					{(cantidad * precio).toFixed(2)}€
					{cantidad > 1 &&
						<Typography variant="body2" component="span" sx={{ color: 'text.disabled', fontSize: '90%', ml: 1 }}>
							{cantidad} ud{cantidad !== 1 && 's'} x {precio}€/ud
						</Typography>
					}
				</Typography>

				<Typography variant="body2" component="div" sx={{ color: stock ? 'text.disabled' : 'error.main' }}>
					{stock ? `${stock} unidad${stock !== 1 && 'es'} en stock` : 'Fuera de stock'}
				</Typography>

				<Box sx={{ mt: 2, display: { sm: 'none' } }}>
					<TextField
						inputRef={refCantidad}
						defaultValue={cantidad}
						onChange={fnActualizarCarrito}
						onBlur={fnControlOnBlur}
						label="Cantidad"
						type="number"
						variant="outlined"
						color="secondary"
						size="small"
						sx={{ width: '8ch' }}
						InputLabelProps={{ shrink: true }}
					/>
					<IconButton onClick={fnEliminarCarrito}>
						<DeleteIcon />
					</IconButton>
				</Box>

			</Box>

			<Box sx={{ mt: 2, mr: 3, ml: 'auto', display: { xs: 'none', sm: 'block' } }}>
				<TextField
					inputRef={refCantidad}
					defaultValue={cantidad}
					onChange={fnActualizarCarrito}
					onBlur={fnControlOnBlur}
					label="Cantidad"
					type="number"
					variant="outlined"
					color="secondary"
					size="small"
					sx={{ width: '8ch' }}
					InputLabelProps={{ shrink: true }}
					disabled={bloqueado}
				/>
				<IconButton onClick={fnEliminarCarrito} disabled={bloqueado}>
					<DeleteIcon />
				</IconButton>
			</Box>
		</Box>
	</Paper>
}

export const PantallaCarrito = () => {

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const fnIrCatalogo = React.useCallback(() => {
		navigate('/vales/catalogo')
	}, [navigate]);

	const contenidoCarrito = useSelector(state => state.carrito.materiales);
	const estadoCreacionPedido = useSelector(state => state.carrito.estado);
	const errorCreacionPedido = useSelector(state => state.carrito.error);
	const resultadoCreacionPedido = useSelector(state => state.carrito.resultado);

	const resumenCarrito = React.useMemo(() => {
		if (!contenidoCarrito?.length) return {
			materiales: 'Carrito vacio',
			total: 0
		}
		let clon = [...contenidoCarrito];
		clon.sort((a, b) => parseInt(a.codigo) - parseInt(b.codigo));
		return {
			materiales: clon.map(material => <LineaArticulo key={material.codigo} {...material} bloqueado={estadoCreacionPedido === 'cargando'} />),
			total: clon.reduce((v, m) => v + m.precio * m.cantidad, 0).toFixed(2)
		}
	}, [contenidoCarrito, estadoCreacionPedido])

	const fnLimpiarCarrito = React.useCallback(() => {
		dispatch(limpiarCarrito());
	}, [dispatch])

	if (resultadoCreacionPedido && estadoCreacionPedido !== 'visualizada') {
		let numeroPedidoSap = resultadoCreacionPedido.numerosPedidoSap?.join?.(', ') || 'SIN NUMERO PEDIDO'

		return <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4 }}>
			<CheckCircleOutlineIcon color="success" sx={{ mx: 'auto', width: '100px', height: '100px' }} />
			<Typography variant="caption" component="div" sx={{ fontSize: '110%', mx: 'auto', mt: 3, textAlign: 'center', fontWeight: 'bold' }}>
				Su pedido se ha registrado correctamente
			</Typography>
			<Typography variant="caption" component="div" sx={{ fontSize: '105%', mx: 'auto', textAlign: 'center' }}>
				El número de su pedido en SAP es:
			</Typography>

			<Box sx={{ mx: 'auto', mt: 2 }}>
				<Chip
					color="primary"
					label={numeroPedidoSap}
					variant="filled"
					sx={{ p: 2, fontWeight: 'bold', fontSize: '115%', fontFamily: 'consolas, monospace' }}
				/>
			</Box>
			<Button
				variant="outlined"
				color="secondary"
				onClick={fnIrCatalogo}
				sx={{ mt: 6, mx: 'auto' }}
				startIcon={<ArrowBackIcon />}
			>
				Volver al catálogo
			</Button>
		</Box>
	}

	if (!contenidoCarrito.length) {
		return <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column' }}>
			<ProductionQuantityLimitsIcon color="info" sx={{ mx: 'auto', width: '80px', height: '80px' }} />
			<Typography sx={{ mt: 1, mx: 'auto' }} variant="h5" component="div">
				¡No tiene ningún artículo en el carrito!
			</Typography>
			<Button
				variant="outlined"
				color="secondary"
				onClick={() => fnIrCatalogo()}
				sx={{ mt: 6, mx: 'auto' }}
				startIcon={<ArrowBackIcon />}
			>
				Ir al catálogo
			</Button>
		</Box>
	}

	return (
		<Box>
			<Typography variant="h4" sx={{ m: 'auto', mb: 2 }}>Resumen del pedido</Typography>
			<Grid container spacing={4} >

				<Grid item xs={12} md={4}>
					<Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
						<Typography sx={{ fontSize: '140%' }}>
							Precio total:
						</Typography>
						<Typography sx={{ color: 'text.primary', fontWeight: 'bold', ml: 1, fontSize: '140%' }}>
							{resumenCarrito.total}€
						</Typography>
					</Box>
					<Button
						fullWidth
						variant="contained"
						onClick={() => dispatch(realizarCompra())}
						sx={{ mt: 2 }}
						startIcon={<SendIcon />}
						disabled={estadoCreacionPedido === 'cargando'}
					>
						Realizar pedido
					</Button>
					<Button
						fullWidth
						variant="outlined"
						onClick={fnLimpiarCarrito}
						color="error"
						sx={{ mt: 2 }}
						disabled={estadoCreacionPedido === 'cargando'}
						startIcon={<ProductionQuantityLimitsIcon />}
					>
						Vaciar carrito
					</Button>
					<Button
						fullWidth
						variant="outlined"
						onClick={fnIrCatalogo}
						color="secondary"
						sx={{ mt: 4 }}
						disabled={estadoCreacionPedido === 'cargando'}
						startIcon={<ArrowBackIcon />}
					>
						Volver al catálogo
					</Button>
					{estadoCreacionPedido === 'cargando' &&
						<Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', flexDirection: 'row' }}>
							<div><CircularProgress /></div>
							<Typography sx={{ ml: 2, mt: 0.5 }} variant="h6" component="div">Creando pedido</Typography>
						</Box>
					}
					{errorCreacionPedido &&
						<Alert severity="error" sx={{ mt: 4 }} onClose={() => dispatch(limpiarEstadoCreacionPedido())}>
							<strong>Se ha producido un error:</strong>
							{errorCreacionPedido.map((error, i) => <div key={i}>• {error.descripcion} <small>[{error.codigo}]</small></div>)}
						</Alert>
					}
				</Grid>
				<Grid item xs={12} md={8} >
					{resumenCarrito.materiales}
				</Grid>
			</Grid>
		</Box>
	)


}


LineaArticulo.propTypes = {
	codigo: PropTypes.string,
	nombre: PropTypes.string,
	descripcion: PropTypes.string,
	stock: PropTypes.number,
	precio: PropTypes.number,
	imagen: PropTypes.string,
	cantidad: PropTypes.number,
	bloqueado: PropTypes.bool,
};
