function preencherTabelaPedidosEventos() {
    const pedidos = JSON.parse(localStorage.getItem("pedidosEventos"));
    const loginData = JSON.parse(localStorage.getItem("login"));

    if (!pedidos) {
        console.log("Nenhum pedido de evento encontrado no localStorage.");
        document.getElementById("crudTable").style.display = 'none';
        document.getElementById("mensagemSemPedidos").style.display = 'block';
        return;
    }

    const pedidosEventoUtilizador = pedidos.filter(pedido => pedido.emailPedidoEvento === loginData.email);
    pedidosEventoUtilizador.sort((a, b) => {
        const dataA = Date.parse(a.submissaoDataPedidoEvento.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, '$3-$2-$1T$4'));
        const dataB = Date.parse(b.submissaoDataPedidoEvento.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, '$3-$2-$1T$4'));
        return dataB - dataA;
    });

    const tabela = document.getElementById("crudTable");
    const mensagemSemPedidos = document.getElementById("mensagemSemPedidos");

    if (pedidosEventoUtilizador.length === 0) {
        tabela.style.display = 'none';
        mensagemSemPedidos.style.display = 'block';
    } else {
        tabela.style.display = 'table';
        mensagemSemPedidos.style.display = 'none';

        const tabelaBody = document.getElementById("conteudo-tabela-pedidos-eventos");
        tabelaBody.innerHTML = ""; // Limpa o conteúdo existente

    pedidosEventoUtilizador.forEach((pedido, index) => {
        const aindaNaoLidas = verificarNotificacoesPedidoNaoLidas(pedido.id);
        const badgeDisplay = aindaNaoLidas ? 'inline-block' : 'none';

        const linha = `<tr>
            <td>${pedido.submissaoDataPedidoEvento}</td>
            <td>${pedido.tituloPedidoEvento}</td>
            <td>${pedido.tipoPedidoEvento}</td>
            <td>${formatarData(pedido.dataPretendidaPedidoEvento)}</td>
            <td>${pedido.estadoPedidoEvento}</td>
            <td>
                <div>
                    <a href="#" data-toggle="modal" data-target="#detalhesPedidosEventos" data-id="${pedido.id}" class="link-ver-detalhes">
                        Ver Detalhes
                    </a>
                </div>
                <div class="mt-5"> <!-- Ajuste do mt-5 para mt-3 para um espaçamento mais moderado, ajuste conforme necessário -->
                    <a class="bi-bell link-ver-notificacoes" data-id="${pedido.id}" style="display: inline-flex; cursor:pointer;">
                        <span class="badge-notification-pedidos bg-danger" style="display:${badgeDisplay};"></span>
                    </a>
                </div>
            </td>
        </tr>`;
        tabelaBody.innerHTML += linha;
    });
    

    tabelaBody.addEventListener('click', function(event) {
        let target = event.target;
        while (target != tabelaBody && !target.classList.contains('link-ver-detalhes') && !target.classList.contains('link-ver-notificacoes')) {
            target = target.parentNode;
        }

        if (target.classList.contains('link-ver-detalhes')) {
            const pedidoId = target.getAttribute('data-id');
            preencherDetalhesModal(pedidoId);
            var detalhesModal = new bootstrap.Modal(document.getElementById('detalhesPedidosEventos'));
            detalhesModal.show();
        } else if (target.classList.contains('link-ver-notificacoes')) {
            const pedidoId = target.getAttribute('data-id');
            carregarNotificacoesEvento(pedidoId);
        }
    });
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

function verificarNotificacoesPedidoNaoLidas(pedidoId) {
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes'));
    if (!notificacoes || !notificacoes.notificacoesPedidosEventos) return false; // Verifica se as notificações existem

    return notificacoes.notificacoesPedidosEventos.some(not => 
        not.idPedidoPedEvento === pedidoId && not.estadoMensagemPedEvento === 'NaoLida'
    );
}

function carregarNotificacoesEvento(pedidoId) {
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes'));

    if (!notificacoes || !notificacoes.notificacoesPedidosEventos) {
        const modalBody = document.querySelector('#notificacoesPedidoEvento .modal-body .col-md-12');
        modalBody.innerHTML = "<p>Não há notificações para este pedido.</p>";
        var notificacoesModal = new bootstrap.Modal(document.getElementById('notificacoesPedidoEvento'));
        notificacoesModal.show();
        return; // Sair da função se não existem notificações
    }


    // Filtrar apenas as notificações relativas ao pedido específico
    const notificacoesEvento = notificacoes.notificacoesPedidosEventos.filter(not => not.idPedidoPedEvento === pedidoId);

    // Marcar o estado da mensagem de cada notificação desse pedido como 'Lida'
    notificacoesEvento.forEach(notificacao => {
        notificacao.estadoMensagemPedEvento = 'Lida';
    });

    // Atualizar o localStorage com as notificações atualizadas
    localStorage.setItem('notificacoes', JSON.stringify(notificacoes));

    // Ordenar as notificações pela data, da mais recente para a mais antiga
    notificacoesEvento.sort((a, b) => {
        const dataA = Date.parse(a.dataNotificacaoPedEvento);
        const dataB = Date.parse(b.dataNotificacaoPedEvento);
        return dataB - dataA; // Compara as datas convertidas para timestamp
    });

    const modalBody = document.querySelector('#notificacoesPedidoEvento .modal-body .col-md-12');
    modalBody.innerHTML = ""; // Limpa o conteúdo existente no modal

    if (notificacoesEvento.length > 0) {
        notificacoesEvento.forEach(notificacao => {
            const item = document.createElement('div');
            item.className = 'notificacao-item';
            item.style.marginBottom = "20px";
            item.innerHTML = `
                <strong>${notificacao.tituloPedidoPedEvento}</strong> <br>
                <strong>Mensagem:</strong>  ${notificacao.mensagemPedEvento} <br>
                Notificação enviada em: ${notificacao.dataNotificacaoPedEvento}
            `;
            modalBody.appendChild(item);
        });
    } else {
        modalBody.innerHTML = "<p>Não há notificações para este pedido.</p>";
    }

    // Exibir o modal de notificações
    var notificacoesModal = new bootstrap.Modal(document.getElementById('notificacoesPedidoEvento'));
    notificacoesModal.show();

    // Atualizar visualização do badge associado
    atualizarBadgeNotificacoes(pedidoId);
}

function atualizarBadgeNotificacoes(pedidoId) {
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes'));
    const aindaNaoLidas = notificacoes.notificacoesPedidosEventos.some(not => 
        not.idPedidoPedEvento === pedidoId && not.estadoMensagemPedEvento === 'NaoLida'
    );

    // Encontrar o badge específico para o pedido
    const badge = document.querySelector(`.link-ver-notificacoes[data-id="${pedidoId}"] .badge-notification-pedidos`);
    if (!aindaNaoLidas && badge) {
        badge.style.display = 'none'; // Esconde o badge se não houver mais notificações não lidas
    }
}


function preencherDetalhesModal(id) {
    const pedidos = JSON.parse(localStorage.getItem("pedidosEventos"));
    const pedido = pedidos.find(pedido => pedido.id === id);

    if (!pedido) {
        console.log("Pedido não encontrado.");
        return;
    }
    document.getElementById("data-envio-evento-info").textContent = pedido.submissaoDataPedidoEvento;
    document.getElementById("titulo-pedido-evento-info").textContent = pedido.tituloPedidoEvento;
    document.getElementById("data-pedido-evento-info").textContent = formatarData(pedido.dataPretendidaPedidoEvento);
    document.getElementById("duracao-pedido-evento-info").textContent = pedido.duracaoPedidoEvento;
    document.getElementById("tipo-pedido-evento-info").textContent = pedido.tipoPedidoEvento;
    document.getElementById("local-pedido-evento-info").textContent = pedido.localPedidoEvento;
    document.getElementById("participantes-pedido-evento-info").textContent = pedido.participantesPedidoEvento;
    document.getElementById("descricao-pedido-evento-info").textContent = pedido.descricaoPedidoEvento;
    document.getElementById("estado-pedido-evento-info").innerHTML = pedido.estadoPedidoEvento;
    document.getElementById("colaborador-pedido-evento-info").textContent = pedido.colaboradorDoEvento;
    document.getElementById('imagem-organizar-evento').src = `images/${pedido.imagemOrganizarEvento}`;
}

document.addEventListener("DOMContentLoaded", function() {
    preencherTabelaPedidosEventos();
});







//PREENCHER E VER MODAL DE PEDIDOS DE TRABALHO

function preencherTabelaPedidosTrabalho() {
    const pedidos = JSON.parse(localStorage.getItem("pedidosTrabalho"));
    const loginData = JSON.parse(localStorage.getItem("login"));

    if (!pedidos) {
        console.log("Nenhum pedido de trabalho encontrado no localStorage.");
        document.getElementById("crudTableTrabalho").style.display = 'none';
        document.getElementById("mensagemSemPedidosTrabalho").style.display = 'block';
        return;
    }

    const pedidosTrabalhoUtilizador = pedidos.filter(pedido => pedido.emailPedidoTrabalho === loginData.email);

    pedidosTrabalhoUtilizador.sort((a, b) => {
        const dataA = Date.parse(a.submissaoDataPedidoTrabalho.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, '$3-$2-$1T$4'));
        const dataB = Date.parse(b.submissaoDataPedidoTrabalho.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, '$3-$2-$1T$4'));
        return dataB - dataA;
    });

    const tabela = document.getElementById("crudTableTrabalho");
    const mensagemSemPedidosTrabalho = document.getElementById("mensagemSemPedidosTrabalho");

    if (pedidosTrabalhoUtilizador.length === 0) {
        tabela.style.display = 'none';
        mensagemSemPedidosTrabalho.style.display = 'block';
    } else {
        tabela.style.display = 'table'; // Ajusta para que a tabela seja visível
        mensagemSemPedidosTrabalho.style.display = 'none';

        
    const tabelaBody = document.getElementById("conteudo-tabela-pedidos-trabalho");
    tabelaBody.innerHTML = ""; // Limpa o conteúdo existente


    //linhas para cada pedido
    pedidosTrabalhoUtilizador.forEach((pedido, index) => {

        const aindaNaoLidas = verificarNotificacoesPedidoTrabalhoNaoLidas(pedido.id);
        const badgeDisplay = aindaNaoLidas ? 'inline-block' : 'none';
        const linha = `<tr>
            <td>${pedido.submissaoDataPedidoTrabalho}</td>
            <td>${pedido.assuntoPedidoTrabalho}</td>
            <td><a href="#" onclick="abrirCV('images/${pedido.cVPedidoTrabalho}', 'images/CV_${pedido.nomePedidoTrabalho}.pdf'); return false;">Ver CV</a></td>
            <td>${pedido.mensagemPedidoTrabalho}</td>
            <td>${pedido.estadoPedidoTrabalho}</td>
            <td>
                <a class="bi-bell link-ver-notificacoes-trabalho" data-id="${pedido.id}" style="display: inline-flex; margin-top:30px; cursor:pointer;">
                    <span class="badge-notification-pedidos bg-danger" style="display:${badgeDisplay};"></span>
                </a>
            </td>
        </tr>`;
        tabelaBody.innerHTML += linha; // Adiciona a linha ao corpo da tabela
    });
    

    tabelaBody.addEventListener('click', function(event) {
        let target = event.target;
        while (target !== tabelaBody && !target.classList.contains('link-ver-notificacoes-trabalho')) {
            target = target.parentNode;
        }

        if (target.classList.contains('link-ver-notificacoes-trabalho')) {
            const pedidoId = target.getAttribute('data-id');
            carregarNotificacoesTrabalho(pedidoId);
        }
    });
    }
}

//Abrir PDF no blob
function abrirCV(url) {
    // Abre a URL do PDF em uma nova aba
    window.open(url, '_blank');
}


function verificarNotificacoesPedidoTrabalhoNaoLidas(pedidoId) {
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes'));
    if (!notificacoes || !notificacoes.notificacoesPedidosTrabalho) return false;

    return notificacoes.notificacoesPedidosTrabalho.some(not => 
        not.idPedidoTrabalho === pedidoId && not.estadoMensagemPedTrabalho === 'NaoLida'
    );
}




function carregarNotificacoesTrabalho(pedidoId) {
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes'));

    if (!notificacoes || !notificacoes.notificacoesPedidosTrabalho) {
        const modalBody = document.querySelector('#notificacoesPedidoTrabalho .modal-body .col-md-12');
        modalBody.innerHTML = "<p>Não há notificações para este pedido.</p>";
        var notificacoesModal = new bootstrap.Modal(document.getElementById('notificacoesPedidoTrabalho'));
        notificacoesModal.show();
        return; // Sair da função se não existem notificações
    }

    const notificacoesTrabalho = notificacoes.notificacoesPedidosTrabalho.filter(not => not.idPedidoTrabalho === pedidoId);

    notificacoesTrabalho.forEach(notificacao => {
        notificacao.estadoMensagemPedTrabalho = 'Lida';
    });

    localStorage.setItem('notificacoes', JSON.stringify(notificacoes));

    notificacoesTrabalho.sort((a, b) => {
        const dataA = Date.parse(a.dataNotificacaoTrabalho);
        const dataB = Date.parse(b.dataNotificacaoTrabalho);
        return dataB - dataA;
    });

    const modalBody = document.querySelector('#notificacoesPedidoTrabalho .modal-body .col-md-12');
    modalBody.innerHTML = "";

    if (notificacoesTrabalho.length > 0) {
        notificacoesTrabalho.forEach(notificacao => {
            const item = document.createElement('div');
            item.className = 'notificacao-item';
            item.style.marginBottom = "20px";
            item.innerHTML = `
                <strong>Mensagem:</strong> ${notificacao.mensagemTrabalho} <br>
                Notificação enviada em: ${notificacao.dataNotificacaoTrabalho}
            `;
            modalBody.appendChild(item);
        });
    } else {
        modalBody.innerHTML = "<p>Não há notificações para este pedido.</p>";
    }

    var notificacoesModal = new bootstrap.Modal(document.getElementById('notificacoesPedidoTrabalho'));
    notificacoesModal.show();

    atualizarBadgeNotificacoesTrabalho(pedidoId);
}


function atualizarBadgeNotificacoesTrabalho(pedidoId) {
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes'));
    const aindaNaoLidas = notificacoes.notificacoesPedidosTrabalho.some(not => 
        not.idPedidoTrabalho === pedidoId && not.estadoMensagemPedTrabalho === 'NaoLida'
    );

    const badge = document.querySelector(`.link-ver-notificacoes-trabalho[data-id="${pedidoId}"] .badge-notification-pedidos`);
    if (!aindaNaoLidas && badge) {
        badge.style.display = 'none';
    } else if (badge) {
        badge.style.display = 'inline-block'; // certificar que o badge volte a aparecer se houver notificações não lidas
    }
}

document.addEventListener("DOMContentLoaded", function() {
    preencherTabelaPedidosTrabalho();
});




//PREENCHER E VER MODAL DE INSCRICOES

function preencherTabelaInscricoesEventos() {
    const loginData = JSON.parse(localStorage.getItem("login"));
    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];

    if (!eventos) {
        console.log("Nenhum evento encontrado no localStorage.");
        document.getElementById("crudTableInscricoes").style.display = 'none';
        document.getElementById("mensagemSemInscricoes").style.display = 'block';
        return;
    }

    let inscricoesUtilizador = [];
    eventos.forEach(evento => {
        evento.inscricoes.forEach(inscricao => {
            if (inscricao.email === loginData.email) {
                inscricoesUtilizador.push({
                    eventoId: evento.id,
                    dataInscricao: inscricao.dataInscricao,
                    tituloEvento: evento.tituloEvento,
                    tipoEvento: evento.tipo,
                    localEvento: evento.localEvento
                });
            }
        });
    });

    inscricoesUtilizador.sort((a, b) => {
        const dataA = Date.parse(a.dataInscricao.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, '$3-$2-$1T$4'));
        const dataB = Date.parse(b.dataInscricao.replace(/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}:\d{2}:\d{2})/, '$3-$2-$1T$4'));
        return dataB - dataA;
    });

    const tabela = document.getElementById("crudTableInscricoes");
    const mensagemSemInscricoes = document.getElementById("mensagemSemInscricoes");

    if (inscricoesUtilizador.length === 0) {
        tabela.style.display = 'none';
        mensagemSemInscricoes.style.display = 'block';
    } else {
        tabela.style.display = 'table';
        mensagemSemInscricoes.style.display = 'none';

        
    const tabelaBody = document.getElementById("conteudo-tabela-inscricoes-eventos");
    tabelaBody.innerHTML = "";

    inscricoesUtilizador.forEach(inscricao => {
        const linha = `<tr>
            <td>${inscricao.dataInscricao}</td>
            <td>${inscricao.tituloEvento}</td>
            <td>${inscricao.tipoEvento}</td>
            <td>${inscricao.localEvento}</td>
            <td><a href="#" data-toggle="modal" data-target="#detalhesInscricoesEventos" data-id="${inscricao.eventoId}" class="link-ver-detalhes">Ver Detalhes</a></td>
        </tr>`;
        tabelaBody.innerHTML += linha;
    });
}
}

document.addEventListener("DOMContentLoaded", function() {
    preencherTabelaInscricoesEventos();
    document.getElementById("conteudo-tabela-inscricoes-eventos").addEventListener('click', function(event) {
        let target = event.target;
        while (target != this && !target.classList.contains('link-ver-detalhes')) {
            target = target.parentNode;
        }
        
        if (target.classList.contains('link-ver-detalhes')) {
            const eventoId = target.getAttribute('data-id');
            preencherDadosInscricaoModal(eventoId);
        }
    });
});



function preencherDadosInscricaoModal(eventoId) {
    const eventos = JSON.parse(localStorage.getItem("eventos"));
    const loginData = JSON.parse(localStorage.getItem("login"));
    const evento = eventos.find(e => e.id === eventoId);
    const inscricao = evento.inscricoes.find(i => i.email === loginData.email);

    if (!evento || !inscricao) {
        console.log("Evento ou Inscrição não encontrados.");
        return;
    }

    document.getElementById("imagem-inscricao-modal-evento").src = `images/${evento.imagemEvento}`;
    document.getElementById("titulo-evento-info-modal").textContent = evento.tituloEvento;
    document.getElementById("descricao-evento-info-modal").textContent = evento.descricaoEvento;
    document.getElementById("data-evento-info-modal").textContent = formatarData(evento.dataEvento);
    document.getElementById("local-evento-info-modal").textContent = evento.localEvento;
    document.getElementById("preco-inscricao-info-modal").textContent = evento.precoInscricaoEvento;

    const doacoesLivrosListaModal = document.getElementById("doacoes-livros-lista-modal");
    doacoesLivrosListaModal.innerHTML = "";
    if (inscricao.doacoesLivros && inscricao.doacoesLivros.length > 0) {
        inscricao.doacoesLivros.forEach(livro => {
            const item = `
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>Título do Livro:</strong> <div class="info-direita-detalhes">${livro.tituloLivro}</div></li>
                <li class="list-group-item"><strong>Autor:</strong> <div class="info-direita-detalhes">${livro.autorLivro}</div></li>
                <li class="list-group-item"><strong>Ano:</strong> <div class="info-direita-detalhes">${livro.anoLivro}</div></li>
                <li class="list-group-item"><strong>Estado:</strong> <div class="info-direita-detalhes">${livro.condicaoLivro}</div></li>
            </ul>`;

            doacoesLivrosListaModal.innerHTML += item;
        });
    } else {
        doacoesLivrosListaModal.innerHTML = '<li class="list-group-item">Nenhuma doação de livros registada.</li>';
    }

    const doacoesMateriaisListaModal = document.getElementById("doacoes-materiais-lista-modal");
    doacoesMateriaisListaModal.innerHTML = "";
    if (inscricao.doacoesMateriais && inscricao.doacoesMateriais.length > 0) {
        inscricao.doacoesMateriais.forEach(material => {
            const item = `
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><strong>Descrição do Material:</strong> <div class="info-direita-detalhes">${material.descricaoMaterial}</div></li>
                <li class="list-group-item"><strong>Tipo:</strong> <div class="info-direita-detalhes">${material.tipoMaterial}</div></li>
                <li class="list-group-item"><strong>Quantidade:</strong> <div class="info-direita-detalhes">${material.quantidadeMaterial}</div></li>
                <li class="list-group-item"><strong>Estado:</strong> <div class="info-direita-detalhes">${material.condicaoMaterial}</div></li>
            </ul>`;
            doacoesMateriaisListaModal.innerHTML += item;
        });
    } else {
        doacoesMateriaisListaModal.innerHTML = '<li class="list-group-item">Nenhuma doação de materiais registada.</li>';
    }

    var detalhesModal = new bootstrap.Modal(document.getElementById('detalhesInscricoesEventos'));
    detalhesModal.show();
}