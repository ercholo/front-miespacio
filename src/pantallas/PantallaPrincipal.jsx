import FeedNoticias from "./noticias/FeedNoticias";
import PanelAccesosRapidos from "./principal/PanelAccesosRapidos";

export default function PantallaPrincipal() {
    return (
        <>
            <PanelAccesosRapidos />          
            <FeedNoticias />
        </>
    );
}
