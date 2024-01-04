import { Route, Routes } from "react-router";
import { PantallaRetenciones } from "./PantallaRetenciones";


export default function PantallaIrpf() {
	return (<>
		<Routes >
			<Route path="retenciones" element={<PantallaRetenciones />} />
			<Route path="*" element={<PantallaRetenciones />} />
		</Routes >
	</>
	)
}