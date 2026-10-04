/* =====================================================
   SR INNOVACION - SCRIPT PUBLICO ESTABLE
   Productos y trabajos desde Cloudflare D1 / R2
   Galeria: ANTES / PROCESO / DESPUES + flechas laterales
===================================================== */

(function () {
  'use strict';

  var WHATSAPP = 'https://wa.me/543454958446?text=';
  var productosPublicos = [];
  var productPage = 0;
  var fotoActual = 0;
  var fotosModal = [];
  var captionBase = '';

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $$(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function escapar(texto) {
    return String(texto == null ? '' : texto)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function imagenURL(valor) {
    if (!valor) return '';
    try {
      return new URL(String(valor), window.location.origin).href;
    } catch (_) {
      return String(valor);
    }
  }

  function whatsappProducto(nombre) {
    return WHATSAPP + encodeURIComponent(
      'Hola SR INNOVACION, quiero consultar por el producto ' + nombre + '.'
    );
  }

  /* ================= MENU ================= */

  function activarMenu() {
    var menuBtn = $('.menu-btn');
    var menu = $('.menu');
    if (!menuBtn || !menu) return;

    menuBtn.addEventListener('click', function () {
      var abierto = menu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(abierto));
    });

    $$('.menu a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ================= PRODUCTOS ================= */

  function productVisible() {
    if (window.innerWidth <= 650) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function productPages() {
    return Math.max(1, Math.ceil(productosPublicos.length / productVisible()));
  }

  function instalarEstilosProductos() {
    if ($('#sr-product-stable-css')) return;
    var style = document.createElement('style');
    style.id = 'sr-product-stable-css';
    style.textContent = [
      '.products-carousel{position:relative;display:flex;align-items:center;gap:10px}',
      '.product-viewport{overflow:hidden;flex:1;min-width:0}',
      '.product-track{display:flex;transition:transform .35s ease;will-change:transform}',
      '.product-track .product-card{flex:0 0 calc((100% - 36px)/3);margin-right:18px;box-sizing:border-box}',
      '.product-track .product-card:last-child{margin-right:0}',
      '.product-arrow{flex:0 0 44px;width:44px;height:44px;border:0;border-radius:50%;background:#1265c5;color:#fff;font-size:32px;line-height:1;cursor:pointer;box-shadow:0 8px 18px rgba(20,34,55,.15);display:grid;place-items:center;z-index:2}',
      '.product-arrow:disabled{opacity:.35;cursor:default}',
      '.product-dots{display:flex;justify-content:center;gap:7px;margin-top:18px}',
      '.product-dot{width:8px;height:8px;padding:0;border:0;border-radius:50%;background:#c7d1dc;cursor:pointer}',
      '.product-dot.active{background:#1265c5;transform:scale(1.25)}',
      '.product-search-wrap{width:100%;margin:0 auto 18px}',
      '.product-search{position:relative;width:min(100%,520px);margin:0 auto}',
      '.product-search input{width:100%;height:46px;padding:0 16px 0 44px;border:1px solid #d8dee8;border-radius:24px;background:#fff;color:#172033;font-size:15px;outline:none;box-shadow:0 3px 12px rgba(0,0,0,.06)}',
      '.product-search-icon{position:absolute;left:16px;top:50%;transform:translateY(-50%);font-size:17px;pointer-events:none}',
      '.products-carousel.search-mode .product-track{transform:none!important;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}',
      '.products-carousel.search-mode .product-track .product-card{flex:initial;width:auto;margin-right:0}',
      '.products-carousel.search-mode .product-arrow,.products-carousel.search-mode .product-dots{display:none}',
      '@media(max-width:900px){.product-track .product-card{flex-basis:calc((100% - 18px)/2)}.products-carousel.search-mode .product-track{grid-template-columns:repeat(2,minmax(0,1fr))}}',
      '@media(max-width:650px){.products-carousel{gap:6px}.product-track .product-card{flex-basis:100%;margin-right:0}.product-arrow{flex-basis:38px;width:38px;height:38px;font-size:28px}.products-carousel.search-mode .product-track{grid-template-columns:1fr}}'
    ].join('');
    document.head.appendChild(style);
  }

  function getProductElements() {
    return {
      track: $('.product-track'),
      viewport: $('.product-viewport'),
      prev: $('.product-prev'),
      next: $('.product-next'),
      dots: $('.product-dots')
    };
  }

  function renderProductDots() {
    var el = getProductElements();
    if (!el.dots) return;
    el.dots.innerHTML = '';
    var pages = productPages();
    for (var i = 0; i < pages; i++) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'product-dot' + (i === productPage ? ' active' : '');
      dot.setAttribute('aria-label', 'Mostrar página ' + (i + 1) + ' de productos');
      (function (page) {
        dot.addEventListener('click', function () {
          productPage = page;
          updateProductCarousel();
        });
      })(i);
      el.dots.appendChild(dot);
    }
  }

  function updateProductCarousel() {
    var el = getProductElements();
    if (!el.track || !el.viewport) return;

    var search = $('#productSearch');
    if (search && search.value.trim()) return;

    var pages = productPages();
    productPage = Math.max(0, Math.min(productPage, pages - 1));

    var visible = productVisible();
    var move = visible === 1 ? el.viewport.clientWidth : el.viewport.clientWidth + 18;
    el.track.style.transform = 'translateX(-' + (productPage * move) + 'px)';

    if (el.prev) el.prev.disabled = productPage === 0;
    if (el.next) el.next.disabled = productPage >= pages - 1;
    renderProductDots();
  }

  function renderProductosLista(lista, filtrando) {
    var el = getProductElements();
    if (!el.track) return;

    var carousel = el.track.closest('.products-carousel');
    if (carousel) carousel.classList.toggle('search-mode', !!filtrando);

    if (!lista.length) {
      el.track.innerHTML = '<p style="padding:30px;text-align:center;width:100%;">No se encontraron productos.</p>';
      if (el.dots) el.dots.innerHTML = '';
      if (el.prev) el.prev.disabled = true;
      if (el.next) el.next.disabled = true;
      return;
    }

    el.track.innerHTML = lista.map(function (producto) {
      var nombre = escapar(producto.nombre);
      var precio = producto.precio ? escapar(producto.precio) : 'Consultar';
      var caracteristicas = String(producto.caracteristicas || '')
        .split(/\r?\n|,/)
        .map(function (x) { return x.trim(); })
        .filter(Boolean);
      var listaCaracteristicas = caracteristicas.length
        ? '<ul class="product-features">' + caracteristicas.map(function (x) { return '<li>' + escapar(x) + '</li>'; }).join('') + '</ul>'
        : '';
      var imagen = imagenURL(producto.imagen);

      return '<article class="product-card product-item">' +
        '<div class="product-image-wrap">' +
          (imagen ? '<img class="product-image" src="' + escapar(imagen) + '" alt="' + nombre + '" loading="lazy">' : '<div class="product-image" style="display:grid;place-items:center;color:#687382;background:#eef2f6;">Sin imagen</div>') +
        '</div>' +
        '<div class="product-info">' +
          '<span class="product-tag">ACCESORIOS ELECTRÓNICOS</span>' +
          '<h3>' + nombre + '</h3>' +
          listaCaracteristicas +
          '<div style="font-size:18px;font-weight:800;color:#1265c5;margin:8px 0 14px;">' + precio + '</div>' +
          '<a class="btn btn-whatsapp product-whatsapp" href="' + whatsappProducto(String(producto.nombre || '')) + '" target="_blank" rel="noopener">🟢 Consultar por WhatsApp</a>' +
        '</div>' +
      '</article>';
    }).join('');

    productPage = 0;
    if (!filtrando) updateProductCarousel();
  }

  function activarBuscadorProductos() {
    var el = getProductElements();
    if (!el.track || !el.viewport) return;
    instalarEstilosProductos();

    var search = $('#productSearch');
    if (!search) {
      var wrap = document.createElement('div');
      wrap.className = 'product-search-wrap';
      wrap.innerHTML = '<div class="product-search"><span class="product-search-icon">🔍</span><input id="productSearch" type="search" placeholder="Buscar producto..." aria-label="Buscar producto" autocomplete="off"></div>';
      var carousel = el.track.closest('.products-carousel');
      var heading = carousel && carousel.parentElement ? $('.section-heading', carousel.parentElement) : null;
      if (heading) heading.insertAdjacentElement('afterend', wrap);
      else if (carousel && carousel.parentElement) carousel.parentElement.insertBefore(wrap, carousel);
      search = $('#productSearch');
    }

    if (!search || search.dataset.bound === '1') return;
    search.dataset.bound = '1';
    search.addEventListener('input', function () {
      var term = search.value.trim().toLowerCase();
      var filtrados = !term ? productosPublicos : productosPublicos.filter(function (p) {
        return [p.nombre || '', p.caracteristicas || '', p.precio || ''].join(' ').toLowerCase().indexOf(term) !== -1;
      });
      renderProductosLista(filtrados, !!term);
    });
  }

  function activarFlechasProductos() {
    var el = getProductElements();
    if (el.prev && el.prev.dataset.bound !== '1') {
      el.prev.dataset.bound = '1';
      el.prev.addEventListener('click', function () {
        if (productPage > 0) { productPage--; updateProductCarousel(); }
      });
    }
    if (el.next && el.next.dataset.bound !== '1') {
      el.next.dataset.bound = '1';
      el.next.addEventListener('click', function () {
        if (productPage < productPages() - 1) { productPage++; updateProductCarousel(); }
      });
    }
  }

  async function cargarProductosPublicos() {
    var el = getProductElements();
    if (!el.track) return;

    try {
      var respuesta = await fetch('/api/productos', { cache: 'no-store' });
      if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
      var datos = await respuesta.json();
      productosPublicos = Array.isArray(datos) ? datos : [];
      activarBuscadorProductos();
      activarFlechasProductos();
      renderProductosLista(productosPublicos, false);
    } catch (error) {
      console.error('SR INNOVACION - Error productos:', error);
      el.track.innerHTML = '<p style="padding:30px;text-align:center;width:100%;color:#687382;">No se pudieron cargar los productos.</p>';
      if (el.prev) el.prev.disabled = true;
      if (el.next) el.next.disabled = true;
    }
  }

  /* ================= TRABAJOS ================= */

  var categoriasTrabajo = {
    'Cortadoras de fiambre': { clase: 'cortadoras', numero: '1', descripcion: 'Mantenimiento, reparación y puesta a punto' },
    'Balanzas electrónicas': { clase: 'balanzas', numero: '2', descripcion: 'Reparación, mantenimiento y calibración' },
    'Máquinas gastronómicas': { clase: 'gastronomicas', numero: '3', descripcion: 'Mantenimiento, reparación y reemplazo de componentes' }
  };

  function categoriaConfig(nombre) {
    if (categoriasTrabajo[nombre]) return categoriasTrabajo[nombre];
    return { clase: String(nombre || 'otros').toLowerCase().replace(/[^a-z0-9]+/g, '-'), numero: '', descripcion: 'Trabajos realizados por SR INNOVACION' };
  }

  function etapaFoto(indice, total) {
    if (total <= 1) return 'ANTES';
    if (total === 2) return indice === 0 ? 'ANTES' : 'DESPUÉS';
    if (indice === 0) return 'ANTES';
    if (indice === total - 1) return 'DESPUÉS';
    return 'PROCESO';
  }

  function instalarEstilosGaleria() {
    if ($('#sr-gallery-stable-css')) return;
    var style = document.createElement('style');
    style.id = 'sr-gallery-stable-css';
    style.textContent = [
      '.work-photo{position:relative}',
      '.work-photo .sr-stage-label{position:absolute;left:8px;top:8px;padding:4px 8px;border-radius:999px;background:rgba(8,13,19,.82);color:#fff;font-size:10px;font-weight:800;letter-spacing:.04em;z-index:2}',
      '.photo-modal{position:fixed;inset:0;background:rgba(4,8,12,.88);z-index:100;display:none;align-items:center;justify-content:center;padding:30px}',
      '.photo-modal.open{display:flex}',
      '.photo-modal-content{position:relative;max-width:900px;width:min(82vw,900px);text-align:center}',
      '.photo-modal img{display:block;max-width:100%;max-height:68vh;width:auto;height:auto;object-fit:contain;border-radius:12px;margin:0 auto;box-shadow:0 20px 60px rgba(0,0,0,.35)}',
      '.photo-modal-content p{color:#fff;margin:10px 0 0;font-size:13px}',
      '.photo-modal-close{position:absolute;right:20px;top:12px;border:0;background:rgba(0,0,0,.35);color:#fff;font-size:36px;line-height:1;width:48px;height:48px;border-radius:50%;cursor:pointer;z-index:8}',
      '.sr-photo-arrow{position:fixed;top:50%;transform:translateY(-50%);width:54px;height:54px;border:0;border-radius:50%;background:rgba(20,31,45,.88);color:#fff;font-size:42px;line-height:1;display:grid;place-items:center;cursor:pointer;z-index:110;box-shadow:0 10px 30px rgba(0,0,0,.28)}',
      '.sr-photo-arrow:hover{background:#1265c5}',
      '.sr-photo-prev{left:24px}.sr-photo-next{right:24px}',
      '@media(max-width:650px){.photo-modal{padding:16px}.photo-modal-content{width:calc(100vw - 80px)}.photo-modal img{max-height:62vh}.sr-photo-arrow{width:44px;height:44px;font-size:34px}.sr-photo-prev{left:8px}.sr-photo-next{right:8px}.photo-modal-close{right:6px;top:4px;width:42px;height:42px;font-size:32px}}'
    ].join('');
    document.head.appendChild(style);
  }

  function ensureModal() {
    var modal = $('#photoModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'photo-modal';
      modal.id = 'photoModal';
      modal.setAttribute('aria-hidden', 'true');
      modal.innerHTML = '<button class="photo-modal-close" type="button" aria-label="Cerrar">×</button><button class="sr-photo-arrow sr-photo-prev" type="button" aria-label="Foto anterior">‹</button><div class="photo-modal-content"><img id="photoModalImg" src="" alt=""><p id="photoModalCaption"></p></div><button class="sr-photo-arrow sr-photo-next" type="button" aria-label="Foto siguiente">›</button>';
      document.body.appendChild(modal);
    } else {
      if (!$('.photo-modal-content', modal)) {
        modal.innerHTML = '<button class="photo-modal-close" type="button" aria-label="Cerrar">×</button><button class="sr-photo-arrow sr-photo-prev" type="button" aria-label="Foto anterior">‹</button><div class="photo-modal-content"><img id="photoModalImg" src="" alt=""><p id="photoModalCaption"></p></div><button class="sr-photo-arrow sr-photo-next" type="button" aria-label="Foto siguiente">›</button>';
      } else {
        if (!$('.sr-photo-prev', modal)) {
          var prev = document.createElement('button'); prev.className='sr-photo-arrow sr-photo-prev'; prev.type='button'; prev.setAttribute('aria-label','Foto anterior'); prev.textContent='‹'; modal.appendChild(prev);
        }
        if (!$('.sr-photo-next', modal)) {
          var next = document.createElement('button'); next.className='sr-photo-arrow sr-photo-next'; next.type='button'; next.setAttribute('aria-label','Foto siguiente'); next.textContent='›'; modal.appendChild(next);
        }
      }
    }
    return modal;
  }

  function actualizarModal() {
    var modal = ensureModal();
    var img = $('#photoModalImg', modal);
    var caption = $('#photoModalCaption', modal);
    if (!img || !caption || !fotosModal.length) return;

    var foto = fotosModal[fotoActual];
    img.src = foto.imagen;
    img.alt = captionBase + ' · ' + foto.etapa;
    caption.textContent = captionBase + ' · ' + foto.etapa + ' (' + (fotoActual + 1) + '/' + fotosModal.length + ')';

    var prev = $('.sr-photo-prev', modal);
    var next = $('.sr-photo-next', modal);
    if (prev) prev.disabled = fotosModal.length <= 1;
    if (next) next.disabled = fotosModal.length <= 1;
  }

  function cerrarModalFoto() {
    var modal = $('#photoModal');
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  function abrirModalGrupo(fotos, indice, categoria, nombre) {
    instalarEstilosGaleria();
    ensureModal();
    fotosModal = fotos.map(function (imagen, i) {
      return { imagen: imagenURL(imagen), etapa: etapaFoto(i, fotos.length) };
    });
    fotoActual = Math.max(0, Math.min(indice || 0, fotosModal.length - 1));
    captionBase = categoria + ' · ' + nombre;
    var modal = $('#photoModal');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    actualizarModal();
  }

  function moverFoto(delta) {
    if (!fotosModal.length) return;
    fotoActual = (fotoActual + delta + fotosModal.length) % fotosModal.length;
    actualizarModal();
  }

  function renderTrabajos(trabajos) {
    var contenedor = $('.work-categories');
    if (!contenedor) return;

    instalarEstilosGaleria();

    var grupos = {};
    trabajos.forEach(function (trabajo) {
      var categoria = trabajo.categoria || 'Otros';
      if (!grupos[categoria]) grupos[categoria] = [];
      grupos[categoria].push(trabajo);
    });

    var orden = ['Cortadoras de fiambre', 'Balanzas electrónicas', 'Máquinas gastronómicas'];
    var categorias = orden.filter(function (x) { return grupos[x]; });
    Object.keys(grupos).forEach(function (x) { if (categorias.indexOf(x) === -1) categorias.push(x); });

    if (!categorias.length) {
      contenedor.innerHTML = '<p style="text-align:center;padding:30px;color:#687382;">Todavía no hay trabajos publicados.</p>';
      return;
    }

    contenedor.innerHTML = categorias.map(function (categoria) {
      var config = categoriaConfig(categoria);
      var lista = grupos[categoria];
      return '<article class="work-category" data-category="' + escapar(config.clase) + '">' +
        '<button class="work-category-toggle" type="button" aria-expanded="false">' +
          '<span class="work-category-icon">' + escapar(config.numero) + '</span>' +
          '<span class="work-category-info"><strong>' + escapar(categoria) + '</strong><small>' + escapar(config.descripcion) + '</small></span>' +
          '<span class="work-category-count">' + lista.length + ' trabajo' + (lista.length === 1 ? '' : 's') + ' <b>+</b></span>' +
        '</button>' +
        '<div class="work-gallery-wrap" hidden>' +
          lista.map(function (trabajo) {
            var fotos = Array.isArray(trabajo.imagenes) ? trabajo.imagenes : [];
            return '<div class="work-job">' +
              '<div class="work-job-heading"><strong>' + escapar(trabajo.nombre) + '</strong><span>' + fotos.length + ' foto' + (fotos.length === 1 ? '' : 's') + '</span></div>' +
              (trabajo.descripcion ? '<div style="color:#687382;font-size:13px;margin-bottom:12px;">' + escapar(trabajo.descripcion) + '</div>' : '') +
              '<div class="work-gallery">' +
                fotos.map(function (imagen, indice) {
                  var etapa = etapaFoto(indice, fotos.length);
                  return '<button class="work-photo" type="button" data-index="' + indice + '" data-stage="' + etapa + '">' +
                    '<img src="' + escapar(imagenURL(imagen)) + '" alt="' + escapar(categoria + ' · ' + trabajo.nombre + ' · ' + etapa) + '" loading="lazy">' +
                    '<span class="sr-stage-label">' + etapa + '</span>' +
                  '</button>';
                }).join('') +
              '</div>' +
              '<div class="sr-work-json" hidden>' + escapar(JSON.stringify(fotos)) + '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</article>';
    }).join('');

    activarGalerias();
    activarFotos();
  }

  function activarGalerias() {
    $$('.work-category-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var category = btn.closest('.work-category');
        var panel = category ? $('.work-gallery-wrap', category) : null;
        if (!category || !panel) return;

        var abrir = panel.hidden;
        $$('.work-category').forEach(function (item) {
          if (item !== category) {
            item.classList.remove('open');
            var otherBtn = $('.work-category-toggle', item);
            var otherPanel = $('.work-gallery-wrap', item);
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherPanel) otherPanel.hidden = true;
          }
        });

        category.classList.toggle('open', abrir);
        btn.setAttribute('aria-expanded', String(abrir));
        panel.hidden = !abrir;
      });
    });
  }

  function activarFotos() {
    $$('.work-photo').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var job = btn.closest('.work-job');
        var category = btn.closest('.work-category');
        if (!job || !category) return;
        var raw = $('.sr-work-json', job);
        if (!raw) return;
        var fotos;
        try { fotos = JSON.parse(raw.textContent || '[]'); } catch (_) { fotos = []; }
        var nombreEl = $('.work-job-heading strong', job);
        var categoriaEl = $('.work-category-info strong', category);
        abrirModalGrupo(fotos, Number(btn.getAttribute('data-index') || 0), categoriaEl ? categoriaEl.textContent : '', nombreEl ? nombreEl.textContent : '');
      });
    });
  }

  async function cargarTrabajosPublicos() {
    var contenedor = $('.work-categories');
    if (!contenedor) return;
    try {
      var respuesta = await fetch('/api/trabajos', { cache: 'no-store' });
      if (!respuesta.ok) throw new Error('HTTP ' + respuesta.status);
      var datos = await respuesta.json();
      renderTrabajos(Array.isArray(datos) ? datos : []);
    } catch (error) {
      console.error('SR INNOVACION - Error trabajos:', error);
      contenedor.innerHTML = '<p style="text-align:center;padding:30px;color:#687382;">No se pudieron cargar los trabajos.</p>';
    }
  }

  /* ================= MODAL CONTROLS ================= */

  function activarModalGlobal() {
    var modal = ensureModal();
    var close = $('.photo-modal-close', modal);
    var prev = $('.sr-photo-prev', modal);
    var next = $('.sr-photo-next', modal);

    if (close && close.dataset.bound !== '1') {
      close.dataset.bound = '1';
      close.addEventListener('click', cerrarModalFoto);
    }
    if (prev && prev.dataset.bound !== '1') {
      prev.dataset.bound = '1';
      prev.addEventListener('click', function (e) { e.stopPropagation(); moverFoto(-1); });
    }
    if (next && next.dataset.bound !== '1') {
      next.dataset.bound = '1';
      next.addEventListener('click', function (e) { e.stopPropagation(); moverFoto(1); });
    }
    if (modal.dataset.bound !== '1') {
      modal.dataset.bound = '1';
      modal.addEventListener('click', function (e) {
        if (e.target === modal) cerrarModalFoto();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') cerrarModalFoto();
      if (e.key === 'ArrowLeft' && $('#photoModal') && $('#photoModal').classList.contains('open')) moverFoto(-1);
      if (e.key === 'ArrowRight' && $('#photoModal') && $('#photoModal').classList.contains('open')) moverFoto(1);
    });
  }

  /* ================= INIT ================= */

  function iniciar() {
    activarMenu();
    activarModalGlobal();
    cargarProductosPublicos();
    cargarTrabajosPublicos();

    window.addEventListener('resize', function () {
      updateProductCarousel();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
