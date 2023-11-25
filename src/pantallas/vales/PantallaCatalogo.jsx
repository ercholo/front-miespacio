import React from "react";
import { useNavigate } from "react-router";

import { Alert, AlertTitle, Badge, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, Link, Paper, TextField, Typography, useMediaQuery } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SwitchAccessShortcutIcon from '@mui/icons-material/SwitchAccessShortcut';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';

// REDUX
import { useDispatch, useSelector } from "react-redux";
import { actualizarCatalogo, setMaterialSeleccionado, setPatronBusqueda } from "../../redux/api/catalogoSlice";
import { addMaterialEnCarrito, marcarCreacionPedidoVisualizada, setMaterialEnCarrito } from "../../redux/api/carritoSlice";
import SAP from "../../api/sap";
import { useTheme } from "@emotion/react";
import { redux_usuario_select_InfoPedidos } from "../../redux/usuario/usuarioSlice";



const LineaArticulo = ({ codigo, nombre, stock, precio, imagen }) => {

	const dispatch = useDispatch();
	const fnSeleccionarMaterial = React.useCallback(() => { dispatch(setMaterialSeleccionado(codigo)) }, [dispatch, codigo]);
	const [elevacion, setElevacion] = React.useState(1);
	const [sinImagen, setSinImagen] = React.useState(false);


	return <Grid item xs={12} lg={6} >
		<Paper elevation={elevacion} square onClick={fnSeleccionarMaterial}
			sx={{ pt: 3, pb: 2, px: 2, cursor: 'pointer' }}
			onMouseOver={() => setElevacion(5)}
			onMouseOut={() => setElevacion(1)}
		>

			<Typography variant="body1" component="div" sx={{ fontWeight: 'bold', ml: 2 }}>{nombre}</Typography>
			<Box sx={{ mt: 1, display: 'flex' }}>
				<Box sx={{ width: '100px', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
					{sinImagen ?
						<BrokenImageIcon sx={{ width: '70px', height: '70px', color: t => t.palette.grey[200], mb: 3 }} />
						:
						<img alt="" src={imagen} style={{ maxWidth: '100px', maxHeight: '100px' }}
							onError={() => setSinImagen(true)}
						/>
					}
				</Box>
				<Box sx={{ ml: 2 }}>
					<Typography variant="h6" component="div">{precio} €</Typography>
					<Typography variant="body2" component="div" sx={{ color: stock ? 'text.disabled' : 'error.main' }}>
						{stock ? `${stock} unidad${stock !== 1 && 'es'} en stock` : 'Fuera de stock'}
					</Typography>
					<Typography variant="caption" component="div">CN {codigo}</Typography>
				</Box>
			</Box>
		</Paper>
	</Grid>
}

const DialogoDetalleArticulo = () => {

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [mostrarOk, setMostrarOk] = React.useState(0);
	const refTimeout = React.useRef(null);
	const refCantidad = React.useRef(1);
	const materialSeleccionado = useSelector(state => state.catalogo.materialSeleccionado);
	const { codigoAlmacen } = useSelector(redux_usuario_select_InfoPedidos);

	React.useEffect(() => {
		setMostrarOk(0);
		setErrorImagen(false);
		if (refTimeout.current) clearTimeout(refTimeout.current);
		refTimeout.current = null;
	}, [materialSeleccionado])
	const fnDeseleccionarMaterial = React.useCallback(() => {
		dispatch(setMaterialSeleccionado(null))
	}, [dispatch])
	const fnVerCarrito = React.useCallback(() => {
		navigate('/vales/carrito');
		fnDeseleccionarMaterial();
	}, [navigate, fnDeseleccionarMaterial]);
	const fnAnadirCarrito = React.useCallback(() => {
		dispatch(addMaterialEnCarrito({ cantidad: Math.max(+refCantidad.current.value, 1), ...materialSeleccionado }))
		dispatch(marcarCreacionPedidoVisualizada());
		setMostrarOk(Math.max(+refCantidad.current.value, 1));
		if (refTimeout.current) clearTimeout(refTimeout.current);
		refTimeout.current = setTimeout(() => {
			setMostrarOk(0);
			refTimeout.current = null;
		}, 2500)
	}, [dispatch, materialSeleccionado, setMostrarOk])
	const fnEliminarCarrito = React.useCallback(() => {
		dispatch(setMaterialEnCarrito({ ...materialSeleccionado }))
		setMostrarOk(-1);
		if (refTimeout.current) clearTimeout(refTimeout.current);
		refTimeout.current = setTimeout(() => {
			setMostrarOk(0);
			refTimeout.current = null;
		}, 2500)
	}, [dispatch, materialSeleccionado, setMostrarOk])
	const contenidoCarrito = useSelector(state => state.carrito.materiales);
	const memoCantidadActual = React.useMemo(() => {
		if (!materialSeleccionado?.codigo) return 0;
		let material = contenidoCarrito.find(m => m.codigo === materialSeleccionado.codigo);
		if (material) return material.cantidad;
		return 0;
	}, [contenidoCarrito, materialSeleccionado])
	const fnControlInputPositivo = (e) => {
		if (e.target.value?.trim().length) {
			let valor = parseInt(e.target.value);
			if (!valor && valor !== '') e.target.value = 1;
			else if (valor < 0) e.target.value = e.target.value * -1;
			else e.target.value = valor;

			if (valor > materialSeleccionado.stock) e.target.value = materialSeleccionado.stock;
		}
	}
	const fnControlOnBlur = (e) => {
		if (!e.target.value?.trim().length) {
			e.preventDefault();
			e.target.value = 1;
		}
	}
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	const [errorImagen, setErrorImagen] = React.useState(false)

	let descripcion = (materialSeleccionado?.descripcion.startsWith('"') && materialSeleccionado?.descripcion.endsWith('"')) ?
		materialSeleccionado?.descripcion.substr(1, materialSeleccionado.descripcion.length - 2).trim()
		: materialSeleccionado?.descripcion;

	return <Dialog fullScreen={fullScreen} fullWidth maxWidth="lg" open={Boolean(materialSeleccionado)} onClose={fnDeseleccionarMaterial}			>

		<DialogContent sx={{ mt: { xs: 2, md: 6 }, display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' }, flexDirection: { xs: 'column', md: 'row' } }}>
			<Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', display: { md: 'none' }, mb: 2 }}>
				{materialSeleccionado?.nombre}
			</Typography>

			{!errorImagen &&
				<Box sx={{ display: 'flex', justifyContent: 'center', flexShrink: 1, mb: 2 }} >
					<Box sx={{ display: { sm: 'none' } }}>
						<img alt="" src={materialSeleccionado?.imagen} style={{ maxWidth: '200px', maxHeight: '200px' }} onError={() => setErrorImagen(true)} />
					</Box>
					<Box sx={{ display: { xs: 'none', sm: 'block', md: 'none' } }}>
						<img alt="" src={materialSeleccionado?.imagen} style={{ maxWidth: '300px', maxHeight: '300px' }} onError={() => setErrorImagen(true)} />
					</Box>
					<Box sx={{ display: { xs: 'none', md: 'block' }, pr: 10 }}>
						<img alt="" src={materialSeleccionado?.imagen} style={{ maxWidth: '400px', maxHeight: '400px' }} onError={() => setErrorImagen(true)} />
					</Box>
				</Box>
			}
			<Box sx={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'column' }}>
				<Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold', display: { xs: 'none', md: 'block' } }}>
					{materialSeleccionado?.nombre}
				</Typography>

				<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
					<Typography sx={{}}>
						Precio:
					</Typography>
					<Typography sx={{ color: 'text.primary', fontWeight: 'bold', ml: 1 }}>
						{materialSeleccionado?.precio}
					</Typography>
					<Typography sx={{ fontWeight: 'bold' }}>
						€
					</Typography>
				</Box>
				<Typography variant="caption" component="div" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
					Código material: {materialSeleccionado?.codigo}
				</Typography>
				<Typography variant="caption" component="div" sx={{ display: 'flex', justifyContent: 'flex-end' }}>
					{materialSeleccionado?.stock} unidad{materialSeleccionado?.stock !== 1 && 'es'} disponible{materialSeleccionado?.stock !== 1 && 's'} en {codigoAlmacen}
				</Typography>

				<Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
					{
						materialSeleccionado?.stock > 0 ?
							<>
								<TextField
									inputRef={refCantidad}
									defaultValue={1}
									onChange={fnControlInputPositivo}
									onBlur={fnControlOnBlur}
									autoFocus
									label="Cantidad"
									type="number"
									variant="outlined"
									color="secondary"
									size="small"
									sx={{ width: '10ch', mr: 2, mt: 0.2 }}
									InputLabelProps={{ shrink: true }}
								/>


								<Button
									variant="contained"
									onClick={fnAnadirCarrito}
									startIcon={<AddShoppingCartIcon />}
									sx={{ pt: 1 }}
								>
									Añadir al carrito
								</Button>
							</>
							:
							<Button
								variant="outlined"
								startIcon={<RemoveShoppingCartIcon />}
								disabled
								sx={{ pt: 1 }}
							>
								No hay stock en tu almacén
							</Button>
					}
				</Box>

				{memoCantidadActual > 0 &&
					<>
						<Typography variant="caption" component="div" sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
							Actualmente tienes {memoCantidadActual} unidad{memoCantidadActual !== 1 && 'es'} en el carrito.
							<Link variant="caption" color="secondary" onClick={fnEliminarCarrito} sx={{ cursor: 'pointer' }}>Eliminarla{memoCantidadActual !== 1 && 's'}</Link>
						</Typography>

						<Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
							<Button
								variant="outlined"
								size="small"
								color="secondary"
								onClick={fnVerCarrito}
								startIcon={<ArrowForwardIcon />}
								sx={{ pl: 1.4 }}
							>
								Ir al carrito
							</Button>
						</Box>
					</>
				}

				{mostrarOk > 0 &&
					<Alert color="success" sx={{ mt: 2 }}>
						Añadida{mostrarOk !== 1 && 's'} {mostrarOk} unidad{mostrarOk !== 1 && 'es'} al carrito.
					</Alert>
				}
				{mostrarOk < 0 &&
					<Alert color="info" sx={{ mt: 2 }}>
						Se ha eliminado el producto del carrito
					</Alert>
				}


				<Box sx={{ display: { md: 'none' }, mt: { xs: 2, md: 1 }, fontSize: '90%', color: 'text.secondary', textAlign: 'justify' }}>
					<div dangerouslySetInnerHTML={{ __html: descripcion }} />
				</Box>

			</Box>




		</DialogContent>

		<Box sx={{ display: { xs: 'none', md: 'block' }, mt: 0, px: 4, fontSize: '90%', color: 'text.secondary', textAlign: 'justify', maxHeight: '600px', overflow: 'auto' }}>
			<div dangerouslySetInnerHTML={{ __html: descripcion }} />
		</Box>



		<DialogActions sx={{ mb: { xs: 0, md: 2 }, mr: 2 }}>
			<Button variant="contained" color="info" onClick={fnDeseleccionarMaterial}>Atrás</Button>
		</DialogActions>
	</Dialog >
}

export default function PantallaCatalogo() {

	const dispatch = useDispatch();
	const navigate = useNavigate();

	let fnVerCarrito = React.useCallback(() => navigate('/vales/carrito'), [navigate]);
	let refPatronBusqueda = React.useRef();
	let fnEstablecerPatronBusqueda = React.useCallback(() => dispatch(setPatronBusqueda(refPatronBusqueda.current.value)), [dispatch]);
	let fnActualizaCatalogo = React.useCallback(() => dispatch(actualizarCatalogo()), [dispatch]);
	let fnTeclaFiltroPulsada = React.useCallback((e) => e.keyCode === 13 && fnActualizaCatalogo(), [fnActualizaCatalogo])

	const estadoCatalogo = useSelector(state => state.catalogo.estado);
	const materiales = useSelector(state => state.catalogo.materiales);
	const error = useSelector(state => state.catalogo.error);

	const materialesOrdenados = React.useMemo(() => {
		return [...materiales].sort((a, b) => {
			if (!a.stock && !b.stock) return 0;
			if (!a.stock) return 1;
			if (!b.stock) return -1;
			return 0;
		});
	}, [materiales])

	const carrito = useSelector(state => state.carrito.materiales);

	let contenido = null;
	if (estadoCatalogo === 'cargando') {
		contenido = <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
			<CircularProgress size={40} />
			<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">Buscando productos ...</Typography>
		</Box>
	} else if (error) {
		contenido = <Alert severity="error" sx={{ mt: 4 }}>
			<AlertTitle>Ocurrió un error al realizar la consulta</AlertTitle>
			{SAP.err2text(error)}
		</Alert>
	} else if (materialesOrdenados?.length > 0) {
		contenido = <Grid container spacing={2} sx={{ mt: 2 }}>
			{materialesOrdenados.map(material => {
				return <LineaArticulo key={material.codigo} {...material} />
			})}
		</Grid>
	} else {
		if (estadoCatalogo === 'inicial') {
			contenido = <>
				<Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-start', flexDirection: { xs: 'column', sm: 'row' } }}>
					<div><SwitchAccessShortcutIcon sx={{ width: '100px', height: '100px', color: 'text.disabled' }} /></div>
					<Typography sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 0, sm: 8 }, color: 'text.disabled' }} variant="h3" component="div">Busca algún artículo</Typography>
				</Box>
				<Typography sx={{ ml: { xs: 0, sm: 5, md: 15 }, mt: 2, color: 'text.disabled' }} variant="body1" component="div">Por ejemplo: "IA gel", "Aloe vera" o "Tiritas"</Typography>
			</>
		} else {
			contenido = <Box sx={{ mt: 6, textAlign: 'center' }}>
				<div><SentimentVeryDissatisfiedIcon sx={{ width: '60px', height: '60px', color: 'secondary.light' }} /></div>
				<Typography sx={{ ml: 2, mt: 1 }} variant="h5" component="div">Sin resultados</Typography>
			</Box>
		}
	}


	return (
		<>
			<Box sx={{ display: 'flex' }}>
				<FormControl fullWidth variant="outlined" color="secondary" sx={{ flexGrow: 1 }}>
					<InputLabel htmlFor="standard-adornment-password">Búsqueda de artículos</InputLabel>
					<Input
						inputRef={refPatronBusqueda}
						onChange={fnEstablecerPatronBusqueda}
						onKeyDown={fnTeclaFiltroPulsada}
						id="standard-adornment-password"
						type="text"
						fullWidth
						endAdornment={
							<InputAdornment position="end">
								<IconButton edge="end" sx={{ mb: 2, mr: 0 }} onClick={fnActualizaCatalogo}>
									<SearchIcon sx={{ height: 32, width: 32 }} />
								</IconButton>
							</InputAdornment>
						}

					/>
				</FormControl>
				<Badge color="primary" overlap="circular" badgeContent={carrito.length} max={99} sx={{ ml: 2 }}>
					<IconButton color="secondary" component="span" sx={{ height: 50, width: 50 }} onClick={fnVerCarrito} disabled={!carrito.length}>
						<ShoppingCartIcon sx={{ height: 42, width: 42 }} />
					</IconButton>
				</Badge>
			</Box>

			<Box sx={{ mt: 1 }}>
				{contenido}
			</Box>

			<DialogoDetalleArticulo />

		</>
	)


}