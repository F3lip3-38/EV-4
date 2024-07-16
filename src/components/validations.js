

export const validateDescripcion = (descripcion) => {
    if (!descripcion) {
        return "La descripción es obligatoria.";
    }
    if (descripcion.length < 4) {
        return "La descripción debe tener al menos 3 caracteres.";
    }
    return "";
};

export const validateCategoria = (categoria) => {
    if (!categoria) {
        return "La categoría es obligatoria.";
    }
    return "";
};

export const validateMonto = (monto) => {
    if (!monto) {
        return "El monto es obligatorio.";
    }
    if (isNaN(monto) || monto <= 0) {
        return "El monto debe ser un número positivo.";
    }
    return "";
};

export const validateFecha = (fecha) => {
    if (!fecha) {
        return "La fecha es obligatoria.";
    }
    const fechaIngresada = new Date(fecha);
    const fechaActual = new Date();
    if (fechaIngresada > fechaActual) {
        return  "La fecha no puede ser en el futuro.";
    }
    return "";
};