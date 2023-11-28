import { Routes, Route } from "react-router-dom";
import RouterGestionNoticias from "./gestion/RouterGestionNoticias";
import PantallaNoticia from "./PantallaNoticia";
import PantallaNoticias from "./PantallaNoticias";

export default function RouterNoticias() {

	return (<>
		<Routes >
			<Route path=":idNoticia" element={<PantallaNoticia />} />
			<Route path="gestion/*" element={<RouterGestionNoticias />} />
			<Route path="*" element={<PantallaNoticias />} />
			
		</Routes >
	</>
	)

}