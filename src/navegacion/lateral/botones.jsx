import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import PaymentsIcon from "@mui/icons-material/Payments";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import SavingsIcon from "@mui/icons-material/Savings";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import GroupsIcon from "@mui/icons-material/Groups";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const botones = [
  { texto: "Inicio", icono: HomeOutlinedIcon, link: "/" },
  //	{ texto: "personal", esTitulo: true },
  { texto: "Mis nóminas", icono: PaymentsIcon, link: "/nomina" },
  {
    texto: "Anticipos",
    icono: SavingsIcon,
    link: "/anticipos",
    autorizacion: { areaPersonal: ["HF"] },
  },
  {
    texto: "Vales de emplead@",
    icono: ShoppingBagIcon,
    autorizacion: { areaPersonal: ["HF"] },
    subMenu: [
      {
        texto: "Crear vale",
        icono: AddShoppingCartIcon,
        link: "/vales/catalogo",
      },
      {
        texto: "Consultar mis vales",
        icono: ReceiptLongIcon,
        link: "/vales/consulta",
      },
    ],
  },
  {
    texto: "Certificado de Retenciones",
    icono: HistoryEduIcon,
    link: "/irpf/retenciones",
  },
  /*{
		texto: "IRPF", icono: AccountBalanceIcon, subMenu: [
			{ texto: "Situación", icono: AssignmentIndIcon, link: '/irpf/situacion' },
			{ texto: "Incremento Voluntario", icono: PercentIcon, link: '/irpf/incremento' },
		]
	},*/
  { texto: "Mis accesos", icono: FingerprintIcon, link: "/accesos" },

  //{ texto: "Empresa", esTitulo: true },
  { texto: "Soporte CPD", icono: SupportAgentIcon, link: "/tickets" },
  {
    texto: "Reserva de Salas",
    icono: GroupsIcon,
    link: "/gestiones/planificador-reuniones",
  },
  {
    texto: "Reserva de Vehículos",
    icono: TimeToLeaveIcon,
    link: "/gestiones/reserva-vehiculos",
  },
  {
    texto: "Solicitud de viaje",
    icono: AirplaneTicketIcon,
    link: "/gestiones/viajes",
  },

  {
    texto: "Administración",
    esTitulo: true,
    autorizacion: {
      funcionAsignada: [70091000],
      codigoEmpleado: [92409705, 90101521],
    },
  },
  {
    texto: "Noticias",
    icono: BuildCircleOutlinedIcon,
    link: "/noticias/gestion",
    autorizacion: {
      funcionAsignada: [70091000],
      codigoEmpleado: [92409705, 90101521],
    },
  },
  {
    texto: "Terminales Huella",
    icono: FingerprintIcon,
    link: "/admin/terminales",
    autorizacion: {
      funcionAsignada: [70091000],
      codigoEmpleado: [92409705, 90101521],
    },
  },
  /*{
		texto: "Gestiones", icono: BuildCircleOutlinedIcon, subMenu: [
			{ texto: "Planificación de reuniones", icono: GroupsIcon, link: '/gestiones/planificador-reuniones' },
			{ texto: "Reserva de Vehículos", icono: TimeToLeaveIcon, link: '/gestiones/reserva-vehiculos' }
		]
	},*/
];

export default botones;
