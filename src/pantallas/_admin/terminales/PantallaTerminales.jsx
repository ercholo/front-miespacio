import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import PropTypes from 'prop-types';
import { Box, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import SentimentNeutralIcon from "@mui/icons-material/SentimentNeutral";
import { BoxCargando, BoxErrorApi } from "../../../navegacion/";
import { useStore } from "react-redux";
import API from "../../../api/api";
import { BoxErrorAutorizacion } from "../../../pantallas/BoxErrorAutorizacion";
import { useAutorizacion } from "../../../hooks/useAutorizacion";
import { useSnackbar } from "notistack";

export const TableRowTerminal = ({ id, centro, nombre, funciones, idVisualTime }) => {

  const { enqueueSnackbar } = useSnackbar();
  const redux = useStore();
  const [qActualizacion, setQActualizacion] = useState({
    estado: "completado",
    error: null,
  });
  const refTerminalVt = useRef();
  const [inputCambiado, setInputCambiado] = useState(false);

  const fnActualizarTerminal = useCallback(async () => {
    if (!inputCambiado) return;
    setInputCambiado(false);
    setQActualizacion({ estado: "cargando", error: null });

    try {
      await API(redux).terminales.put(id, refTerminalVt.current.value);
      setQActualizacion({ estado: "completado", error: null });
      enqueueSnackbar(
        <Box>
          <Typography variant="h6">Terminal {id}</Typography>
          <Typography variant="body2">({nombre})</Typography>
          <Typography variant="body1">
            {
              refTerminalVt.current.value
                ? (<>
                  Ahora apunta contra el ID <b>{refTerminalVt.current.value}</b>{" "}
                  de VisualTime
                </>)
                : (
                  <>Ya no se envían sus registros a VT</>
                )}
          </Typography>
        </Box>,
        {
          variant: refTerminalVt.current.value ? "success" : "warning",
        }
      );
    } catch (error) {
      setQActualizacion({ estado: "error", error });
      enqueueSnackbar(
        <BoxErrorApi msError={error} titulo="Error al actualizar terminal" />,
        { variant: "error" }
      );
    }
  }, [
    setQActualizacion,
    id,
    nombre,
    refTerminalVt,
    redux,
    enqueueSnackbar,
    inputCambiado,
    setInputCambiado,
  ]);

  const cargando = qActualizacion.estado === "cargando";

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell align="center">{id}</TableCell>
      <TableCell align="center">{centro}</TableCell>
      <TableCell>{nombre}</TableCell>
      <TableCell>
        {funciones
          .map((f) => {
            switch (f) {
              case "ENTRADA":
                return "E";
              case "SALIDA":
                return "S";
              case "SALIDAMOTIVO":
                return "M";
              case "ACCESO":
                return "A";
              default:
                return f;
            }
          })
          .join("/")}
      </TableCell>
      <TableCell align="center">
        <TextField
          size="small"
          label=""
          variant="standard"
          defaultValue={idVisualTime}
          inputRef={refTerminalVt}
          disabled={cargando}
          onBlur={fnActualizarTerminal}
          onChange={() => setInputCambiado(true)}
          inputProps={{ style: { textAlign: "center" } }}
          sx={{ width: "5ch" }}
        />
      </TableCell>
    </TableRow>
  );
};

export const PantallaTerminales = () => {
  const autorizado = useAutorizacion({
    funcionAsignada: [70091000],
    codigoEmpleado: [92409705, 90101521, 90101151],
  });

  const redux = useStore();
  const [qTerminales, setQTerminales] = useState({
    estado: "cargando",
    terminales: null,
    error: null,
  });
  const terminales = qTerminales.terminales;

  const centros = useMemo(() => {
    const c = new Set();
    if (terminales) {
      terminales.forEach((terminal) => {
        c.add(terminal.centro);
      });
    }
    return [...c];
  }, [terminales]);

  const funciones = useMemo(() => {
    const c = new Set();
    if (terminales) {
      terminales.forEach((terminal) => {
        terminal.funciones.forEach((funcion) => {
          c.add(funcion);
        });
      });
    }
    return [...c];
  }, [terminales]);

  const [filtros, setFiltros] = useState({
    centro: null,
    funcion: null,
    mapeado: null,
  });

  const fnCargarTerminales = useCallback(async () => {
    setQTerminales((v) => {
      return {
        estado: "cargando",
        terminales: v.terminales,
        error: null,
      };
    });

    try {
      const respuesta = await API(redux).terminales.get();
      setQTerminales({
        estado: "completado",
        terminales: respuesta,
        error: null,
      });
    } catch (error) {
      setQTerminales({ estado: "error", terminales: null, error });
    }
  }, [setQTerminales, redux]);

  useEffect(() => {
    fnCargarTerminales();
  }, [fnCargarTerminales]);

  const terminalesFiltrados = useMemo(() => {
    if (!terminales) return null;
    let filtrados = terminales;

    if (filtros?.centro) {
      filtrados = filtrados.filter((t) => t.centro === filtros.centro);
    }

    if (filtros?.funcion) {
      filtrados = filtrados.filter((t) =>
        t.funciones.includes(filtros.funcion)
      );
    }

    if (filtros.mapeado === "si") {
      filtrados = filtrados.filter((t) => t.idVisualTime);
    } else if (filtros.mapeado === "no") {
      filtrados = filtrados.filter((t) => !t.idVisualTime);
    }

    return filtrados;
  }, [terminales, filtros]);

  if (!autorizado) return <BoxErrorAutorizacion />;

  const dispathCambioFiltro = (accion, valor) => {
    setFiltros((f) => {
      return {
        ...f,
        [accion]: valor,
      };
    });
  };

  let contenido = null;
  const cargando = qTerminales.estado === "cargando";

  const formularioFiltros = (
    <Box
      sx={{
        borderBottomColor: "primary.main",
        borderBottomStyle: "solid",
        borderBottomWidth: 2,
        mb: 2,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >

      <FormControl sx={{ m: 1, minWidth: 150 }}>
        <InputLabel>Centro</InputLabel>
        <Select
          value={filtros.centro || ""}
          label="Centro"
          onChange={(e) => {
            dispathCambioFiltro("centro", e.target.value);
          }}
        >
          <MenuItem value="">
            <em>Todos</em>
          </MenuItem>
          {centros
            .filter((O) => O)
            .map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 200 }}>
        <InputLabel>Función</InputLabel>
        <Select
          value={filtros.funcion || ""}
          label="Función"
          onChange={(e) => {
            dispathCambioFiltro("funcion", e.target.value);
          }}
        >
          <MenuItem value="">
            <em>Todas</em>
          </MenuItem>
          {funciones.map((f) => (
            <MenuItem key={f} value={f}>
              {f}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ m: 1, minWidth: 240 }}>
        <InputLabel>VisualTime</InputLabel>
        <Select
          value={filtros.mapeado || ""}
          label="VisualTime"
          onChange={(e) => {
            dispathCambioFiltro("mapeado", e.target.value);
          }}
        >
          <MenuItem value="">
            <em>Todo</em>
          </MenuItem>
          <MenuItem value="si">Los que SI se evían</MenuItem>
          <MenuItem value="no">Los que NO se envían</MenuItem>
        </Select>
      </FormControl>

    </Box>
  );

  if (cargando && !terminalesFiltrados?.length) {
    contenido = (
      <BoxCargando titulo="Recuperando información de los terminales" />
    );
  } else if (qTerminales.error) {
    contenido = (
      <BoxErrorApi
        msError={qTerminales.error}
        titulo="Error al recuperar los datos"
      />
    );
  } else if (terminalesFiltrados?.length > 0) {
    contenido = (
      <>
        {formularioFiltros}
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">ID WINPLUS</TableCell>
                <TableCell align="center">CENTRO</TableCell>
                <TableCell>NOMBRE</TableCell>
                <TableCell>FUNCIONES</TableCell>
                <TableCell align="center">ID VISUALTIME</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {terminalesFiltrados.map((terminal) => (
                <TableRowTerminal key={terminal.id} {...terminal} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  } else {
    contenido = (
      <>
        {formularioFiltros}
        <Box sx={{ m: "auto", textAlign: "center" }}>
          <div>
            <SentimentNeutralIcon
              sx={{ width: "60px", height: "60px", color: "secondary.light" }}
            />
          </div>
          <Typography sx={{ mt: 1 }} variant="h5" component="div">
            No hay terminales que cumplan el filtro
          </Typography>
        </Box>
      </>
    );
  }

  return (
    <>
      <Box sx={{ m: "auto" }}>
        <Typography variant="h4" sx={{ m: "auto", mb: 2 }}>
          Terminales de Huella
        </Typography>
      </Box>

      {contenido}
    </>
  );
};

TableRowTerminal.propTypes = {
  id: PropTypes.number,
  centro: PropTypes.string,
  nombre: PropTypes.string,
  funciones: PropTypes.array,
  idVisualTime: PropTypes.number,
}