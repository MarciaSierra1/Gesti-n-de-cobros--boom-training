// script.js
const tiposEntrenamiento = {
    'funcional': 15000,
    'crossfit': 18000,
    'yoga': 12000,
    'pilates': 14000
};

document.addEventListener('DOMContentLoaded', function() {
    const selectTipo = document.getElementById('tipoEntrenamiento');
    const inputPrecio = document.getElementById('precio');
    
    if (selectTipo && inputPrecio) {
        selectTipo.addEventListener('change', function() {
            const tipoSeleccionado = this.value;
            if (tiposEntrenamiento[tipoSeleccionado]) {
                inputPrecio.value = tiposEntrenamiento[tipoSeleccionado];
            }
        });
    }
});
