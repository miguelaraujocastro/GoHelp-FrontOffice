// Definição das variáveis globais dos contadores
var livroCounter = 0;
var materialCounter = 0;

document.addEventListener("DOMContentLoaded", function() {
    // Event listeners para adicionar e remover livros
    var addLivroBtn = document.getElementById("addLivroBtn");
    var removeLivroBtn = document.getElementById("removeLivroBtn");
    addLivroBtn.addEventListener("click", adicionarLivro);
    removeLivroBtn.addEventListener("click", removerLivro);
});

document.addEventListener("DOMContentLoaded", function() {
    var removeLivroBtn = document.getElementById("removeLivroBtn");
    removeLivroBtn.addEventListener("click", removerLivro);
});

document.addEventListener("DOMContentLoaded", function() {
    // Event listeners para adicionar e remover materiais
    var addMaterialBtn = document.getElementById("addMaterialBtn");
    var removeMaterialBtn = document.getElementById("removeMaterialBtn");
    addMaterialBtn.addEventListener("click", adicionarMaterial);
    removeMaterialBtn.addEventListener("click", removerMaterial);
});

document.addEventListener("DOMContentLoaded", function() {
    var removeMaterialBtn = document.getElementById("removeMaterialBtn");
    removeMaterialBtn.addEventListener("click", removerMaterial);
});

function adicionarLivro() {
    livroCounter++; // Incrementa o contador para garantir um ID único a cada chamada
    var livrosList = document.getElementById("livros-list");
    var novoLivro = document.createElement("li");
    novoLivro.classList.add("livro-item");

    // Configura o innerHTML do novo livro com IDs específicos para cada campo
    novoLivro.innerHTML = `
        <div class="row mt-4">
            <div class="col-lg-12 col-md-12 col-12">
                <input type="text" name="livro[titulo][]" class="form-control" placeholder="Título do Livro" required>
            </div>
            <div class="col-lg-12 col-md-12 col-12 mt-4">
                <input type="text" name="livro[autor][]" class="form-control" placeholder="Autor" required>
            </div>
            <div class="col-lg-6 col-md-6 col-12 mt-4">
                <input type="text" name="livro[ano][]" class="form-control" placeholder="Ano" required>
            </div>
            <div class="col-lg-6 col-md-6 col-12 mt-4">
                <input type="number" name="livro[estado][]" min="1" max="5" class="form-control" placeholder="Estado (1-5)" required>
            </div>
        </div>
    `;

    // Adiciona o novo item de livro à lista no DOM
    livrosList.appendChild(novoLivro);
}

function removerLivro() {
    var livrosList = document.getElementById("livros-list");
    var livros = livrosList.getElementsByClassName("livro-item");
    if (livros.length > 1) {
        livrosList.removeChild(livros[livros.length - 1]);
    }
}

function adicionarMaterial() {
    materialCounter++; // Incrementa o contador para garantir um ID único a cada chamada
    var materialList = document.getElementById("material-list");
    var novoMaterial = document.createElement("li");
    novoMaterial.classList.add("material-item");

    // Configura o innerHTML do novo material com IDs específicos para cada campo
    novoMaterial.innerHTML = `
    <div class="row material-group mt-4">
        <div class="col-lg-12 col-md-12 col-12">
            <select name="material[tipo][]" class="form-control categoria form-select" required onfocus="carregarCategorias(this)" onchange="carregarMateriais(this)">
                <option disabled selected value="">Tipo</option>
            </select>
        </div>
        <div class="col-lg-12 col-md-12 col-12 mt-4">
            <select name="material[descricao][]" class="form-control material form-select" required disabled>
                <option disabled selected value="">Material</option>
            </select>
        </div>

        <div class="col-lg-6 col-md-6 col-6 mt-4">
            <input type="number" name="material[quantidade][]" min="1" class="form-control" placeholder="Quantidade" required>
        </div>
        <div class="col-lg-6 col-md-6 col-12 mt-4">
                <input type="number" name="material[estadoMaterial][]" min="1" max="5" class="form-control" placeholder="Estado (1-5)" required>
        </div>
    </div>
    `;

    // Adiciona o novo item de material à lista no DOM
    materialList.appendChild(novoMaterial);
}

function removerMaterial() {
    var materialList = document.getElementById("material-list");
    var materiais = materialList.getElementsByClassName("material-item");
    if (materiais.length > 1) {
        materialList.removeChild(materiais[materiais.length - 1]);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    var livroRadioSim = document.getElementById("flexRadioDefault1");
    var livroRadioNao = document.getElementById("flexRadioDefault2");
    var materialRadioSim = document.getElementById("flexRadioDefault1-material");
    var materialRadioNao = document.getElementById("flexRadioDefault2-material");
    var livroSection = document.getElementById("doacao-livros");
    var materialSection = document.getElementById("doacao-materiais");

    livroRadioSim.addEventListener("change", function() {
        if (this.checked) {
            livroSection.style.display = "block";
            // Verifica se já existe algum campo de livro, se não, adiciona o primeiro campo
            if (document.getElementById("livros-list").children.length === 0) {
                adicionarLivro();
            }
        }
    });

    livroRadioNao.addEventListener("change", function() {
        if (this.checked) {
            livroSection.style.display = "none";
        }
    });

    materialRadioSim.addEventListener("change", function() {
        if (this.checked) {
            materialSection.style.display = "block";
            // Verifica se já existe algum campo de livro, se não, adiciona o primeiro campo
            if (document.getElementById("material-list").children.length === 0) {
                adicionarMaterial();
            }
        }
    });

    materialRadioNao.addEventListener("change", function() {
        if (this.checked) {
            materialSection.style.display = "none";
        }
    });
});


function carregarCategorias(selectElement) {
    console.log('Carregando categorias no elemento específico...');
    if (!selectElement) {
        console.error('Elemento select de categorias não foi fornecido.');
        return; // terminar se o elemento não estiver disponível
    }

    const materiais = JSON.parse(localStorage.getItem('materiais'));
    if (!materiais) {
        console.error('Nenhum material encontrado no localStorage.');
        return;
    }

    const categorias = [...new Set(materiais.map(material => material.categoria))];
    selectElement.innerHTML = '<option disabled selected value="">Tipo</option>'; // reset inicial
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria;
        option.textContent = categoria;
        selectElement.appendChild(option);
    });
}



function carregarMateriais(elementoCategoria) {
    const materiais = JSON.parse(localStorage.getItem('materiais'));
    const categoriaSelecionada = elementoCategoria.value;
    const container = elementoCategoria.closest('.material-group');
    const selectMaterial = container.querySelector('.material');

    selectMaterial.innerHTML = '<option disabled selected value="">Material</option>'; // reset inicial
    if (categoriaSelecionada) {
        const materiaisFiltrados = materiais.filter(material => material.categoria === categoriaSelecionada);
        materiaisFiltrados.forEach(material => {
            const option = document.createElement('option');
            option.value = material.designacao;
            option.textContent = material.designacao;
            selectMaterial.appendChild(option);
        });
        selectMaterial.disabled = false;
    } else {
        selectMaterial.disabled = true;
    }
}
