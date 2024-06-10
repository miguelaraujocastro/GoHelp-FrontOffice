document.addEventListener('DOMContentLoaded', function() {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];

    // Calcula o número total de eventos
    const numeroTotalEventos = eventos.length;

    // Atualiza com o novo número de eventos
    document.getElementById('numero-total-eventos').textContent = numeroTotalEventos;
});


document.addEventListener('DOMContentLoaded', function() {
    const colaboradores = JSON.parse(localStorage.getItem('colaboradoresORG')) || [];

    // Calcula o número total de colaboradores
    const numeroTotalColaboradores = colaboradores.length;

    document.getElementById('numero-total-colaboradores').textContent = numeroTotalColaboradores;
});