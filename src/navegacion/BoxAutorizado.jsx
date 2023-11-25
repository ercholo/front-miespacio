import useAutorizacion from '../hooks/useAutorizacion'

const BoxAutorizado = ({ permisos, children }) => {
    const autorizado = useAutorizacion(permisos);

    if (autorizado) return children;
    return null;
};

export default BoxAutorizado;
