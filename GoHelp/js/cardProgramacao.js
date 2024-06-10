document.addEventListener('DOMContentLoaded', function () {
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const gridRow = document.querySelector('#section_Programacao_Eventos .container .row');
    const tipoEventoSelect = document.getElementById('filtrar-tipo-evento');
    const estadoEventoSelect = document.getElementById('filtrar-estado-evento');
    const searchInput = document.querySelector('.form-control[type="search"]');
    const tipoEventoMap = {
        "1": "Todos os Tipos",
        "2": "Feira do Livro",
        "3": "Concerto",
        "4": "Teatro"
    };
    let currentSearchTerm = '';
    let currentTipoEvento = '1';
    let currentEstadoEvento = '1';

    tipoEventoSelect.addEventListener('change', function() {
        currentTipoEvento = this.value;
        filterEvents();
    });

    estadoEventoSelect.addEventListener('change', function() {
        currentEstadoEvento = this.value;
        filterEvents();
    });

    searchInput.addEventListener('input', function() {
        currentSearchTerm = this.value.toLowerCase();
        filterEvents();
    });

    function filterEvents() {
        gridRow.innerHTML = ''; // Limpa a grid antes de adicionar cartões filtrados
        eventos.forEach(evento => {
            const matchesTipo = currentTipoEvento === "1" || evento.tipo === tipoEventoMap[currentTipoEvento];
            const matchesEstado = currentEstadoEvento === "1" || evento.status === (currentEstadoEvento === "2" ? "Concluido" : currentEstadoEvento === "3" ? "por Realizar" : "a Realizar");
            const eventText = (evento.tituloEvento + " " + evento.localEvento + " " + evento.duracaoEvento + " " + evento.dataEvento).toLowerCase();
            const matchesSearch = !currentSearchTerm || eventText.includes(currentSearchTerm);

            if (matchesTipo && matchesSearch && matchesEstado) {
                const newCard = createEventCard(evento);
                addCardToGrid(newCard, gridRow);
            }
        });
        updateCardGrid();
    }

    function createEventCard(evento) {
        const cardWrapper = document.createElement('div');
        cardWrapper.className = 'card';
    
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper';
        imageWrapper.style.height = "200px";
    
        const img = document.createElement('img');
        img.src = `images/${evento.imagemEvento}`;
        img.className = 'card-img-top';
        img.alt = evento.tituloEvento;
    
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';
    
        const cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = evento.tituloEvento;
    
        const cardTextLocal = document.createElement('p');
        cardTextLocal.className = 'card-text';
        cardTextLocal.textContent = evento.localEvento;
    
        const cardTextDuracao = document.createElement('p');
        cardTextDuracao.className = 'card-text';
        cardTextDuracao.textContent = evento.duracaoEvento + 'h';
    
        const cardTextData = document.createElement('p');
        cardTextData.className = 'card-text';
        cardTextData.textContent = formatarData(evento.dataEvento);
    
        const cardButtons = document.createElement('div');
        cardButtons.className = 'card-buttons';
        cardButtons.style.marginBottom = "10px";
    
        const infoButton = document.createElement('a');
        infoButton.href = `infoInscreverEventoGratis.html?eventoId=${evento.id}`;
        infoButton.className = "btn-programacao-info";
        infoButton.textContent = "+Info";
        infoButton.style.marginRight = "5px";
    
    
        imageWrapper.appendChild(img);
        cardButtons.appendChild(infoButton);
        if (evento.status != "Concluido" && evento.status != "a Realizar"){
            const inscreverButton = document.createElement('a');
            inscreverButton.href = "#";
            inscreverButton.id = "inscreverButton";
            inscreverButton.className = "btn-programacao-comprar";
            inscreverButton.setAttribute('id', 'btnInscreverEvento');
            inscreverButton.innerHTML = '<i class="bi bi-ticket-perforated rotate-icon"></i>&nbspInscrever';
            inscreverButton.addEventListener('click', function(event) {
                event.preventDefault();
                verificarLoginEExibirModal(evento.id);
            });
            cardButtons.appendChild(inscreverButton);
        }
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardTextLocal);
        cardBody.appendChild(cardTextDuracao);
        cardBody.appendChild(cardTextData);
        cardBody.appendChild(cardButtons);
    
        cardWrapper.appendChild(imageWrapper);
        cardWrapper.appendChild(cardBody);
    
        return cardWrapper;
      }

      function addCardToGrid(cardElement, gridRow) {
        const colDiv = document.createElement('div');
        colDiv.className = 'col-md-3 col-sm-5 mb-5';  // Adapta as colunas conforme o tamanho da tela
        colDiv.appendChild(cardElement);
        gridRow.appendChild(colDiv);
    }

    function updateCardGrid() {
        const allCards = document.querySelectorAll('#section_Programacao_Eventos .container .row > div');
        allCards.forEach(card => {
            if (window.innerWidth < 992) {
                card.className = 'col-sm-6 mb-5'; // 2 cartões por linha em telas < 990px
            } else if (window.innerWidth < 1200) {
                card.className = 'col-md-4 col-sm-6 mb-5'; // 3 cartões por linha em telas < 1200px
            } else {
                card.className = 'col-lg-3 col-md-4 col-sm-6 mb-5'; // 4 cartões por linha em telas >= 1200px
            }
        });
    }

    window.addEventListener('resize', updateCardGrid);

    // Chama inicialmente para carregar todos os eventos
    filterEvents();
});

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


function verificarLoginEExibirModal(eventoId) {
    
    const loginData = JSON.parse(localStorage.getItem("login"));
    if (loginData && loginData.name && loginData.email) {
        var continuarInscricao = new bootstrap.Modal(document.getElementById('confirmationModalInscricaoEvento_ProgramacaoCompleta'));
        continuarInscricao.show();
        document.getElementById('continuarInscricaoEvento_ProgramacaoCompleta').onclick = function() {
            mostrarModalDoacao(eventoId);
        };
    } else {
        var loginNaoEfetuado = new bootstrap.Modal(document.getElementById('loginNaoEfetuadoPedidoEvento_ProgramacaoCompleta'));
        loginNaoEfetuado.show();
    }
}


function mostrarModalDoacao(eventoId) {
    var doacaoModal = new bootstrap.Modal(document.getElementById('confirmationModalDoarNoEvento_ProgramacaoCompleta'));
    doacaoModal.show();

    document.getElementById('naoDoarEvento_ProgramacaoCompleta').onclick = function() {
        adicionarInscricaoAoEvento(eventoId); 
    };

    var doarButton = document.getElementById('btn-doar-No-Evento_ProgramacaoCompleta');
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
                var jaInscritoEvento = new bootstrap.Modal(document.getElementById('inscricaoJaRealizada_ProgramacaoCompleta'));
                jaInscritoEvento.show();
                return;
            }

            // Encontra o local do evento
            let localDoEvento = locais.find(local => local.nome === evento.localEvento);

            // Verifica a capacidade do local
            if (evento.inscricoes.length >= localDoEvento.capacidade) {
                // Se a capacidade já estiver lotada, esconde o modal de doação e mostra o alerta
                doacaoModal.hide();
                var capacidadeLotadaModal = new bootstrap.Modal(document.getElementById('capacidadeLotada_ProgramacaoCompleta'));
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


function adicionarInscricaoAoEvento(eventoId) {
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
            // Se já estiver inscrito, mostra o modal correspondente
            var jaInscritoEvento = new bootstrap.Modal(document.getElementById('inscricaoJaRealizada_ProgramacaoCompleta'));
            jaInscritoEvento.show();
            return;
        }

        // Encontra o local do evento
        let localDoEvento = locais.find(local => local.nome === evento.localEvento);

        // Verifica a capacidade do local
        if (evento.inscricoes.length >= localDoEvento.capacidade) {
            // Se a capacidade já estiver lotada, mostra o alerta
            var capacidadeLotadaModal = new bootstrap.Modal(document.getElementById('capacidadeLotada_ProgramacaoCompleta'));
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
        var inscritoEventoModal = new bootstrap.Modal(document.getElementById('InscritoEvento_ProgramacaoCompleta'));
        inscritoEventoModal.show();
    } else {
        console.error('Evento não encontrado.');
    }
}
