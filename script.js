const movies = document.querySelector('.movies');
const btnNext = document.querySelector('.btn-next');
const btnPrev = document.querySelector('.btn-prev');
const input = document.querySelector('.input');

const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');
const highlightVideoLink = document.querySelector('.highlight__video-link');

const modal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescrip = document.querySelector('.modal__description');
const modalAverage = document.querySelector('.modal__average');
const modalGenre = document.querySelector('.modal__genre');
const modalGenres = document.querySelector('.modal__genres');
const modalClose = document.querySelector('.modal__close');

const logo = document.querySelector('.header__title');
logo.style.cursor = 'pointer';
logo.addEventListener('click', () => {
    requisicaoFilmes();
});

let arrayGrupos = [];
let contador = 0;

async function requisicaoFilmes() {
    const promiseFilmes = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false');
    const filmes = await promiseFilmes.json();
    carrossel(filmes);
};
requisicaoFilmes();

async function filmeDoDia() {
    const promiseFIlmeDoDia = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');
    const filmeDoDia = await promiseFIlmeDoDia.json();
    const promiseVideos = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');
    const videos = await promiseVideos.json();

    highlightVideo.style.backgroundImage = `url(${filmeDoDia.backdrop_path})`;
    highlightRating.textContent = filmeDoDia.vote_average.toFixed(1);
    highlightTitle.textContent = filmeDoDia.title;
    let genresConcat = '';
    filmeDoDia.genres.map((genre) => {
        return genresConcat += genre.name + ' ';
    });
    highlightGenres.textContent = genresConcat;
    highlightLaunch.textContent = filmeDoDia.release_date;
    highlightDescription.textContent = filmeDoDia.overview;
    highlightVideoLink.href = `https://www.youtube.com/watch?v=${videos.results[0].key}`;
};
filmeDoDia();

function criarElementos(filme) {
    const divMovie = document.createElement('div');
    const divMovieInfo = document.createElement('div');
    const spanMovieTitle = document.createElement('span');
    const spanMovieRating = document.createElement('span');
    const imgMovie = document.createElement('img');
    const id = document.createElement('p');

    id.textContent = filme.id;
    id.classList.add('hidden');

    divMovie.classList.add('movie');
    divMovie.style.backgroundImage = `url(${filme.poster_path})`;
    divMovieInfo.classList.add('movie__info');

    spanMovieTitle.classList.add('movie__title');
    spanMovieTitle.textContent = filme.title;

    spanMovieRating.classList.add('movie__rating');
    spanMovieRating.textContent = filme.vote_average;

    imgMovie.src = './assets/estrela.svg';
    imgMovie.alt = 'Estrela';

    movies.append(divMovie);
    divMovie.append(divMovieInfo, id);
    divMovieInfo.append(spanMovieTitle, spanMovieRating);
    spanMovieRating.append(imgMovie);

    divMovie.addEventListener('click', (event) => {
        const filme = event.target;
        const idFilme = filme.querySelector('p');

        abrirModal(idFilme.textContent);
    });
};

async function pesquisar() {
    input.addEventListener('keypress', async () => {
        const pesquisa = 'https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false**&query=';
        const home = 'https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false';
        let promiseResposta;

        if (event.code === 'Enter') {
            if (input.value === '') {
                promiseResposta = await fetch(home);
            } else {
                promiseResposta = await fetch(pesquisa + input.value);
            };

            const promiseJson = await promiseResposta.json()
            carrossel(promiseJson);
            input.value = '';
        };
    });

};

pesquisar();

btnNext.addEventListener('click', () => {
    if (contador < arrayGrupos.length - 1) {
        contador++
    } else {
        contador = 0;
    };
    movies.innerHTML = '';
    arrayGrupos[contador].forEach(filme => {
        criarElementos(filme);
    });
});
btnPrev.addEventListener('click', () => {
    if (contador > 0) {
        contador--;
    } else {
        contador = arrayGrupos.length - 1;
    };
    movies.innerHTML = '';
    arrayGrupos[contador].forEach(filme => {
        criarElementos(filme);
    });
});

async function abrirModal(idFilme) {
    modalGenres.innerHTML = '';
    const promiseModal = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/' + idFilme + '?language=pt-BR');
    const modalFilme = await promiseModal.json();

    modalTitle.textContent = modalFilme.title;
    modalImg.src = modalFilme.backdrop_path;
    modalDescrip.textContent = modalFilme.overview;
    modalAverage.textContent = modalFilme.vote_average;
    modalFilme.genres.map((genre) => {
        const modalGenre = document.createElement('span');

        modalGenre.classList.add('modal__genre');

        modalGenre.textContent = genre.name;

        modalGenres.append(modalGenre);
    });

    modal.classList.remove('hidden');
};

modalClose.addEventListener('click', () => {
    modal.classList.add('hidden');
});

function carrossel(filmes) {
    arrayGrupos = [];
    movies.innerHTML = '';

    let grupoFilmes1;
    let grupoFilmes2;
    let grupoFilmes3;
    let grupoFilmes4;

    if (filmes.results.length <= 5) {
        grupoFilmes1 = filmes.results.slice(0);
        arrayGrupos.push(grupoFilmes1);
    } else if (filmes.results.length <= 10) {
        grupoFilmes1 = filmes.results.slice(0, 5);
        grupoFilmes2 = filmes.results.slice(5);
        arrayGrupos.push(grupoFilmes1);
        arrayGrupos.push(grupoFilmes2);
    } else if (filmes.results.length <= 15) {
        grupoFilmes1 = filmes.results.slice(0, 5);
        grupoFilmes2 = filmes.results.slice(5, 10);
        grupoFilmes3 = filmes.results.slice(10);
        arrayGrupos.push(grupoFilmes1);
        arrayGrupos.push(grupoFilmes2);
        arrayGrupos.push(grupoFilmes3);
    } else {
        grupoFilmes1 = filmes.results.slice(0, 5);
        grupoFilmes2 = filmes.results.slice(5, 10);
        grupoFilmes3 = filmes.results.slice(10, 15);
        grupoFilmes4 = filmes.results.slice(15);
        arrayGrupos.push(grupoFilmes1);
        arrayGrupos.push(grupoFilmes2);
        arrayGrupos.push(grupoFilmes3);
        arrayGrupos.push(grupoFilmes4);
    };
    grupoFilmes1.forEach(filme => {
        criarElementos(filme);
    });
};
