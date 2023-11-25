import { useAutorizacion } from '../hooks/useAutorizacion'
import PropTypes from 'prop-types';

const BoxAutorizado = ({ permisos, children }) => {
    
    const autorizado = useAutorizacion(permisos);

    if (autorizado) return children;
    return null;
};

export default BoxAutorizado;

BoxAutorizado.propTypes = {
    permisos: PropTypes.obj,
    children: PropTypes.node,
}
