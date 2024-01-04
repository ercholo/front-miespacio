import FeedNoticias from "./noticias/FeedNoticias";
import { PanelAccesosRapidos } from "./principal/PanelAccesosRapidos";

export const PantallaPrincipal = () => {
    
    return (
        <>
            <PanelAccesosRapidos />          
            <FeedNoticias />
        </>
    );
}
