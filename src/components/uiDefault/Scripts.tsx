// Carrossel de categorias - funcionalidade básica
const categoriaCards = document.querySelectorAll('.categoria-card');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const indicators = document.querySelectorAll('.carousel-indicators .dot');
let currentIndex = 0;

function updateCarousel() {
    categoriaCards.forEach((card, idx) => {
        card.style.display = (idx === currentIndex) ? 'flex' : 'none';
    });
    indicators.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
    });
}

prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + categoriaCards.length) % categoriaCards.length;
    updateCarousel();
});

nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % categoriaCards.length; 
    updateCarousel();
});

updateCarousel();

// Ação ao ícone do carrinho
const cartIcon = document.getElementById('cart-icon');
cartIcon.addEventListener('click', () => {
    alert('Você clicou no carrinho! (Aqui pode abrir um modal ou redirecionar para a página do carrinho)');
});

// Carrossel de outras categorias
const outrasCards = document.querySelectorAll('.outra-categoria-card');
const outrasPrevBtn = document.querySelector('.outras-carousel-btn.prev');
const outrasNextBtn = document.querySelector('.outras-carousel-btn.next');
const outrasDots = document.querySelectorAll('.outras-carousel-indicators .outras-dot');
let outrasIndex = 0;

function updateOutrasCarousel() {
    outrasCards.forEach((card, idx) => {
        card.style.display = (idx === outrasIndex) ? 'flex' : 'none';
    });
    outrasDots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === outrasIndex);
    });
}

outrasPrevBtn.addEventListener('click', () => {
    outrasIndex = (outrasIndex - 1 + outrasCards.length) % outrasCards.length; 
    updateOutrasCarousel();
});

outrasNextBtn.addEventListener('click', () => {
    outrasIndex = (outrasIndex + 1) % outrasCards.length;
    updateOutrasCarousel();
});

updateOutrasCarousel();

// Ação do botão do destaque veterinário
const destaqueBtn = document.querySelector('.destaque-vet-btn');
const destaqueTexto = document.querySelector('.destaque-vet-texto');

let mostrandoMais = false;
const textoOriginal = destaqueTexto.innerHTML;
const textoExtra = `<h3>Sobre o Selo de Qualidade</h3><p>O Selo SIF garante que os produtos passaram por rigorosa inspeção. Produtos cruelty-free não são testados em animais. Confie na Petfarma!</p>`;

destaqueBtn.addEventListener('click', () => {
    if (!mostrandoMais) {
        destaqueTexto.innerHTML += textoExtra;
        mostrandoMais = true;
        destaqueBtn.setAttribute('aria-label', 'Fechar informações');
    } else {
        destaqueTexto.innerHTML = textoOriginal;
        mostrandoMais = false;
        destaqueBtn.setAttribute('aria-label', 'Mostrar mais informações');
    }
});
