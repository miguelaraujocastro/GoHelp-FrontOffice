var livroCounter = 0;
var materialCounter = 0;

document.addEventListener("DOMContentLoaded", function() {
    var addLivroBtn = document.getElementById("addLivroBtn");
    var removeLivroBtn = document.getElementById("removeLivroBtn");
    addLivroBtn.addEventListener("click", function(event) {
        event.preventDefault();
        adicionarLivro();
    });
    removeLivroBtn.addEventListener("click", function(event) {
        event.preventDefault();
        removerLivro();
    });

    var addMaterialBtn = document.getElementById("addMaterialBtn");
    var removeMaterialBtn = document.getElementById("removeMaterialBtn");
    addMaterialBtn.addEventListener("click", function(event) {
        event.preventDefault();
        adicionarMaterial();
    });
    removeMaterialBtn.addEventListener("click", function(event) {
        event.preventDefault();
        removerMaterial();
    });

    var livroRadioSim = document.getElementById("flexRadioDefault1");
    var livroRadioNao = document.getElementById("flexRadioDefault2");
    var materialRadioSim = document.getElementById("flexRadioDefault1-material");
    var materialRadioNao = document.getElementById("flexRadioDefault2-material");
    var livroSection = document.getElementById("doacao-livros");
    var materialSection = document.getElementById("doacao-materiais");

    livroRadioSim.addEventListener("change", function() {
        if (this.checked) {
            livroSection.style.display = "block";
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

function adicionarLivro() {
    livroCounter++;
    var livrosList = document.getElementById("livros-list");
    var novoLivro = document.createElement("li");
    novoLivro.classList.add("livro-item");

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
    materialCounter++;
    var materialList = document.getElementById("material-list");
    var novoMaterial = document.createElement("li");
    novoMaterial.classList.add("material-item");

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
    materialList.appendChild(novoMaterial);
}

function removerMaterial() {
    var materialList = document.getElementById("material-list");
    var materiais = materialList.getElementsByClassName("material-item");
    if (materiais.length > 1) {
        materialList.removeChild(materiais[materiais.length - 1]);
    }
}

function carregarCategorias(selectElement) {
    if (!selectElement) {
        console.error('Elemento select de categorias não foi fornecido.');
        return;
    }

    const materiais = JSON.parse(localStorage.getItem('materiais'));
    if (!materiais) {
        console.error('Nenhum material encontrado no localStorage.');
        return;
    }

    const categorias = [...new Set(materiais.map(material => material.categoria))];
    selectElement.innerHTML = '<option disabled selected value="">Tipo</option>';
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

    selectMaterial.innerHTML = '<option disabled selected value="">Material</option>';
    if (categoriaSelecionada) {
        const materiaisFiltrados = materiais.filter(material => material.categoria === categoriaSelecionada);
        materiaisFiltrados.forEach(material => {
            const option = document.createElement('option');
            option.value = material.descricao;
            option.textContent = material.descricao;
            selectMaterial.appendChild(option);
        });
        selectMaterial.removeAttribute('disabled');
    } else {
        selectMaterial.setAttribute('disabled', 'disabled');
    }
}
