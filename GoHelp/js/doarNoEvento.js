
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventoId = urlParams.get('eventoId');
    const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
    const evento = eventos.find(e => e.id === eventoId);
  
    if (evento) {
      document.getElementById('imagem-evento-doar').src = `images/${evento.imagemEvento}`;
      document.getElementById('titulo-evento-doar').textContent = evento.tituloEvento;
      document.getElementById('local-evento-doar').textContent = evento.localEvento;
      document.getElementById('data-evento-doar').textContent = formatarData(evento.dataEvento);
      document.getElementById('tipo-evento-doar').textContent = evento.tipo;
      document.getElementById('duracao-evento-doar').textContent = evento.duracaoEvento + 'h';
      document.getElementById('preco-evento-doar').textContent = evento.precoInscricaoEvento;

      setupEventosDoacaoInscricao(eventoId);
    } else {
      console.error('Evento não encontrado!');
    }
  });

  function setupEventosDoacaoInscricao(eventoId) {
    const btnInscricao = document.getElementById("finalizarDoarEventoInscricao");
    btnInscricao.addEventListener('click', function(event) {
        event.preventDefault();
        verificarModal(eventoId);
    });
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

function verificarModal(eventoId) {
  
      var finalizarInscricao = new bootstrap.Modal(document.getElementById('confirmacaoModalInscricaoEventoDoar'));
      finalizarInscricao.show();
      document.getElementById('confirmarInscricaoEventoDoar').onclick = function() {
        adicionarInscricaoAoEventoDoacao(eventoId); 

  }
}


function adicionarInscricaoAoEventoDoacao(eventoId) {
    const loginData = JSON.parse(localStorage.getItem("login"));
    let eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    let evento = eventos.find(e => e.id === eventoId);

    if (evento) {
        // Verifica se o utilizador já está inscrito
        const inscricaoExistente = evento.inscricoes.find(inscricao => 
            inscricao.nome === loginData.name && inscricao.email === loginData.email
        );

        if (inscricaoExistente) {
            var jaInscritoEvento = new bootstrap.Modal(document.getElementById('inscricaoJaRealizadaDoacao'));
            jaInscritoEvento.show();
        } else {
            const novosLivros = coletarDadosLivros();  
            const novosMateriais = coletarDadosMateriais();

            let statusInscricao = "naoPresente";
            let submissaoDataInscricao = new Date().toLocaleString("pt-PT");
            // Adiciona a nova inscrição com doações ao evento
            evento.inscricoes.push({
                nome: loginData.name,
                email: loginData.email,
                dataInscricao: submissaoDataInscricao,
                doacoesLivros: novosLivros,
                doacoesMateriais: novosMateriais,
                status: statusInscricao
            });

            localStorage.setItem("eventos", JSON.stringify(eventos));

            var inscritoEventoModal = new bootstrap.Modal(document.getElementById('InscritoDoacaoEvento'));
            inscritoEventoModal.show();
        }
    } else {
        console.error('Evento não encontrado.');
    }
}

function coletarDadosLivros() {
    const livros = [];
    document.querySelectorAll('.livro-item').forEach(item => {
        const tituloLivro = item.querySelector('[name="livro[titulo][]"]').value;
        const autorLivro = item.querySelector('[name="livro[autor][]"]').value;
        const anoLivro = item.querySelector('[name="livro[ano][]"]').value;
        const estadoLivro = item.querySelector('[name="livro[estado][]"]').value;
        const estadoLivroDoacao = 'naoEntregue';
        const tipoLivro = 'Livro';

        // Verifica se algum dos campos está preenchido
        if (tituloLivro.trim() || autorLivro.trim() || anoLivro.trim() || estadoLivro.trim()) {
            livros.push({
                tituloLivro: tituloLivro,
                autorLivro: autorLivro,
                anoLivro: anoLivro,
                condicaoLivro: estadoLivro,
                statusLivro: estadoLivroDoacao,
                tipoLivro: tipoLivro
            });
        }
    });
    return livros;
}

function coletarDadosMateriais() {
    const materiais = [];
    document.querySelectorAll('.material-item').forEach(item => {
        const descricaoMaterial = item.querySelector('[name="material[descricao][]"]').value;
        const tipoMaterial = item.querySelector('[name="material[tipo][]"]').value;
        const quantidadeMaterial = parseInt(item.querySelector('[name="material[quantidade][]"]').value, 10);
        const estadoMaterial = item.querySelector('[name="material[estadoMaterial][]"]').value;
        const estadoMaterialDoacao = 'naoEntregue';

        // Verifica se os campos de descrição e tipo não estão vazios e se a quantidade é um número válido maior que zero
        if (descricaoMaterial.trim() && tipoMaterial.trim() && !isNaN(quantidadeMaterial) && quantidadeMaterial > 0) {
            materiais.push({
                descricaoMaterial: descricaoMaterial,
                tipoMaterial: tipoMaterial,
                quantidadeMaterial: quantidadeMaterial,
                statusMaterial: estadoMaterialDoacao,
                condicaoMaterial: estadoMaterial
            });
        }
    });
    return materiais;
}