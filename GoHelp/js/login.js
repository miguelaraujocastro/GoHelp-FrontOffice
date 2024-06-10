//LOGIN----------------------------------------------------

function logOut() {
    const loginData = { };

    // Armazena o objeto de login no localStorage
    localStorage.setItem("login", JSON.stringify(loginData));

    checkLoginStatus(); // Atualiza a interface para fazer o logout
    window.location.href = "index.html";
}

function checkLoginStatus() {
    const loginData = JSON.parse(localStorage.getItem("login"));

    if (loginData && loginData.email && loginData.name) {
        // utilizador está logado
        document.getElementById("userLoginStatus").innerHTML = `
        <div class="dropdown clicar-dropdown">
            <a class="social-icon-link bi-bell dropdown-toggle" id="notificationDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style="display: inline-flex; align-items: center; margin-right: 15px;">
                <span class="badge-notification bg-danger"></span>
            </a>
            <ul class="dropdown-menu section-notificacoes" aria-labelledby="notificationDropdown">
                <!-- Seu conteúdo do dropdown aqui -->
                <li class="dropdown-item titulo"><h6>Notificações</h6></li>
            </ul>
        </div>
        <div class="dropdown">
            <a class="social-icon-link bi-person dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                ${loginData.name}
            </a>
            <div class="dropdown-menu section-conta" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" href="contaPedidosEventos.html">Conta</a>
                <a class="dropdown-item" href="#" onclick="logOut()">Terminar Sessão</a>
            </div>
        </div>`;
    } else {
        // utilizador não está logado ou os dados não estão disponíveis
        document.getElementById("userLoginStatus").innerHTML = `<a href="login.html" class="social-icon-link bi-person" id="loginLink">  Iniciar Sessão ou Registar-se</a>`;
    }
}

document.addEventListener("DOMContentLoaded", checkLoginStatus);


function handleCredentialResponse(response) {
    const data = jwt_decode(response.credential);

    const user_record = JSON.parse(localStorage.getItem("utilizadoresFrontOffice")) || [];
    const currentUser = user_record.find(user => user.email === data.email);

    if (currentUser) {
        var loginSucesso = new bootstrap.Modal(document.getElementById('loginSucesso'));
        loginSucesso.show();

        const loginData = { name: data.name, email: data.email };
        localStorage.setItem("login", JSON.stringify(loginData));

        window.location.href = "index.html"; 
    } else {
        var registoNaoEfetuado = new bootstrap.Modal(document.getElementById('registoNaoEfetuado'));
        registoNaoEfetuado.show();
    }
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id: "233099860430-75g9d5ov3oome9tuv1205evl7k5pa0us.apps.googleusercontent.com",
    callback: handleCredentialResponse
  });
  google.accounts.id.renderButton(
    document.getElementById("buttonDiv"),
    { theme: "outline", 
    size: "large", 
    type: "icon",
    shape: "circle",
    text:"signin_with",
    class: 'custom-google-btn'
     }  // atributos de customização do login do google
  );
  google.accounts.id.prompt();
}


// Função para marcar todas as notificações como lidas
function marcarNotificacoesComoLidas() {
    const loginData = JSON.parse(localStorage.getItem("login")); // Obter dados de login
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes'));
    if (notificacoes && loginData && loginData.email) {
        // Marcar como lidas apenas as notificações do utilizador logado
        notificacoes.notificacoesPedidosEventos.forEach(not => {
            if (not.emailPedidoPedEvento === loginData.email) {
                not.estadoNotificacaoPedEvento = 'Lida';
            }
        });
        notificacoes.notificacoesPedidosTrabalho.forEach(not => {
            if (not.emailPedidoTrabalho === loginData.email) {
                not.estadoNotificacaoTrabalho = 'Lida';
            }
        });
        // Atualizar o localStorage
        localStorage.setItem('notificacoes', JSON.stringify(notificacoes));
    }
}
// Evento de clique para o dropdown de notificações
document.addEventListener('DOMContentLoaded', function() {
    var notificationDropdown = document.getElementById('notificationDropdown');
    notificationDropdown.addEventListener('click', function (event) {
        event.preventDefault();
        var dropdownMenu = this.nextElementSibling;
        if (dropdownMenu.style.display === 'block') {
            dropdownMenu.style.display = 'none';
        } else {
            dropdownMenu.style.display = 'block';
            // Marcar as notificações como lidas quando o utilizador abrir o dropdown
            marcarNotificacoesComoLidas();
            // Esconder o indicador após ler as notificações
            document.querySelector('.badge-notification').style.display = 'none';
        }
    }, false);
});

// Verificar se existem notificações não lidas ao carregar o indicador
function verificarNotificacoesNaoLidas() {
    const loginData = JSON.parse(localStorage.getItem("login")); // Obter dados de login
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes'));
    if (!loginData || !loginData.email) return false;

    return notificacoes && (
        notificacoes.notificacoesPedidosEventos.some(not => not.emailPedidoPedEvento === loginData.email && not.estadoNotificacaoPedEvento === 'NaoLida') ||
        notificacoes.notificacoesPedidosTrabalho.some(not => not.emailPedidoTrabalho === loginData.email && not.estadoNotificacaoTrabalho === 'NaoLida')
    );
}

// Atualizar a exibição de notificações baseado no estado de leitura
function atualizarExibicaoNotificacoes() {
    const temNotificacoesNaoLidas = verificarNotificacoesNaoLidas();
    const badge = document.querySelector('.badge-notification');
    if (temNotificacoesNaoLidas) {
        badge.style.display = 'inline-block';
    } else {
        badge.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", function() {
    carregarNotificacoes();
    atualizarExibicaoNotificacoes();
});




function carregarNotificacoes() {
    const loginData = JSON.parse(localStorage.getItem("login")); // Obter dados de login
    const notificacoesContainer = document.querySelector('.section-notificacoes');
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes'));

    // Verificar se há notificações disponíveis no localStorage
    if (!notificacoes || (!notificacoes.notificacoesPedidosEventos && !notificacoes.notificacoesPedidosTrabalho)) {
        const item = document.createElement('li');
        item.className = 'dropdown-item';
        item.textContent = 'Não há notificações';
        notificacoesContainer.appendChild(item);
        return; // Sair da função se não houver notificações
    }

    // Criar uma lista única de todas as notificações
    let todasNotificacoes = [];
    if (notificacoes.notificacoesPedidosEventos) {
        todasNotificacoes = todasNotificacoes.concat(notificacoes.notificacoesPedidosEventos.map(not => ({ ...not, tipo: 'evento' })));
    }
    if (notificacoes.notificacoesPedidosTrabalho) {
        todasNotificacoes = todasNotificacoes.concat(notificacoes.notificacoesPedidosTrabalho.map(not => ({ ...not, tipo: 'trabalho' })));
    }

    // Filtrar e ordenar as notificações pelo email do utilizador logado e pela data de notificação
    const notificacoesFiltradas = todasNotificacoes.filter(notificacao => notificacao.emailPedidoPedEvento === loginData.email || notificacao.emailPedidoTrabalho === loginData.email);
    notificacoesFiltradas.sort((a, b) => {
        const dataA = a.tipo === 'evento' ? Date.parse(a.dataNotificacaoPedEvento) : Date.parse(a.dataNotificacaoTrabalho);
        const dataB = b.tipo === 'evento' ? Date.parse(b.dataNotificacaoPedEvento) : Date.parse(b.dataNotificacaoTrabalho);
        return dataB - dataA;
    });

    if (notificacoesFiltradas.length > 0) {
        notificacoesFiltradas.forEach(notificacao => {
            const item = document.createElement('li');
            item.className = 'dropdown-item';

            if (notificacao.tipo === 'evento') {
                item.innerHTML = `
                    <a href="contaPedidosEventos.html">Notificação relativa ao pedido de <strong>evento</strong> <strong>${notificacao.tituloPedidoPedEvento}</strong> realizado em <strong>${notificacao.submissaoDataPedidoEvento}</strong></a>
                    <span class="notificacao-data">${notificacao.dataNotificacaoPedEvento}</span>`;
            } else {
                item.innerHTML = `
                    <a href="contaPedidosTrabalho.html">Notificação relativa ao pedido de <strong>trabalho</strong> realizado em <strong>${notificacao.submissaoDataPedidoTrabalho}</strong></a>
                    <span class="notificacao-data">${notificacao.dataNotificacaoTrabalho}</span>`;
            }
            
            notificacoesContainer.appendChild(item);
        });
    } else {
        const item = document.createElement('li');
        item.className = 'dropdown-item';
        item.textContent = 'Não há novas notificações';
        notificacoesContainer.appendChild(item);
    }
}