const cardContainer = document.getElementById("card-container");
const searchContainer = document.getElementById("search-container");
const inputBusca = searchContainer.querySelector("input");
const logo = document.querySelector(".header-title h1");
const genreFilter = document.getElementById("genre-filter");

let todasAsBandas = []; // Array para armazenar todas as bandas carregadas do JSON

// Função para renderizar os cards na tela
function renderizarCards(listaDeBandas) {
    cardContainer.innerHTML = ""; // Limpa o container antes de adicionar novos cards

    if (listaDeBandas.length === 0) {
        cardContainer.innerHTML = '<p class="error-message">Nenhuma banda encontrada com esse nome.</p>';
        return;
    }

    listaDeBandas.forEach((banda, index) => {
        const card = document.createElement('article');
        card.className = 'card';
        card.style.animationDelay = `${index * 0.05}s`; // Adiciona o atraso em cascata

        // Cria o HTML do card com a imagem e as informações da banda
        card.innerHTML = `
            <img src="${banda.imagem}" alt="Foto da banda ${banda.nome}" class="card-image">
            <div class="card-content">
                <span class="subgenero-tag">${banda.subgenero}</span>
                <h2>${banda.nome}</h2>
                <p><strong>Cidade:</strong> ${banda.cidade}</p>
                <p>${banda.descricao}</p>
                <a href="${banda.link}" target="_blank">Ouça no Spotify</a>
            </div>
        `;
        cardContainer.appendChild(card);
    });
}

// Função para popular o dropdown de subgêneros
function popularFiltroSubgeneros(subgeneros) {
    subgeneros.forEach(subgenero => {
        const option = document.createElement('option');
        option.value = subgenero;
        option.textContent = subgenero;
        genreFilter.appendChild(option);
    });
}

// Função unificada que aplica todos os filtros (busca e gênero)
function aplicarFiltros() {
    const termoBuscado = inputBusca.value.toLowerCase();
    const generoSelecionado = genreFilter.value;

    let bandasFiltradas = todasAsBandas;

    // 1. Filtra por gênero (se não for "todos")
    if (generoSelecionado !== "todos") {
        bandasFiltradas = bandasFiltradas.filter(banda => banda.subgenero === generoSelecionado);
    }

    // 2. Filtra pelo termo buscado (nome ou cidade)
    if (termoBuscado) {
        bandasFiltradas = bandasFiltradas.filter(banda => 
            banda.nome.toLowerCase().includes(termoBuscado) ||
            banda.cidade.toLowerCase().includes(termoBuscado)
        );
    }

    renderizarCards(bandasFiltradas);
}

// Função principal que carrega os dados
async function carregarDados() {
    try {
        const response = await fetch('data.json'); // Busca o arquivo JSON
        todasAsBandas = await response.json(); // Armazena os dados na variável global

        // Pega todos os subgêneros únicos do JSON
        const subgenerosUnicos = [...new Set(todasAsBandas.map(banda => banda.subgenero))];
        
        popularFiltroSubgeneros(subgenerosUnicos.sort()); // Popula o dropdown
        renderizarCards(todasAsBandas); // Renderiza todas as bandas inicialmente

    } catch (error) {
        console.error("Erro ao carregar os dados das bandas:", error);
        cardContainer.innerHTML = '<p class="error-message">Não foi possível carregar os dados. Tente novamente mais tarde.</p>';
    }
}

// Chamar a função para carregar as bandas quando a página carregar
document.addEventListener('DOMContentLoaded', carregarDados);

// Adiciona funcionalidade ao logo para voltar à tela inicial
logo.addEventListener('click', () => {
    inputBusca.value = "";
    genreFilter.value = "todos";
    aplicarFiltros();
});

// Adiciona "ouvintes" para os filtros
inputBusca.addEventListener('input', aplicarFiltros);
genreFilter.addEventListener('change', aplicarFiltros);
