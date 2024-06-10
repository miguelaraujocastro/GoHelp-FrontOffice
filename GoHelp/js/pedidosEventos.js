// SUBMETER PEDIDOS EVENTO----------------------------------------------------

//Nome e Email dos Formularios Predefinidos segundo o login------------

const loginData = JSON.parse(localStorage.getItem("login"));
if(!loginData || !loginData.email || !loginData.name){

    var inputNome = document.getElementById("pedido-evento-name");
    inputNome.value = "Nome";
        
    var inputEmail = document.getElementById("pedido-evento-email");
    inputEmail.value = "Email";

}
else{
    var inputNome = document.getElementById("pedido-evento-name");
    inputNome.value = loginData.name;
        
    var inputEmail = document.getElementById("pedido-evento-email");
    inputEmail.value = loginData.email;
}


//impedir o utilizador de colocar uma data pretendida anterior à atual
var dataEventoInput = document.getElementById('data-pedido-evento');
var today = new Date().toISOString().substring(0, 16);
dataEventoInput.min = today;



document.addEventListener('DOMContentLoaded', function () {
    const pedidoEventoForm = document.getElementById("pedidoEventoForm");
    const modal = new bootstrap.Modal(document.getElementById('confirmationModalPedidosEvento'));

    pedidoEventoForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const loginData = JSON.parse(localStorage.getItem("login"));

        if (loginData && loginData.name && loginData.email) {
            modal.show();
        } else {
            var loginNaoEfetuado = new bootstrap.Modal(document.getElementById('loginNaoEfetuadoPedidoEvento'));
            loginNaoEfetuado.show();
        }
    });
});


document.getElementById('confirmSubmitButtonPedidoEvento').addEventListener('click', function () {
    
    const loginData = JSON.parse(localStorage.getItem("login"));
    
    if (loginData && loginData.name && loginData.email) {
        submitPedidoEventoForm();
    } else {
        var loginNaoEfetuado = new bootstrap.Modal(document.getElementById('loginNaoEfetuadoPedidoEvento'));
        loginNaoEfetuado.show();
    }
});

function submitPedidoEventoForm() {
    let nomePedidoEvento = document.getElementById("pedido-evento-name").value;
    let emailPedidoEvento = document.getElementById("pedido-evento-email").value;
    let tituloPedidoEvento = document.getElementById("titulo-pedido-evento").value;
    let descricaoPedidoEvento = document.getElementById("descricao-pedido-evento").value;
    let dataPretendidaPedidoEvento = document.getElementById("data-pedido-evento").value;
    let duracaoPedidoEvento = document.getElementById("duracao-pedido-evento").value;
    let tipoPedidoEvento = document.getElementById("tipo-pedido-evento").options[document.getElementById("tipo-pedido-evento").selectedIndex].text;
    let localPedidoEvento = document.getElementById("local-pedido-evento").options[document.getElementById("local-pedido-evento").selectedIndex].text;
    let participantesPedidoEvento = document.getElementById("participantes-pedido-evento").value;
    let submissaoDataPedidoEvento = new Date().toLocaleString("pt-PT");
    let statusPedidoEvento = "<div class='badge bg-warning'>Pendente</div>";
    let colaboradorDoEvento = document.querySelector('input[name="flexRadioDefault"]:checked').nextElementSibling.textContent.trim();
    let imagemOrganizarEvento = document.getElementById("imagemOrganizarEvento").files[0].name;
    


            let pedidoEvento_records = JSON.parse(localStorage.getItem("pedidosEventos")) || [];

            // Determinar o próximo ID
            let idMaximo = 0;
            pedidoEvento_records.forEach(pedido => {
                if (pedido.id && pedido.id.startsWith("pedEv")) {
                    let idAtual = parseInt(pedido.id.substring(5)); // Remove "pedEv" e converte para inteiro
                    if (idAtual > idMaximo) {
                        idMaximo = idAtual;
                    }
                }
            });
            let proximoId = idMaximo + 1;
            let novoIdPedidoEvento = "pedEv" + proximoId;

            // Adiciona os dados do novo pedido ao array
            pedidoEvento_records.push({
                "id": novoIdPedidoEvento,
                "nomePedidoEvento": nomePedidoEvento,
                "emailPedidoEvento": emailPedidoEvento,
                "tituloPedidoEvento": tituloPedidoEvento,
                "descricaoPedidoEvento": descricaoPedidoEvento,
                "dataPretendidaPedidoEvento": dataPretendidaPedidoEvento,
                "duracaoPedidoEvento": duracaoPedidoEvento,
                "tipoPedidoEvento": tipoPedidoEvento,
                "localPedidoEvento": localPedidoEvento,
                "participantesPedidoEvento": participantesPedidoEvento,
                "submissaoDataPedidoEvento": submissaoDataPedidoEvento,
                "estadoPedidoEvento": statusPedidoEvento,
                "colaboradorDoEvento": colaboradorDoEvento,
                "imagemOrganizarEvento": imagemOrganizarEvento
            });

            localStorage.setItem("pedidosEventos", JSON.stringify(pedidoEvento_records));

            var confirmationModal = bootstrap.Modal.getInstance(document.getElementById('confirmationModalPedidosEvento'));
            confirmationModal.hide();

            var pedidoRealizadoModal = new bootstrap.Modal(document.getElementById('pedidoEventoRealizado'));
            pedidoRealizadoModal.show();

            window.location.href = "portfolio.html#section_Organizar";

}


function carregarLocais() {
    const locais = JSON.parse(localStorage.getItem("locais"));
    const selectLocal = document.getElementById("local-pedido-evento");

    if (locais && Array.isArray(locais)) {
        locais.forEach(local => {
            const option = document.createElement("option");
            option.value = local.nome;
            option.textContent = local.nome;
            selectLocal.appendChild(option);
        });
    }
}

document.addEventListener("DOMContentLoaded", carregarLocais);