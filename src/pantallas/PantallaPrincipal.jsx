import React from "react";
import FeedNoticias from "./noticias/FeedNoticias";
import PanelAccesosRapidos from "./principal/PanelAccesosRapidos";
// import PanelNotificaciones from "./principal/PanelNotificaciones";

export default function PantallaPrincipal() {
    return (
        <>
            <PanelAccesosRapidos />
            {/*<PanelNotificaciones />*/}
            <FeedNoticias />
        </>
    );
}
