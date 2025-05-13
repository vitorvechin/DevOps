import './style.css'
import Swiper from 'swiper'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/autoplay'

// Cards de produtos
const products = [
    {
        image: '/src/assets/foto-carrossel.png',
        title: 'Lorem ipsum dolor sit amet consectetuer adipiscing elit',
        originalPrice: 'R$ 100,00',
        price: 'R$79,90',
        discount: '20% OFF',
        installment: '10x de R$ 7,90',
    },
    {
        image: '/src/assets/foto-carrossel.png',
        title: 'Lorem ipsum dolor sit amet consectetuer adipiscing elit',
        originalPrice: 'R$ 100,00',
        price: 'R$79,90',
        discount: '20% OFF',
        installment: '10x de R$ 7,90',
    },
    {
        image: '/src/assets/foto-carrossel.png',
        title: 'Lorem ipsum dolor sit amet consectetuer adipiscing elit',
        originalPrice: 'R$ 100,00',
        price: 'R$79,90',
        discount: '20% OFF',
        installment: '10x de R$ 7,90',
    },
    {
        image: '/src/assets/foto-carrossel.png',
        title: 'Lorem ipsum dolor sit amet consectetuer adipiscing elit',
        originalPrice: 'R$ 100,00',
        price: 'R$79,90',
        discount: '20% OFF',
        installment: '10x de R$ 7,90',
    },
    {
        image: '/src/assets/foto-carrossel.png',
        title: 'Lorem ipsum dolor sit amet consectetuer adipiscing elit',
        originalPrice: 'R$ 100,00',
        price: 'R$79,90',
        discount: '20% OFF',
        installment: '10x de R$ 7,90',
    },
    {
        image: '/src/assets/foto-carrossel.png',
        title: 'Lorem ipsum dolor sit amet consectetuer adipiscing elit',
        originalPrice: 'R$ 100,00',
        price: 'R$79,90',
        discount: '20% OFF',
        installment: '10x de R$ 7,90',
    },
]

// Departamentos e categorias
const menuData = [
    {
        departamento: "Informática",
        categorias: [
            { nome: "Notebooks", subcategorias: ["Gaming", "Ultrabooks", "Conversíveis"] },
            { nome: "Computadores", subcategorias: ["All-in-One", "Desktop", "Mini PC"] },
            { nome: "Periféricos", subcategorias: ["Mouse", "Teclado", "Headsets"] },
            { nome: "Monitores", subcategorias: ["Ultrawide", "Gamer", "Office"] },
            { nome: "Acessórios", subcategorias: ["Cabos", "Adaptadores", "Suportes"] }
        ]
    },
    {
        departamento: "Smartphone",
        categorias: [
            { nome: "Apple", subcategorias: ["iPhone 15", "iPhone 14", "iPhone SE"] },
            { nome: "Samsung", subcategorias: ["Galaxy S", "Galaxy A", "Galaxy Z"] },
            { nome: "Xiaomi", subcategorias: ["Redmi", "Poco", "Mi"] },
            { nome: "Motorola", subcategorias: ["Edge", "Moto G", "Razr"] }
        ]
    },
    {
        departamento: "Eletrodomésticos",
        categorias: [
            { nome: "Linha Branca", subcategorias: ["Geladeiras", "Fogões", "Lavadoras"] },
            { nome: "Ar e Ventilação", subcategorias: ["Ar Condicionado", "Ventiladores", "Aquecedores"] },
            { nome: "Eletroportáteis", subcategorias: ["Liquidificadores", "Cafeteiras", "Air Fryers"] }
        ]
    },
    {
        departamento: "Moda",
        categorias: [
            { nome: "Masculina", subcategorias: ["Camisetas", "Calças", "Calçados"] },
            { nome: "Feminina", subcategorias: ["Blusas", "Vestidos", "Calçados"] },
            { nome: "Infantil", subcategorias: ["Meninos", "Meninas", "Bebês"] },
            { nome: "Acessórios", subcategorias: ["Bolsas", "Bonés", "Relógios"] }
        ]
    },
    {
        departamento: "Casa e Decoração",
        categorias: [
            { nome: "Cozinha", subcategorias: ["Panelas", "Louças", "Utensílios"] },
            { nome: "Quarto", subcategorias: ["Roupa de Cama", "Travesseiros", "Organizadores"] },
            { nome: "Sala", subcategorias: ["Almofadas", "Cortinas", "Tapetes"] },
            { nome: "Banheiro", subcategorias: ["Toalhas", "Acessórios", "Organização"] }
        ]
    },
    {
        departamento: "Esportes",
        categorias: [
            { nome: "Fitness", subcategorias: ["Roupas", "Acessórios", "Equipamentos"] },
            { nome: "Futebol", subcategorias: ["Chuteiras", "Bolas", "Uniformes"] },
            { nome: "Natação", subcategorias: ["Óculos", "Touca", "Maiôs"] },
            { nome: "Ciclismo", subcategorias: ["Bicicletas", "Capacetes", "Acessórios"] }
        ]
    }
]

document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed')

    // -------------------- DROPDOWN MENU ----------------
    // Elementos DOM - Desktop
    const desktopMenuTrigger = document.getElementById('desktop-menu-trigger');
    const desktopMegaMenu = document.getElementById('desktop-megamenu');
    const desktopCategoriesList = document.getElementById('desktop-categories-list');
    const desktopSubcategoriesContainer = document.getElementById('desktop-subcategories-container');
    const desktopMegaMenuContainer = document.getElementById('desktop-megamenu-container');

    // Elementos DOM - Mobile
    const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
    const mobileMegaMenu = document.getElementById('mobile-megamenu');
    const mobileCategoriesList = document.getElementById('mobile-categories-list');
    const mobileSubcategoriesContainer = document.getElementById('mobile-subcategories-container');
    const mobileSubcategoriesWrapper = document.getElementById('mobile-subcategories-wrapper');
    const mobileMegaMenuContainer = document.getElementById('mobile-megamenu-container');

    let activeDesktopDepartment = null;
    let activeMobileDepartment = null;

    // Popula as listas de departamentos
    function populateDepartments() {
        // Desktop
        desktopCategoriesList.innerHTML = '';
        menuData.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'py-2 px-3 cursor-pointer hover:bg-blue-50 hover:text-[#005CFF] rounded-md transition-colors';
            li.setAttribute('data-index', index);
            li.textContent = item.departamento;

            li.addEventListener('click', (e) => {
                // Remove active class from all items
                desktopCategoriesList.querySelectorAll('li').forEach(item => {
                    item.classList.remove('bg-blue-100', 'text-[#005CFF]', 'font-semibold');
                });

                // Add active class to clicked item
                li.classList.add('bg-blue-100', 'text-[#005CFF]', 'font-semibold');

                // Show subcategories for this department
                const departmentIndex = parseInt(li.getAttribute('data-index'));
                activeDesktopDepartment = departmentIndex;
                showDesktopSubcategories(departmentIndex);

                e.stopPropagation();
            });
            desktopCategoriesList.appendChild(li);
        });

        // Mobile
        mobileCategoriesList.innerHTML = '';
        menuData.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'py-2 px-3 cursor-pointer hover:bg-blue-50 hover:text-[#005CFF] rounded-md transition-colors';
            li.setAttribute('data-index', index);
            li.textContent = item.departamento;
            li.addEventListener('click', (e) => {
                // Remove active class from all items
                mobileCategoriesList.querySelectorAll('li').forEach(item => {
                    item.classList.remove('bg-blue-100', 'text-[#005CFF]', 'font-semibold');
                });

                // Add active class to clicked item
                li.classList.add('bg-blue-100', 'text-[#005CFF]', 'font-semibold');

                // Show subcategories for this department
                const departmentIndex = parseInt(li.getAttribute('data-index'));
                activeMobileDepartment = departmentIndex;
                showMobileSubcategories(departmentIndex);

                e.stopPropagation();
            });
            mobileCategoriesList.appendChild(li);
        });
    }

    // Exibe subcategorias no desktop
    function showDesktopSubcategories(departmentIndex) {
        const department = menuData[departmentIndex];
        desktopSubcategoriesContainer.innerHTML = '';

        department.categorias.forEach(categoria => {
            const categoriaDiv = document.createElement('div');
            categoriaDiv.className = 'flex flex-col gap-2';

            const categoryTitle = document.createElement('h3');
            categoryTitle.className = 'font-bold text-[#005CFF] mb-2';
            categoryTitle.textContent = categoria.nome;
            categoriaDiv.appendChild(categoryTitle);

            const subcategoriesList = document.createElement('ul');
            subcategoriesList.className = 'flex flex-col gap-1';

            categoria.subcategorias.forEach(subcategoria => {
                const subcategoriaItem = document.createElement('li');
                subcategoriaItem.className = 'text-sm hover:text-[#005CFF] cursor-pointer';
                subcategoriaItem.textContent = subcategoria;
                subcategoriesList.appendChild(subcategoriaItem);
            });

            categoriaDiv.appendChild(subcategoriesList);
            desktopSubcategoriesContainer.appendChild(categoriaDiv);
        });
    }

    // Exibe subcategorias no mobile
    function showMobileSubcategories(departmentIndex) {
        const department = menuData[departmentIndex];
        mobileSubcategoriesContainer.innerHTML = '';

        // Botão de voltar
        const backButton = document.createElement('button');
        backButton.className = 'flex items-center gap-2 text-sm font-semibold text-gray-600 mb-4';
        backButton.innerHTML = `
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
             </svg>
             Voltar para Departamentos
         `;
        backButton.addEventListener('click', () => {
            mobileSubcategoriesWrapper.classList.add('hidden');
            mobileCategoriesList.parentElement.classList.remove('hidden');
        });
        mobileSubcategoriesContainer.appendChild(backButton);

        department.categorias.forEach(categoria => {
            const categoriaDiv = document.createElement('div');
            categoriaDiv.className = 'flex flex-col gap-2 mb-6';

            const categoryTitle = document.createElement('h3');
            categoryTitle.className = 'font-bold text-[#005CFF] mb-2';
            categoryTitle.textContent = categoria.nome;
            categoriaDiv.appendChild(categoryTitle);

            const subcategoriesList = document.createElement('ul');
            subcategoriesList.className = 'flex flex-col gap-1';

            categoria.subcategorias.forEach(subcategoria => {
                const subcategoriaItem = document.createElement('li');
                subcategoriaItem.className = 'text-sm hover:text-[#005CFF] cursor-pointer';
                subcategoriaItem.textContent = subcategoria;
                subcategoriesList.appendChild(subcategoriaItem);
            });

            categoriaDiv.appendChild(subcategoriesList);
            mobileSubcategoriesContainer.appendChild(categoriaDiv);
        });

        mobileCategoriesList.parentElement.classList.add('hidden');
        mobileSubcategoriesWrapper.classList.remove('hidden');
    }

    // Event listener para o menu trigger - Desktop
    desktopMenuTrigger.addEventListener('click', function (e) {
        desktopMegaMenu.classList.toggle('hidden');

        // Por padrão o primeiro departamento está selecionado
        if (!activeDesktopDepartment && desktopCategoriesList.children.length > 0) {
            const firstDepartment = desktopCategoriesList.children[0];
            firstDepartment.classList.add('bg-blue-100', 'text-[#005CFF]', 'font-semibold');
            activeDesktopDepartment = 0;
            showDesktopSubcategories(0);
        }

        e.stopPropagation();
    });

    // Event listener para o menu trigger - Mobile
    mobileMenuTrigger.addEventListener('click', function (e) {
        mobileMegaMenu.classList.toggle('hidden');

        // Reset mobile view to show departments when opening
        mobileSubcategoriesWrapper.classList.add('hidden');
        mobileCategoriesList.parentElement.classList.remove('hidden');

        e.stopPropagation();
    });

    // Fechar o menu ao clicar fora - Desktop
    document.addEventListener('click', function (e) {
        if (desktopMegaMenu && !desktopMegaMenuContainer.contains(e.target)) {
            desktopMegaMenu.classList.add('hidden');
        }
    });

    // Fechar o menu ao clicar fora - Mobile
    document.addEventListener('click', function (e) {
        if (mobileMegaMenu && !mobileMegaMenuContainer.contains(e.target)) {
            mobileMegaMenu.classList.add('hidden');
        }
    });

    // Inicialização
    populateDepartments();

    // -------------------- BUSCA --------------------

    function handleSearch(inputId) {
        const searchInput = document.getElementById(inputId);
        const searchTerm = searchInput.value.trim();
        const searchResult = document.getElementById('search-result');

        if (searchTerm) {
            searchResult.textContent = `Você buscou por: '${searchTerm}'`;
            searchResult.classList.remove('hidden'); // Mostra o resultado
        } else {
            searchResult.textContent = 'Por favor, digite algo para buscar';
            searchResult.classList.remove('hidden'); // Mostra a mensagem de erro
        }
    }

    document.getElementById('search-button-mobile').addEventListener('click', () => handleSearch('search-input-mobile'));
    document.getElementById('search-button-desktop').addEventListener('click', () => handleSearch('search-input-desktop'));

    document.getElementById('search-input-mobile').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch('search-input-mobile');
    });
    document.getElementById('search-input-desktop').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch('search-input-desktop');
    });

    // Fecha o resultado se houver clique no site
    document.addEventListener('click', function (event) {
        const searchResult = document.getElementById('search-result');
        const isSearchBar = event.target.closest('#search-input-mobile, #search-input-desktop, #search-button-mobile, #search-button-desktop');

        if (!isSearchBar && !searchResult.classList.contains('hidden')) {
            searchResult.classList.add('hidden');
        }
    });

    document.getElementById('search-result').addEventListener('click', function (event) {
        event.stopPropagation();
    });
    // -------------------- CARROSSEL --------------------

    // Pega o template do card
    const template = document.getElementById('product-card')

    // Seleciona todos os carrosséis na página
    const allSwipers = document.querySelectorAll('.swiper')

    // Popula os carrosséis com os cards
    allSwipers.forEach((swiperContainer) => {
        const swiperWrapper = swiperContainer.querySelector('.swiper-wrapper')

        products.forEach((product) => {
            const cardContent = document.importNode(template.content, true)
            const cardElement = cardContent.firstElementChild
            cardElement.classList.add('swiper-slide')

            // Preencher os dados
            cardElement.querySelector('.product-img').src = product.image
            cardElement.querySelector('.product-title').textContent =
                product.title
            cardElement.querySelector('.product-original-price').textContent =
                product.originalPrice
            cardElement.querySelector('.product-price').textContent =
                product.price
            cardElement.querySelector('.product-discount').textContent =
                product.discount
            cardElement.querySelector('.product-installment').textContent =
                product.installment

            swiperWrapper.appendChild(cardElement)
        })

        // Inicializa o Swiper individualmente
        new Swiper(swiperContainer, {
            modules: [Navigation, Pagination, Autoplay],
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: swiperContainer.querySelector(
                    '.custom-swiper-button-next',
                ),
                prevEl: swiperContainer.querySelector(
                    '.custom-swiper-button-prev',
                ),
            },
            pagination: {
                el: swiperContainer.querySelector('.swiper-pagination'),
                clickable: true,
            },
            slidesPerView: 'auto',
            spaceBetween: 16,
        })
    })

    // -------------------- DROPDOWN FOOTER -----------------

    // Seleciona todos os cabeçalhos de dropdown
    const dropdownHeaders = document.querySelectorAll('.dropdown-header')

    dropdownHeaders.forEach((header) => {
        header.addEventListener('click', function () {
            // Encontra o elemento de conteúdo do dropdown
            const content = this.nextElementSibling

            const arrow = this.querySelector('.dropdown-arrow')

            const isOpen = content.classList.contains('active')

            closeAllDropdowns()

            // Se estiver fechado, abre o dropdown
            if (!isOpen) {
                content.classList.add('active')

                content.style.maxHeight = content.scrollHeight + 'px'

                arrow.style.transform = 'rotate(180deg)'
            }
        })
    })

    // Função para fechar todos os dropdowns
    function closeAllDropdowns() {
        const allContents = document.querySelectorAll('.dropdown-content')
        const allArrows = document.querySelectorAll('.dropdown-arrow')

        allContents.forEach((content) => {
            content.classList.remove('active')
            content.style.maxHeight = '0'
        })

        allArrows.forEach((arrow) => {
            arrow.style.transform = 'rotate(0)'
        })
    }
})
