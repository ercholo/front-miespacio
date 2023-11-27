import PantallaPrincipal from './PantallaPrincipal';
import PantallaLogin from './PantallaLogin';
import PantallaLogout from './PantallaLogout';

import PantallaAccesos from './accesos/PantallaAccesos';
import { PantallaAccesosPrueba } from './accesos/PantallaAccesosPrueba';
import PantallaAnticipos from './anticipos/PantallaAnticipos';
import PantallaGestiones from './gestiones/PantallaGestiones';
import PantallaNomina from './nomina/PantallaNomina';
import PantallaEncuestas from './encuestas/PantallaEncuestas';
import PantallaResultadoEncuestas from './encuestas/PantallaResultadoEncuestas';
import PantallaTickets from './tickets/PantallaTickets';
import PantallaVales from './vales/PantallaVales';
import PantallaIrpf from './irpf/PantallaIrpf';
import RouterNoticias from './noticias/RouterNoticias';

import { PantallaTerminales} from './_admin/terminales/PantallaTerminales';

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
	Encuestas: PantallaEncuestas,
	Admin: {
		Terminales: PantallaTerminales,
		Encuestas: PantallaResultadoEncuestas
	}
	
}

export default Pantallas;