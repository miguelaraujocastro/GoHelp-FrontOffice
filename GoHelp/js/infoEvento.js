document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('eventoId'); // ID do evento da URL

    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const locais = JSON.parse(localStorage.getItem('locais')) || []; 
    const evento = eventos.find(e => e.id === eventoId); // Encontra o evento pelo ID

    if (evento) {
        // Atualiza os elementos HTML com as informações do evento
        document.getElementById('titulo-info-evento').textContent = evento.tituloEvento;
        document.getElementById('data-info-evento').textContent = formatarData(evento.dataEvento);
        document.getElementById('local-info-evento').textContent = evento.localEvento;

        // Encontra a morada do local no array de locais
        const local = locais.find(l => l.nome === evento.localEvento);
        let morada = 'Morada não disponível';
        if (local) {
            morada = local.morada;
        }

        document.getElementById('morada-local-info-evento').textContent = morada;
        document.getElementById('tipo-info-evento').textContent = evento.tipo;
        document.getElementById('duração-info-evento').textContent = evento.duracaoEvento + 'h';
        document.getElementById('participantes-info-evento').textContent = evento.inscricoes.length;
        document.getElementById('descricao-info-evento').textContent = evento.descricaoEvento;
        document.getElementById('n-profissionais-evento').textContent = evento.colaboradores.length;


        let estadoEvento = document.getElementById('status-info-evento');
        let textoStatus;

        switch (evento.status) {
            case "Concluido":
                textoStatus = "Concluído";
                break;
            case "por Realizar":
                textoStatus = "Por Realizar";
                break;
            case "a Realizar":
                textoStatus = "A Realizar";
                break;
            default:
                textoStatus = evento.status; // Caso não seja nenhum dos anteriores, mostra como está
        }

        estadoEvento.textContent = textoStatus;


        document.getElementById('imagem-evento').src = `images/${evento.imagemEvento}`;
        document.getElementById('valor-inscricao-info').textContent = evento.precoInscricaoEvento;
        
        let totalDoacoesLivros = evento.inscricoes.reduce((total, inscricao) => {
            // Usa um array vazio como padrão se doacoesLivros não existir
            return total + (inscricao.doacoesLivros || []).length;
        }, 0);
        document.getElementById('doacoes-livros-info-evento').textContent = totalDoacoesLivros;
        
        // Calcula o total de doações de materiais
        let totalDoacoesMateriais = evento.inscricoes.reduce((total, inscricao) => {
            // Usa um array vazio como padrão se doacoesMateriais não existir
            return total + (inscricao.doacoesMateriais || []).length;
        }, 0);
        document.getElementById('doacoes-materiais-info-evento').textContent = totalDoacoesMateriais;

        setupEventosInscricao(eventoId);
        mostrarBotaoInscrever(evento.status);
        
    } else {
        console.error('Evento não encontrado!');
    }
});

function mostrarBotaoInscrever(status){
    if(status == "Concluido" || status == "a Realizar"){
        document.getElementById("btn-info-inscrever").style.display = "none";
    }
}

function formatarData(data) {
    const dataObj = new Date(data);
    return dataObj.toLocaleDateString(undefined, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }) + ', ' + dataObj.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'

    });
  }

function setupEventosInscricao(eventoId) {
    const btnInscricao = document.getElementById("btn-info-inscrever");
    btnInscricao.addEventListener('click', function(event) {
        event.preventDefault();
        verificarLoginInfo(eventoId);
    });
}

function verificarLoginInfo(eventoId) {
    const loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData && loginData.name && loginData.email) {
        var continuarInscricao = new bootstrap.Modal(document.getElementById('modalInscricaoEventoInfo'));
        continuarInscricao.show();
        document.getElementById('continuarInscricaoEvento').onclick = function() {
            mostrarModalDoacaoInfo(eventoId); 
        };
    } else {
        var loginNaoEfetuado = new bootstrap.Modal(document.getElementById('loginNaoEfetuadoPedidoEventoInfo'));
        loginNaoEfetuado.show();
    }
}


function mostrarModalDoacaoInfo(eventoId) {
    var doacaoModal = new bootstrap.Modal(document.getElementById('modalDoarNoEventoInfo'));
    doacaoModal.show();

    document.getElementById('naoDoarEventoInfo').onclick = function() {
        adicionarInscricaoAoEventoInfo(eventoId); 
    };

    var doarButton = document.getElementById('btn-doar-No-Evento-info');
    doarButton.style.cursor = 'pointer';
    doarButton.onclick = function() {
        const loginData = JSON.parse(localStorage.getItem("login"));
        let eventos = JSON.parse(localStorage.getItem("eventos")) || [];
        let locais = JSON.parse(localStorage.getItem("locais")) || [];
        let evento = eventos.find(e => e.id === eventoId);

        if (evento) {
            // Verifica se o utilizador já está inscrito
            const inscricaoExistente = evento.inscricoes.find(inscricao => 
                inscricao.nome === loginData.name && inscricao.email === loginData.email
            );

            if (inscricaoExistente) {
                // Se já estiver inscrito, esconde o modal de doação e mostra o modal correspondente
                doacaoModal.hide();
                var jaInscritoEvento = new bootstrap.Modal(document.getElementById('inscricaoJaRealizadaInfo'));
                jaInscritoEvento.show();
                return;
            }

            // Encontra o local do evento
            let localDoEvento = locais.find(local => local.nome === evento.localEvento);

            // Verifica a capacidade do local
            if (evento.inscricoes.length >= localDoEvento.capacidade) {
                // Se a capacidade já estiver lotada, esconde o modal de doação e mostra o alerta
                doacaoModal.hide();
                var capacidadeLotadaModal = new bootstrap.Modal(document.getElementById('capacidadeLotadaInfo'));
                capacidadeLotadaModal.show();
                return;
            }

            // Se não estiver inscrito e houver capacidade, redireciona para a página de doação
            window.location.href = `doacaoEvento.html?eventoId=${eventoId}`;
        } else {
            console.error('Evento não encontrado.');
        }
    };
}


function adicionarInscricaoAoEventoInfo(eventoId) {
    const loginData = JSON.parse(localStorage.getItem("login"));
    let eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    let locais = JSON.parse(localStorage.getItem("locais")) || [];
    let evento = eventos.find(e => e.id === eventoId);

    if (evento) {
        // Verifica se o utilizador já está inscrito usando find
        const inscricaoExistente = evento.inscricoes.find(inscricao => 
            inscricao.nome === loginData.name && inscricao.email === loginData.email
        );

        if (inscricaoExistente) {
            // Se já estiver inscrito, loga uma mensagem no console e mostra o modal correspondente
            var jaInscritoEvento = new bootstrap.Modal(document.getElementById('inscricaoJaRealizadaInfo'));
            jaInscritoEvento.show();
            return;
        }

        // Encontra o local do evento
        let localDoEvento = locais.find(local => local.nome === evento.localEvento);

        // Verifica a capacidade do local
        if (evento.inscricoes.length >= localDoEvento.capacidade) {
            // Se a capacidade já estiver lotada, mostra o alerta
            var capacidadeLotadaModal = new bootstrap.Modal(document.getElementById('capacidadeLotadaInfo'));
            capacidadeLotadaModal.show();
            return;
        }

        let statusInscricao = "naoPresente";
        // Se não estiver inscrito e houver capacidade, adiciona a inscrição com a data de inscrição
        let submissaoDataInscricao = new Date().toLocaleString("pt-PT");
        evento.inscricoes.push({
            nome: loginData.name,
            email: loginData.email,
            dataInscricao: submissaoDataInscricao, // Adiciona a data de inscrição ao objeto da inscrição
            status: statusInscricao
        });
        localStorage.setItem("eventos", JSON.stringify(eventos));

        // Mostra o modal de inscrito
        var inscritoEventoModal = new bootstrap.Modal(document.getElementById('inscritoEventoInfo'));
        inscritoEventoModal.show();
    } else {
        console.error('Evento não encontrado.');
    }
}
