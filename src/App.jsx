import { useCallback, useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// TEMA
import "./App.css";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import tema from "./navegacion/tema";

// MUI
import CssBaseline from "@mui/material/CssBaseline";

// REDUX
import { useSelector } from "react-redux";

import Pantallas from "./pantallas/Pantallas";

import { BarraSuperior } from "./navegacion/superior/BarraSuperior";
import { DrawerLateral } from "./navegacion/lateral/DrawerLateral";
import { Container, Paper } from "@mui/material";
import { redux_usuario_select_Usuario } from "./redux/usuario/usuarioSlice";
import { SnackbarProvider } from "notistack";

const RutasAutenticadas = () => {
    return (
        <Routes>
            <Route path="/logout" element={<Pantallas.Logout />} />
            <Route path="/vales/*" element={<Pantallas.Vales />} />
            <Route path="/nomina" element={<Pantallas.Nomina />} />
            <Route path="/irpf/*" element={<Pantallas.Irpf />} />
            <Route path="/accesos" element={<Pantallas.Accesos />} />
            <Route path="/accesos/prueba" element={<Pantallas.AccesosPrueba />} />
            <Route path="/tickets" element={<Pantallas.Tickets />} />
            <Route path="/anticipos" element={<Pantallas.Anticipos />} />
            <Route path="/gestiones/*" element={<Pantallas.Gestiones />} />
            <Route path="/noticias/*" element={<Pantallas.Noticias />} />
			<Route path="/encuestas/:idEncuesta" element={<Pantallas.Encuestas />} />
            <Route path="/admin/terminales" element={<Pantallas.Admin.Terminales />} />
            <Route path="/admin/encuestas/:idEncuesta" element={<Pantallas.Admin.Encuestas />} />
            <Route path="/*" element={<Pantallas.Principal />} />
        </Routes>
    );
};

const RutasNoAutenticadas = () => {
    return (
        <Routes>
            <Route path="/logout" element={<Pantallas.Logout />} />
            <Route path="/*" element={<Pantallas.Login />} />
        </Routes>
    );
};

const BarrasNavegacion = ({ autenticado }) => {
    const [drawerAbierto, setDrawerAbierto] = useState(false);
    const fnMostrarDrawerLateral = useCallback(
        (flag) => {
            if (flag === undefined) setDrawerAbierto(!drawerAbierto);
            else setDrawerAbierto(flag ? true : false);
        },
        [drawerAbierto, setDrawerAbierto]
    );

    return (
        <>
            {autenticado && <DrawerLateral abierto={drawerAbierto} fnCerrar={() => fnMostrarDrawerLateral(false)} fnAbrir={() => fnMostrarDrawerLateral(true)} />}
            <BarraSuperior onMenuLateralClick={fnMostrarDrawerLateral} />
        </>
    );
};

function App() {
    const usuario = useSelector(redux_usuario_select_Usuario);
    let usuarioAutenticado = Boolean(usuario);

    let contenido = null;
    if (!usuarioAutenticado) {
        contenido = <RutasNoAutenticadas />;
    } else {
        contenido = <RutasAutenticadas />;
    }

    return (
        <SnackbarProvider maxSnack={3} dense hideIconVariant>
            <ThemeProvider theme={tema}>
                <Router>
                    <CssBaseline />

                    <BarrasNavegacion autenticado={usuarioAutenticado} />

                    <Container fixed disableGutters sx={{ mt: { xs: 6, sm: 8 } }}>
                        <Paper elevation={2} sx={{ pt: { xs: 4, sm: 6 }, pb: { xs: 6, sm: 10 }, px: { xs: 3, sm: 6, md: 12 } }}>
                            {contenido}
                        </Paper>
                    </Container>
                </Router>
            </ThemeProvider>
        </SnackbarProvider>
    );
}

export default App;
