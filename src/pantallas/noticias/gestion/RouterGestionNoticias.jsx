import { useAutorizacion } from "../../../hooks/useAutorizacion";
import BoxErrorAutorizacion from "../../BoxErrorAutorizacion";
import React from "react";
import { Routes, Route } from "react-router-dom";
import PantallaCreacionNoticia from "./PantallaCreacionNoticia";
import PantallaEdicionNoticia from "./PantallaEdicionNoticia";
import PantallaGestionNoticias from "./PantallaGestionNoticias";

export default function RouterGestionNoticias() {
  const autorizado = useAutorizacion({
    funcionAsignada: [70091000],
    codigoEmpleado: [92409705, 90101521],
  });
  if (!autorizado) return <BoxErrorAutorizacion />;

  return (
    <>
      <Routes>
        <Route path="/*" element={<PantallaGestionNoticias />} />
        <Route path="/e/:idNoticia" element={<PantallaEdicionNoticia />} />
        <Route path="/a/*" element={<PantallaCreacionNoticia />} />
      </Routes>
    </>
  );
}
