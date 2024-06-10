//Nome e Email dos Formularios Predefinidos segundo o login------------

const loginData = JSON.parse(localStorage.getItem("login"));
if(!loginData || !loginData.email || !loginData.name){

    var inputNome = document.getElementById("pedido-trabalho-name");
    inputNome.value = "Nome";
        
    var inputEmail = document.getElementById("pedido-trabalho-email");
    inputEmail.value = "Email";

}
else{
    var inputNome = document.getElementById("pedido-trabalho-name");
    inputNome.value = loginData.name;
        
    var inputEmail = document.getElementById("pedido-trabalho-email");
    inputEmail.value = loginData.email;
}


// SUBMETER PEDIDOS TRABALHO----------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    
    const pedidoTrabalhoForm = document.getElementById("pedidoTrabalhoForm");
    const modal = new bootstrap.Modal(document.getElementById('confirmationModal'));

    pedidoTrabalhoForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const loginData = JSON.parse(localStorage.getItem("login"));

        if (loginData && loginData.name && loginData.email) {
            modal.show();
        } else {
            var loginNaoEfetuado = new bootstrap.Modal(document.getElementById('loginNaoEfetuado'));
            loginNaoEfetuado.show();
        }
    });
});


document.getElementById('confirmSubmitButton').addEventListener('click', function () {
    
    const loginData = JSON.parse(localStorage.getItem("login"));

    if (loginData && loginData.name && loginData.email) {
        submitPedidoTrabalhoForm();
    } else {
        var loginNaoEfetuado = new bootstrap.Modal(document.getElementById('loginNaoEfetuado'));
        loginNaoEfetuado.show();
    }
});

function submitPedidoTrabalhoForm() {
    let nomePedidoTrabalho = document.getElementById("pedido-trabalho-name").value;
    let emailPedidoTrabalho = document.getElementById("pedido-trabalho-email").value;
    let subjectPedidoTrabalho = document.getElementById("pedido-trabalho-subject").value;
    let messagePedidoTrabalho = document.getElementById("pedido-trabalho-message").value;
    let filePedidoTrabalho = document.getElementById("formFile").files[0].name;
    let submissaoDataPedidoTrabalho = new Date().toLocaleString("pt-PT");
    let statusPedidoTrabalho = "<div class='badge bg-warning'>Pendente</div>";
    let numeroTelPedidoTrabalho = document.getElementById("pedido-trabalho-numero-tel").value;

    let pedidoTrabalho_records = JSON.parse(localStorage.getItem("pedidosTrabalho")) || [];

    // Determinar o próximo ID
    let idMaximo = 0;
    pedidoTrabalho_records.forEach(pedido => {
        if (pedido.id && pedido.id.startsWith("pedTrab")) {
            let idAtual = parseInt(pedido.id.substring(7)); // Remove "pedTrab" e converte para inteiro
            if (idAtual > idMaximo) {
                idMaximo = idAtual;
            }
        }
    });
    let proximoId = idMaximo + 1;
    let novoIdPedidoTrabalho = "pedTrab" + proximoId;

   

        // Adiciona os dados do novo pedido ao array
        pedidoTrabalho_records.push({
            "id": novoIdPedidoTrabalho,
            "nomePedidoTrabalho": nomePedidoTrabalho,
            "emailPedidoTrabalho": emailPedidoTrabalho,
            "assuntoPedidoTrabalho": subjectPedidoTrabalho,
            "mensagemPedidoTrabalho": messagePedidoTrabalho,
            "cVPedidoTrabalho": filePedidoTrabalho,
            "submissaoDataPedidoTrabalho": submissaoDataPedidoTrabalho,
            "estadoPedidoTrabalho": statusPedidoTrabalho,
            "numeroTelefonico": numeroTelPedidoTrabalho
        });

        localStorage.setItem("pedidosTrabalho", JSON.stringify(pedidoTrabalho_records));

        var confirmationModal = bootstrap.Modal.getInstance(document.getElementById('confirmationModal'));
        confirmationModal.hide();

        var pedidoRealizadoModal = new bootstrap.Modal(document.getElementById('pedidoTrabalhoRealizado'));
        pedidoRealizadoModal.show();
    };

document.addEventListener('DOMContentLoaded', function() {
    var inputTel = document.getElementById('pedido-trabalho-numero-tel');
    inputTel.addEventListener('input', function() {
        if (this.value.length > 9) {
            this.value = this.value.slice(0, 9);
        }
    });
});
