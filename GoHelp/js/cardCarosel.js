document.addEventListener('DOMContentLoaded', function () {
  const maxCardsPerCarouselItem = 4; // Número máximo de cartões por item do carrossel

  function createEventCard(evento) {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'card';

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'image-wrapper';

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
    infoButton.className = "btn-carousel-portfolio-info carousel-info";
    infoButton.textContent = "+Info";
    infoButton.style.marginRight = "5px";

    const inscreverButton = document.createElement('a');
    inscreverButton.href = "#";
    inscreverButton.id = "inscreverButton";
    inscreverButton.className = "btn-carousel-portfolio-comprar carousel-comprar";
    inscreverButton.setAttribute('id', 'btnInscreverEvento');
    inscreverButton.innerHTML = '<i class="bi bi-ticket-perforated rotate-icon"></i>&nbspInscrever';
    inscreverButton.addEventListener('click', function(event) {
        event.preventDefault();
        verificarLoginEExibirModal(evento.id);
    });

    imageWrapper.appendChild(img);
    cardButtons.appendChild(infoButton);
    cardButtons.appendChild(inscreverButton);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardTextLocal);
    cardBody.appendChild(cardTextDuracao);
    cardBody.appendChild(cardTextData);
    cardBody.appendChild(cardButtons);

    cardWrapper.appendChild(imageWrapper);
    cardWrapper.appendChild(cardBody);

    return cardWrapper;
  }

  function addCardToCarousel(cardElement, carouselInner) {
      let lastCarouselItem = carouselInner.lastElementChild;
      let isNewCarouselItemNeeded = !lastCarouselItem || lastCarouselItem.querySelectorAll('.card').length >= maxCardsPerCarouselItem;

      if (isNewCarouselItemNeeded) {
          lastCarouselItem = document.createElement('div');
          lastCarouselItem.className = 'carousel-item';
          const cardsWrapper = document.createElement('div');
          cardsWrapper.className = 'cards-wrapper';
          lastCarouselItem.appendChild(cardsWrapper);
          carouselInner.appendChild(lastCarouselItem);
      }

      lastCarouselItem.querySelector('.cards-wrapper').appendChild(cardElement);

      if (!carouselInner.querySelector('.carousel-item.active')) {
          lastCarouselItem.classList.add('active');
      }
  }

  function loadEventsIntoCarousel() {
      const eventos = JSON.parse(localStorage.getItem('eventos')) || [];
      eventos.forEach(evento => {
          const carouselSelector = getCarouselSelector(evento.tipo);
          const carouselInner = document.querySelector(carouselSelector + ' .carousel-inner');
          const newCard = createEventCard(evento);
          addCardToCarousel(newCard, carouselInner);
      });
      // Redistribuir para cada tipo de evento individualmente
      redistributeCards('Feira do Livro');
      redistributeCards('Concerto');
      redistributeCards('Teatro');
  }

  function getCarouselSelector(tipoEvento) {
      switch (tipoEvento) {
          case 'Feira do Livro':
              return '#sectionEventosLivros';
          case 'Concerto':
              return '#sectionEventosConcertos';
          case 'Teatro':
              return '#sectionEventosTeatro';
          default:
              return null;
      }
  }

  function redistributeCards(tipoEvento) {
      const carouselSelector = getCarouselSelector(tipoEvento);
      const carouselInner = document.querySelector(carouselSelector + ' .carousel-inner');
      updateMaxCardsPerView(carouselInner);
  }

  function updateMaxCardsPerView(carouselInner) {
      let newMaxCards = maxCardsPerCarouselItem;
      if (window.innerWidth < 1200) newMaxCards = 3;
      if (window.innerWidth < 992) newMaxCards = 2;
      if (window.innerWidth < 728) newMaxCards = 1;

      const allCards = Array.from(carouselInner.querySelectorAll('.card'));
      const numberOfCardsNeeded = Math.ceil(allCards.length / newMaxCards);
      carouselInner.innerHTML = '';

      for (let i = 0; i < numberOfCardsNeeded; i++) {
          const carouselItem = document.createElement('div');
          carouselItem.className = 'carousel-item';
          if (i === 0) carouselItem.classList.add('active');

          const cardsWrapper = document.createElement('div');
          cardsWrapper.className = 'cards-wrapper';
          allCards.slice(i * newMaxCards, (i + 1) * newMaxCards).forEach(card => cardsWrapper.appendChild(card));
          carouselItem.appendChild(cardsWrapper);
          carouselInner.appendChild(carouselItem);
      }
  }

  window.addEventListener('resize', () => {
      redistributeCards('Feira do Livro');
      redistributeCards('Concerto');
      redistributeCards('Teatro');
  });

  loadEventsIntoCarousel();
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
        var continuarInscricao= new bootstrap.Modal(document.getElementById('confirmationModalInscricaoEvento'));
        continuarInscricao.show();
        document.getElementById('continuarInscricaoEvento').onclick = function() {
            mostrarModalDoacao(eventoId); 
        };
    } else {
        var loginNaoEfetuado = new bootstrap.Modal(document.getElementById('loginNaoEfetuadoPedidoEvento'));
        loginNaoEfetuado.show();
    }
}

function mostrarModalDoacao(eventoId) {
    var doacaoModal = new bootstrap.Modal(document.getElementById('confirmationModalDoarNoEvento'));
    doacaoModal.show();

    document.getElementById('naoDoarEvento').onclick = function() {
        adicionarInscricaoAoEvento(eventoId); 
    };

    var doarButton = document.getElementById('btn-doar-No-Evento');
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
                var jaInscritoEvento = new bootstrap.Modal(document.getElementById('inscricaoJaRealizada'));
                jaInscritoEvento.show();
                return;
            }

            // Encontra o local do evento
            let localDoEvento = locais.find(local => local.nome === evento.localEvento);

            // Verifica a capacidade do local
            if (evento.inscricoes.length >= localDoEvento.capacidade) {
                // Se a capacidade já estiver lotada, esconde o modal de doação e mostra o alerta
                doacaoModal.hide();
                var capacidadeLotadaModal = new bootstrap.Modal(document.getElementById('capacidadeLotada'));
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
            var jaInscritoEvento = new bootstrap.Modal(document.getElementById('inscricaoJaRealizada'));
            jaInscritoEvento.show();
            return;
        }

        // Encontra o local do evento
        let localDoEvento = locais.find(local => local.nome === evento.localEvento);

        // Verifica a capacidade do local
        if (evento.inscricoes.length >= localDoEvento.capacidade) {
            // Se a capacidade já estiver lotada, mostra o alerta
            var capacidadeLotadaModal = new bootstrap.Modal(document.getElementById('capacidadeLotada'));
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
        var inscritoEventoModal = new bootstrap.Modal(document.getElementById('InscritoEvento'));
        inscritoEventoModal.show();
    } else {
        console.error('Evento não encontrado.');
    }
}
