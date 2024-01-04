import { PantallaPrincipal } from './PantallaPrincipal';
import { PantallaLogin } from './PantallaLogin';
import { PantallaLogout } from './PantallaLogout';

import PantallaAccesos from './accesos/PantallaAccesos';
import { PantallaAccesosPrueba } from './accesos/PantallaAccesosPrueba';
import PantallaAnticipos from './anticipos/PantallaAnticipos';
import { PantallaEncuestas, PantallaResultadoEncuestas } from './encuestas/';
// import { PantallaResultadoEncuestas } from './encuestas/PantallaResultadoEncuestas';
import PantallaGestiones from './gestiones/PantallaGestiones';
import PantallaIrpf from './irpf/PantallaIrpf';
import { PantallaNomina } from './nomina/PantallaNomina';
import RouterNoticias from './noticias/RouterNoticias';
import PantallaTickets from './tickets/PantallaTickets';
import PantallaVales from './vales/PantallaVales';
import { PantallaOfertas } from './ofertas/PantallaOfertas';

import { PantallaTerminales } from './_admin/terminales/PantallaTerminales';

const Pantallas = {
	Principal: PantallaPrincipal,
	Login: PantallaLogin,
	Logout: PantallaLogout,
	Vales: PantallaVales,
	Nomina: PantallaNomina,
	Irpf: PantallaIrpf,
	Accesos: PantallaAccesos,
	AccesosPrueba: PantallaAccesosPrueba,
	Tickets: PantallaTickets,
	Anticipos: PantallaAnticipos,
	Gestiones: PantallaGestiones,
	Noticias: RouterNoticias,
	Ofertas: PantallaOfertas,
	Encuestas: PantallaEncuestas,
	Admin: {
		Terminales: PantallaTerminales,
		Encuestas: PantallaResultadoEncuestas
	}
	
}

export default Pantallas;