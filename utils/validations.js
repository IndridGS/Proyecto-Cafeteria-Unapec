// utils/validations.js
function validarRNC(rnc) {
    const peso = [7, 9, 8, 6, 5, 4, 3, 2];
    let suma = 0;

    if (rnc.length !== 9) return false;

    for (let i = 0; i < 8; i++) {
        if (!/^\d$/.test(rnc[i])) return false;
        suma += parseInt(rnc[i]) * peso[i];
    }

    const division = Math.floor(suma / 11);
    const resto = suma - (division * 11);
    const digito = resto === 0 ? 2 : (resto === 1 ? 1 : 11 - resto);

    return digito === parseInt(rnc[8]);
}

function validaCedula(cedula) {
    if (!/^\d{3}-\d{7}-\d{1}$/.test(cedula)) return false;

    let ced = cedula.replace(/-/g, '');
    let suma = 0;
    let verificador = 0;
    let peso = [1, 2, 1, 2, 1, 2, 1, 2, 1, 2];

    for (let i = 0; i < 10; i++) {
        let mult = ced.substr(i, 1) * peso[i];
        if (mult > 9) mult = Math.floor(mult / 10) + (mult % 10);
        suma += mult;
    }

    verificador = (10 - (suma % 10)) % 10;
    return verificador === parseInt(ced.substr(10, 1));
}

module.exports = { validarRNC, validaCedula };
