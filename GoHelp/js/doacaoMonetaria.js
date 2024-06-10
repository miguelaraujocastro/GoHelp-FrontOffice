const login = JSON.parse(localStorage.getItem("login"));
if(!login || !login.email || !login.name){

    var inputNome = document.getElementById("donation-nome");
    inputNome.value = "Nome";
        
    var inputEmail = document.getElementById("donation-email");
    inputEmail.value = "Email";

}
else{
    var inputNome = document.getElementById("donation-nome");
    inputNome.value = login.name;
        
    var inputEmail = document.getElementById("donation-email");
    inputEmail.value = login.email;
}

document.addEventListener('DOMContentLoaded', function () {
    const doacaoMonetariaForm = document.getElementById("doacaoMonetariaForm");
    const modalConfirmacao = new bootstrap.Modal(document.getElementById('confirmationModalDoacaoMonetaria'));

    doacaoMonetariaForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const login = JSON.parse(localStorage.getItem("login"));

        if (login && login.name && login.email) {
            modalConfirmacao.show();
        } else {
            var loginNaoEfetuado = new bootstrap.Modal(document.getElementById('loginNaoEfetuadoDoacaoMonetaria'));
            loginNaoEfetuado.show();
        }
    });
});

document.getElementById('confirmSubmitButtonDoacaoMonetaria').addEventListener('click', function () {
    
    const loginData = JSON.parse(localStorage.getItem("login"));
    
    if (loginData && loginData.name && loginData.email) {
        submitDoacaoMonetariaForm();
    } else {
        var loginNaoEfetuado = new bootstrap.Modal(document.getElementById('loginNaoEfetuadoDoacaoMonetaria'));
        loginNaoEfetuado.show();
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var customAmountInput = document.getElementById('customAmount');
    var radioCustom = document.getElementById('flexRadioCustom');
    var radios = document.querySelectorAll('input[type="radio"][name="flexRadioDefault"]');

    // Evento para marcar o rádio oculto quando o campo de montante personalizado é selecionado ou alterado
    customAmountInput.addEventListener('focus', function() {
        radioCustom.checked = true;
    });

    customAmountInput.addEventListener('input', function() {
        radioCustom.checked = true;
    });

    // Adiciona eventos para desmarcar o rádio personalizado se outros rádios forem selecionados
    radios.forEach(function(radio) {
        radio.addEventListener('change', function() {
            if (radio.id !== 'flexRadioCustom') {
                customAmountInput.value = ''; // Limpa o campo de texto se outro rádio é selecionado
            }
        });
    });
});

function submitDoacaoMonetariaForm() {
    const login = JSON.parse(localStorage.getItem("login"));
    const nomeDoacao = login.name;
    const emailDoacao = login.email;
    const radioSelecionado = document.querySelector('input[type="radio"][name="flexRadioDefault"]:checked');
    const montantePersonalizadoInput = document.getElementById("customAmount");
    const montantePersonalizado = montantePersonalizadoInput.value.trim();

    let montanteDoacao;
    if (radioSelecionado && radioSelecionado.id !== 'flexRadioCustom') {
        montanteDoacao = radioSelecionado.nextElementSibling.textContent.trim();
    } else {
        montanteDoacao = montantePersonalizado + "€";
    }

    let doacoesMonetarias_records = JSON.parse(localStorage.getItem("doacoesMonetarias")) || [];

    // Determinar o próximo ID
    let idMaximo = 0;
    doacoesMonetarias_records.forEach(doacao => {
        if (doacao.id && doacao.id.startsWith("doacaoMon")) {
            let idAtual = parseInt(doacao.id.substring(9)); // Remove "doacaoMon" e converte para inteiro
            if (!isNaN(idAtual) && idAtual > idMaximo) {
                idMaximo = idAtual;
            }
        }
    });

    let proximoId = idMaximo + 1;
    let novoIdDoacaoMonetaria = "doacaoMon" + proximoId;
    let submissaoDoacao = new Date().toLocaleString("pt-PT");

    // Adicionar os dados da nova doação ao array
    doacoesMonetarias_records.push({
        "id": novoIdDoacaoMonetaria,
        "nomeDoacao": nomeDoacao,
        "emailDoacao": emailDoacao,
        "montanteDoacao": montanteDoacao,
        "submissaoDataDoacao": submissaoDoacao
    });

    // Salvar o array atualizado no localStorage
    localStorage.setItem("doacoesMonetarias", JSON.stringify(doacoesMonetarias_records));

    // Fechar o modal de confirmação
    var confirmationModalDoacao = bootstrap.Modal.getInstance(document.getElementById('confirmationModalDoacaoMonetaria'));
    confirmationModalDoacao.hide();

    // Exibir o modal de doação realizada
    var doacaoRealizadaModal = new bootstrap.Modal(document.getElementById('doacaoMonetariaRealizada'));
    doacaoRealizadaModal.show();
}