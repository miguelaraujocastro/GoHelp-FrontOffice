window.onload = function () {
document.getElementById('btnInscreverEvento').addEventListener('click', function () {
    
    const loginData = JSON.parse(localStorage.getItem("login"));
    const inscricaoModal = new bootstrap.Modal(document.getElementById('confirmationModalInscricaoEvento'));
    
    if (loginData && loginData.name && loginData.email) {
        inscricaoModal = new bootstrap.Modal(document.getElementById('confirmationModalInscricaoEvento'));
        inscricaoModal.show();
    } else {
        var loginNaoEfetuado = new bootstrap.Modal(document.getElementById('loginNaoEfetuadoPedidoEvento'));
        loginNaoEfetuado.show();
    }
});
};