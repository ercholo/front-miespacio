import { useAutorizacion } from '../hooks/useAutorizacion'
import PropTypes from 'prop-types';

export const BoxAutorizado = ({ permisos, children }) => {
    
    const autorizado = useAutorizacion(permisos);

    if (autorizado) return children;
    return null;
};

BoxAutorizado.propTypes = {
    permisos: PropTypes.obj,
    children: PropTypes.node,
}
