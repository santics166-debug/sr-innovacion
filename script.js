/* =====================================================
   SR INNOVACION - SCRIPT PUBLICO
   Productos y trabajos cargados desde Cloudflare
===================================================== */

const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');

if (menuBtn) menuBtn.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    if (menu) menu.classList.remove('open');
    if (menuBtn) menuBtn.setAttribute('aria-expanded', 'false');
  });
});

const WHATSAPP = 'https://wa.me/543454958446?text=';

function escapar(texto) {
  return String(texto || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function whatsappProducto(nombre) {
  return WHATSAPP + encodeURIComponent(
    `Hola SR INNOVACION, quiero consultar por el producto ${nombre}.`
  );
}

/* ================= PRODUCTOS ================= */

const productTrack = document.querySelector('.product-track');
const productViewport = document.querySelector('.product-viewport');
const productPrev = document.querySelector('.product-prev');
const productNext = document.querySelector('.product-next');
const productDots = document.querySelector('.product-dots');

let productPage = 0;
let productosPublicos = [];

function productVisible() {
  if (window.innerWidth <= 650) return 1;
  if (window.innerWidth <= 900) return 2;
  return 3;
}

function productPages() {
  return Math.max(1, Math.ceil(
    productosPublicos.length / productVisible()
  ));
}

function renderProductos() {
  if (!productTrack) return;

  let productSearch = document.querySelector('#productSearch');

  if (!productSearch && productViewport) {
    const searchWrap = document.createElement('div');
    searchWrap.className = 'product-search-wrap';
    searchWrap.innerHTML = `
      <div class="product-search">
        <span class="product-search-icon">🔍</span>
        <input id="productSearch" type="search"
          placeholder="Buscar producto..."
          aria-label="Buscar producto"
          autocomplete="off">
      </div>
    `;

    const productsCarousel = productViewport.parentElement;
    const sectionHeading = productsCarousel && productsCarousel.parentElement ? productsCarousel.parentElement.querySelector('.section-heading') : null;

    if (sectionHeading) {
      sectionHeading.insertAdjacentElement('afterend', searchWrap);
    } else if (productsCarousel && productsCarousel.parentElement) {
      productsCarousel.parentElement.insertBefore(searchWrap, productsCarousel);
    }
    productSearch = searchWrap.querySelector('#productSearch');

    productSearch.addEventListener('input', () => {
      const termino = productSearch.value.trim().toLowerCase();

      const filtrados = !termino
        ? productosPublicos
        : productosPublicos.filter(producto => {
            const texto = [
              producto.nombre || '',
              producto.caracteristicas || '',
              producto.precio || ''
            ].join(' ').toLowerCase();

            return texto.includes(termino);
          });

      renderProductosLista(filtrados, Boolean(termino));
    });

    const style = document.createElement('style');
    style.textContent = `
      .product-search-wrap { width:100%; margin:0 auto 18px; }
      .product-search { position:relative; width:min(100%,520px); margin:0 auto; }
      .product-search input {
        width:100%; height:46px; padding:0 16px 0 44px;
        border:1px solid #d8dee8; border-radius:24px;
        background:#fff; color:#172033; font-size:15px;
        outline:none; box-shadow:0 3px 12px rgba(0,0,0,.06);
      }
      .product-search input:focus {
        border-color:#1265c5;
        box-shadow:0 3px 14px rgba(18,101,197,.14);
      }
      .product-search-icon {
        position:absolute; left:16px; top:50%;
        transform:translateY(-50%); font-size:17px;
        pointer-events:none;
      }
      .products-carousel.search-mode .product-track {
        transform: none !important;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 18px;
      }
      .products-carousel.search-mode .product-track .product-card {
        flex: initial;
        width: auto;
        margin-right: 0;
      }
      @media (max-width: 900px) {
        .products-carousel.search-mode .product-track { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      }
      @media (max-width: 650px) {
        .products-carousel.search-mode .product-track { grid-template-columns: 1fr; }
      }
      .products-carousel.search-mode .product-arrow,
      .products-carousel.search-mode .product-dots { display: none; }
    `;
    document.head.appendChild(style);
  }

  renderProductosLista(productosPublicos, false);
}

function renderProductosLista(listaProductos, filtrando = false) {
  if (!productTrack) return;

  const productsCarousel = productTrack.closest('.products-carousel');
  if (productsCarousel) productsCarousel.classList.toggle('search-mode', filtrando);

  if (!listaProductos.length) {
    productTrack.innerHTML =
      '<p style="padding:30px;text-align:center;width:100%;">No se encontraron productos.</p>';
    if (productDots) productDots.innerHTML = '';
    if (productPrev) productPrev.disabled = true;
    if (productNext) productNext.disabled = true;
    return;
  }

  const productosParaRenderizar = listaProductos;

  if (!productosPublicos.length) {
    productTrack.innerHTML =
      '<p style="padding:30px;text-align:center;">No hay productos disponibles.</p>';
    return;
  }

  productTrack.innerHTML = productosParaRenderizar.map(producto => {
    const nombre = escapar(producto.nombre);
    const precio = producto.precio ? escapar(producto.precio) : 'Consultar';

    const caracteristicas = String(producto.caracteristicas || '')
      .split(/\r?\n|,/)
      .map(item => item.trim())
      .filter(Boolean);

    const listaCaracteristicas = caracteristicas.length
      ? '<ul class="product-features">' +
        caracteristicas.map(item => `<li>${escapar(item)}</li>`).join('') +
        '</ul>'
      : '';

    const imagen = producto.imagen
      ? new URL(producto.imagen, window.location.origin).href
      : '';

    return `
      <article class="product-card product-item">
        <div class="product-image-wrap">
          ${
            imagen
              ? `<img class="product-image" src="${escapar(imagen)}" alt="${nombre}">`
              : `<div class="product-image" style="display:grid;place-items:center;color:#687382;background:#eef2f6;">Sin imagen</div>`
          }
        </div>

        <div class="product-info">
          <span class="product-tag">ACCESORIOS ELECTRÓNICOS</span>
          <h3>${nombre}</h3>
          ${listaCaracteristicas}

          <div style="font-size:18px;font-weight:800;color:#1265c5;margin:8px 0 14px;">
            ${precio}
          </div>

          <a class="btn btn-whatsapp product-whatsapp"
             href="${whatsappProducto(String(producto.nombre || ''))}"
             target="_blank" rel="noopener">
            🟢 Consultar por WhatsApp
          </a>
        </div>
      </article>
    `;
  }).join('');

  productPage = 0;

  const listaOriginal = productosPublicos;
  productosPublicos = productosParaRenderizar;
  renderProductDots();
  updateProductCarousel();
  productosPublicos = listaOriginal;
}

function renderProductDots() {
  if (!productDots) return;

  productDots.innerHTML = '';
  const paginas = productPages();

  for (let i = 0; i < paginas; i++) {
    const dot = document.createElement('button');

    dot.className = 'product-dot' + (i === productPage ? ' active' : '');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Mostrar página ${i + 1} de productos`);

    dot.addEventListener('click', () => {
      productPage = i;
      updateProductCarousel();
    });

    productDots.appendChild(dot);
  }
}

function updateProductCarousel() {
  if (!productTrack || !productViewport) return;

  const buscador = document.querySelector('#productSearch');
  if (buscador && buscador.value.trim()) {
    productTrack.style.transform = 'translateX(0)';
    if (productPrev) productPrev.disabled = true;
    if (productNext) productNext.disabled = true;
    return;
  }

  const visible = productVisible();
  const paginas = productPages();

  productPage = Math.min(productPage, paginas - 1);

  const step = productViewport.clientWidth / visible;

  productTrack.style.transform =
    `translateX(-${productPage * step * visible}px)`;

  if (productPrev) productPrev.disabled = productPage === 0;
  if (productNext) productNext.disabled = productPage === paginas - 1;

  renderProductDots();
}

if (productPrev) productPrev.addEventListener('click', () => {
  if (productPage > 0) {
    productPage--;
    updateProductCarousel();
  }
});

if (productNext) productNext.addEventListener('click', () => {
  if (productPage < productPages() - 1) {
    productPage++;
    updateProductCarousel();
  }
});

window.addEventListener('resize', updateProductCarousel);

async function cargarProductosPublicos() {
  try {
    const respuesta = await fetch('/api/productos', { cache: 'no-store' });

    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar los productos');
    }

    const datos = await respuesta.json();
    productosPublicos = Array.isArray(datos) ? datos : [];

    renderProductos();
  } catch (error) {
    console.error('Error productos:', error);
  }
}

/* ================= TRABAJOS ================= */

const categoriasTrabajo = {
  'Cortadoras de fiambre': {
    clase: 'cortadoras',
    numero: '1',
    descripcion: 'Mantenimiento, reparación y puesta a punto'
  },
  'Balanzas electrónicas': {
    clase: 'balanzas',
    numero: '2',
    descripcion: 'Reparación, mantenimiento y calibración'
  },
  'Máquinas gastronómicas': {
    clase: 'gastronomicas',
    numero: '3',
    descripcion: 'Mantenimiento, reparación y reemplazo de componentes'
  }
};

function obtenerCategoriaTrabajo(nombre) {
  if (categoriasTrabajo[nombre]) return categoriasTrabajo[nombre];

  return {
    clase: String(nombre || 'otros')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-'),
    numero: '',
    descripcion: 'Trabajos realizados por SR INNOVACION'
  };
}

/* ================= MODAL ================= */

let photoModal = document.querySelector('#photoModal');
let photoModalImg = document.querySelector('#photoModalImg');
let photoModalCaption = document.querySelector('#photoModalCaption');
let photoModalPhotos = [];
let photoModalIndex = 0;

function prepararFlechasModal() {
  if (!photoModal || !photoModal.querySelector('.photo-modal-content')) return;

  const content = photoModal.querySelector('.photo-modal-content');
  if (photoModal.querySelector('.photo-modal-prev')) return;

  const prev = document.createElement('button');
  prev.className = 'photo-modal-nav photo-modal-prev';
  prev.type = 'button';
  prev.setAttribute('aria-label', 'Imagen anterior');
  prev.innerHTML = '&#10094;';

  const next = document.createElement('button');
  next.className = 'photo-modal-nav photo-modal-next';
  next.type = 'button';
  next.setAttribute('aria-label', 'Imagen siguiente');
  next.innerHTML = '&#10095;';

  photoModal.appendChild(prev);
  photoModal.appendChild(next);

  const style = document.createElement('style');
  style.textContent = `
    .photo-modal-nav{position:absolute;top:50%;transform:translateY(-50%);width:52px;height:52px;border:1px solid rgba(255,255,255,.35);border-radius:50%;background:rgba(8,13,19,.72);color:#fff;font-size:34px;line-height:1;display:grid;place-items:center;cursor:pointer;z-index:3;transition:.2s;backdrop-filter:blur(5px)}
    .photo-modal-nav:hover{background:rgba(8,120,232,.9);transform:translateY(-50%) scale(1.05)}
    .photo-modal-prev{left:24px}.photo-modal-next{right:24px}
    .photo-modal-nav:disabled{opacity:.28;cursor:default;transform:translateY(-50%)}
    @media(max-width:650px){.photo-modal{padding:18px}.photo-modal-nav{width:44px;height:44px;font-size:28px}.photo-modal-prev{left:10px}.photo-modal-next{right:10px}.photo-modal-content{width:calc(100vw - 70px)}.photo-modal img{max-height:70vh}}
  `;
  document.head.appendChild(style);

  prev.addEventListener('click', e => {
    e.stopPropagation();
    cambiarFotoModal(-1);
  });
  next.addEventListener('click', e => {
    e.stopPropagation();
    cambiarFotoModal(1);
  });
}

function actualizarModalFoto() {
  if (!photoModalPhotos.length) return;

  const btn = photoModalPhotos[photoModalIndex];
  const imagen = btn.dataset.full || '';
  const descripcion = btn.dataset.caption || '';

  photoModalImg.src = imagen;
  photoModalImg.alt = descripcion || 'Trabajo SR INNOVACION';
  photoModalCaption.textContent = descripcion;

  const prev = photoModal.querySelector('.photo-modal-prev');
  const next = photoModal.querySelector('.photo-modal-next');
  if (prev) prev.disabled = photoModalIndex === 0;
  if (next) next.disabled = photoModalIndex === photoModalPhotos.length - 1;
}

function cambiarFotoModal(direccion) {
  if (!photoModalPhotos.length) return;
  const nuevoIndice = photoModalIndex + direccion;
  if (nuevoIndice < 0 || nuevoIndice >= photoModalPhotos.length) return;
  photoModalIndex = nuevoIndice;
  actualizarModalFoto();
}

function cerrarModalFoto() {
  if (photoModal) photoModal.classList.remove('open');
  if (photoModal) photoModal.setAttribute('aria-hidden', 'true');
}

function abrirModalFoto(imagen, descripcion, fotosRelacionadas, indiceActual) {
  if (!photoModal) return;

  prepararFlechasModal();
  photoModalPhotos = Array.isArray(fotosRelacionadas) ? fotosRelacionadas : [];
  photoModalIndex = typeof indiceActual === 'number' ? indiceActual : 0;

  if (!photoModalPhotos.length) {
    photoModalImg.src = imagen;
    photoModalImg.alt = descripcion || 'Trabajo SR INNOVACION';
    photoModalCaption.textContent = descripcion || '';
  } else {
    actualizarModalFoto();
  }

  photoModal.classList.add('open');
  photoModal.setAttribute('aria-hidden', 'false');
}

const photoModalClose = document.querySelector('.photo-modal-close');
if (photoModalClose) photoModalClose.addEventListener(
  'click', cerrarModalFoto
);

if (photoModal) photoModal.addEventListener('click', e => {
  if (e.target === photoModal) cerrarModalFoto();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') cerrarModalFoto();
  if (!photoModal || !photoModal.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') cambiarFotoModal(-1);
  if (e.key === 'ArrowRight') cambiarFotoModal(1);
});

/* ================= CARGAR TRABAJOS ================= */

async function cargarTrabajosPublicos() {
  try {
    const respuesta = await fetch('/api/trabajos', { cache: 'no-store' });

    if (!respuesta.ok) {
      throw new Error('No se pudieron cargar los trabajos');
    }

    const trabajos = await respuesta.json();

    renderTrabajos(Array.isArray(trabajos) ? trabajos : []);
  } catch (error) {
    console.error('Error trabajos:', error);
  }
}

function renderTrabajos(trabajos) {
  const contenedor = document.querySelector('.work-categories');
  if (!contenedor) return;

  const grupos = {};

  trabajos.forEach(trabajo => {
    const categoria = trabajo.categoria || 'Otros';

    if (!grupos[categoria]) grupos[categoria] = [];
    grupos[categoria].push(trabajo);
  });

  const ordenCategorias = [
    'Cortadoras de fiambre',
    'Balanzas electrónicas',
    'Máquinas gastronómicas'
  ];

  const categoriasFinales = ordenCategorias.filter(categoria => grupos[categoria]);

  Object.keys(grupos).forEach(categoria => {
    if (!categoriasFinales.includes(categoria)) {
      categoriasFinales.push(categoria);
    }
  });

  if (!categoriasFinales.length) {
    contenedor.innerHTML =
      '<p style="text-align:center;padding:30px;color:#687382;">Todavía no hay trabajos publicados.</p>';
    return;
  }

  contenedor.innerHTML = categoriasFinales.map(categoria => {
    const config = obtenerCategoriaTrabajo(categoria);
    const lista = grupos[categoria] || [];

    return `
      <article class="work-category" data-category="${escapar(config.clase)}">
        <button class="work-category-toggle" type="button" aria-expanded="false">
          <span class="work-category-icon">${escapar(config.numero)}</span>

          <span class="work-category-info">
            <strong>${escapar(categoria)}</strong>
            <small>${escapar(config.descripcion)}</small>
          </span>

          <span class="work-category-count">
            ${lista.length} trabajo${lista.length === 1 ? '' : 's'}
            <b>+</b>
          </span>
        </button>

        <div class="work-gallery-wrap" hidden>
          ${
            lista.map(trabajo => {
              const fotos = Array.isArray(trabajo.imagenes)
                ? trabajo.imagenes
                : [];

              return `
                <div class="work-job">
                  <div class="work-job-heading">
                    <strong>${escapar(trabajo.nombre)}</strong>
                    <span>${fotos.length} foto${fotos.length === 1 ? '' : 's'}</span>
                  </div>

                  ${
                    trabajo.descripcion
                      ? `<div style="color:#687382;font-size:13px;margin-bottom:12px;">
                           ${escapar(trabajo.descripcion)}
                         </div>`
                      : ''
                  }

                  <div class="work-gallery">
                    ${
                      fotos.map((imagen, indice) => {
                        const totalFotos = fotos.length;
                        let etapa = 'PROCESO';

                        if (totalFotos === 1) {
                          etapa = 'ANTES';
                        } else if (indice === 0) {
                          etapa = 'ANTES';
                        } else if (indice === totalFotos - 1) {
                          etapa = 'DESPUÉS';
                        }

                        const caption =
                          `${categoria} · ${trabajo.nombre} · ${etapa} (${indice + 1}/${totalFotos})`;

                        return `
                          <button class="work-photo"
                                  type="button"
                                  data-full="${escapar(imagen)}"
                                  data-caption="${escapar(caption)}">
                            <img src="${escapar(imagen)}"
                                 alt="${escapar(caption)}"
                                 loading="lazy">
                            <span>${etapa}</span>
                          </button>
                        `;
                      }).join('')
                    }
                  </div>
                </div>
              `;
            }).join('')
          }
        </div>
      </article>
    `;
  }).join('');

  activarGalerias();
  activarFotos();
}

function activarGalerias() {
  document.querySelectorAll('.work-category-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.closest('.work-category');
      const panel = category ? category.querySelector('.work-gallery-wrap') : null;

      if (!category || !panel) return;

      const willOpen = panel.hidden;

      document.querySelectorAll('.work-category').forEach(item => {
        const otherBtn = item.querySelector('.work-category-toggle');
        const otherPanel = item.querySelector('.work-gallery-wrap');

        if (item !== category) {
          item.classList.remove('open');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.hidden = true;
        }
      });

      category.classList.toggle('open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
      panel.hidden = !willOpen;

      if (willOpen) {
        setTimeout(() => {
          category.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }, 40);
      }
    });
  });
}

function activarFotos() {
  document.querySelectorAll('.work-photo').forEach(btn => {
    btn.addEventListener('click', () => {
      const galeria = btn.closest('.work-gallery');
      const fotosRelacionadas = galeria
        ? Array.from(galeria.querySelectorAll('.work-photo'))
        : [btn];
      const indiceActual = fotosRelacionadas.indexOf(btn);

      abrirModalFoto(
        btn.dataset.full,
        btn.dataset.caption,
        fotosRelacionadas,
        indiceActual >= 0 ? indiceActual : 0
      );
    });
  });
}

/* ================= INICIO ================= */

cargarProductosPublicos();
cargarTrabajosPublicos();