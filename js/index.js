// Renderizado de la lista de platillos y captura de foto con la camara.
// Solo se carga en index.html.

const FOTO_POR_DEFECTO = 'img/Comida_def.jpg';
const listado = document.querySelector('.recipes');

/* ------------------------------------------------------------------ */
/* Lista de platillos                                                   */
/* ------------------------------------------------------------------ */

function formatearPrecio(precio) {
  const numero = Number.parseFloat(precio);
  return Number.isFinite(numero)
    ? 'Precio: $' + numero.toFixed(2) + ' MXN'
    : 'Precio: no disponible';
}

function buscarTarjeta(id) {
  return listado ? listado.querySelector('.recipe[data-id="' + id + '"]') : null;
}

function crearTarjeta(platillo, id) {
  const tarjeta = document.createElement('div');
  tarjeta.className = 'card-panel recipe white row';
  tarjeta.dataset.id = id;

  const imagen = document.createElement('img');
  imagen.src = platillo.foto || FOTO_POR_DEFECTO;
  imagen.alt = 'Foto del platillo';
  imagen.addEventListener('error', function () {
    imagen.src = FOTO_POR_DEFECTO;
  });

  const detalles = document.createElement('div');
  detalles.className = 'recipe-details';

  const titulo = document.createElement('div');
  titulo.className = 'recipe-title';
  titulo.textContent = platillo.nombre || 'Sin nombre';

  const ingredientes = document.createElement('div');
  ingredientes.className = 'recipe-ingredients';
  ingredientes.textContent = platillo.ingredientes || '';

  const precio = document.createElement('div');
  precio.className = 'recipe-precio';
  precio.textContent = formatearPrecio(platillo.precio);

  const contenedorBorrar = document.createElement('div');
  contenedorBorrar.className = 'recipe-delete';

  const iconoBorrar = document.createElement('i');
  iconoBorrar.className = 'material-icons';
  iconoBorrar.textContent = 'delete_outline';
  iconoBorrar.title = 'Eliminar platillo';

  contenedorBorrar.appendChild(iconoBorrar);
  detalles.appendChild(titulo);
  detalles.appendChild(ingredientes);
  detalles.appendChild(precio);
  detalles.appendChild(contenedorBorrar);
  tarjeta.appendChild(imagen);
  tarjeta.appendChild(detalles);

  return tarjeta;
}

function mostrarPlatillo(platillo, id) {
  if (!listado || buscarTarjeta(id)) return;
  listado.appendChild(crearTarjeta(platillo, id));
}

function actualizarPlatillo(platillo, id) {
  const tarjeta = buscarTarjeta(id);
  if (!tarjeta) return;

  tarjeta.querySelector('.recipe-title').textContent = platillo.nombre || 'Sin nombre';
  tarjeta.querySelector('.recipe-ingredients').textContent = platillo.ingredientes || '';
  tarjeta.querySelector('.recipe-precio').textContent = formatearPrecio(platillo.precio);
  tarjeta.querySelector('img').src = platillo.foto || FOTO_POR_DEFECTO;
}

function borrarPlatillo(id) {
  const tarjeta = buscarTarjeta(id);
  if (tarjeta) tarjeta.remove();
}

function mostrarAviso(texto) {
  if (!listado) return;
  let aviso = listado.querySelector('.aviso');
  if (!aviso) {
    aviso = document.createElement('div');
    aviso.className = 'aviso card-panel white';
    listado.prepend(aviso);
  }
  aviso.textContent = texto;
}

/* ------------------------------------------------------------------ */
/* Camara                                                               */
/* ------------------------------------------------------------------ */

const video    = document.getElementById('video');
const canvas   = document.getElementById('canvas');
const salida   = document.getElementById('salida');
const foto     = document.getElementById('foto');
const btnFoto  = document.getElementById('btnFoto');
const btnCapturar = document.getElementById('btnCapturar');
const campoFoto   = document.getElementById('fotoFinal');

if (video && canvas && salida && foto && btnFoto && btnCapturar && campoFoto) {
  const ANCHO = 320;
  let streamActual = null;

  video.setAttribute('playsinline', '');
  video.setAttribute('autoplay', '');
  video.muted = true;

  // --- Selector de cámara (se inserta dinámicamente) ---
  const selectCamara = document.createElement('select');
  selectCamara.className = 'browser-default';
  selectCamara.style.cssText = [
    'margin: 8px 0',
    'width: 100%',
    'border: 1px solid #ccc',
    'border-radius: 4px',
    'padding: 5px',
    'display: none'
  ].join(';');
  btnCapturar.parentNode.insertBefore(selectCamara, btnCapturar.nextSibling);

  // --- Estado visual ---
  function mostrarVideo() {
    video.style.display  = 'block';
    salida.style.display = 'none';
  }

  function mostrarFoto() {
    video.style.display  = 'none';
    salida.style.display = 'block';
  }

  function ocultarTodo() {
    video.style.display  = 'none';
    salida.style.display = 'none';
  }

  // --- Detener stream ---
  function detenerCamara() {
    if (streamActual) {
      streamActual.getTracks().forEach(function (t) { t.stop(); });
      streamActual = null;
    }
    video.srcObject = null;
    btnCapturar.disabled    = true;
    btnFoto.textContent     = 'Imagen';
    selectCamara.style.display = 'none';
    ocultarTodo();
  }

  // --- Iniciar stream con deviceId concreto (o trasera por defecto) ---
  function iniciarStream(deviceId) {
    if (streamActual) {
      streamActual.getTracks().forEach(function (t) { t.stop(); });
      streamActual = null;
      video.srcObject = null;
    }

    const restricciones = {
      audio: false,
      video: deviceId
        ? { deviceId: { exact: deviceId } }
        : { facingMode: { ideal: 'environment' } }
    };

    return navigator.mediaDevices.getUserMedia(restricciones)
      .then(function (stream) {
        streamActual    = stream;
        video.srcObject = stream;
        mostrarVideo();
        btnFoto.textContent  = 'Apagar camara';
        btnCapturar.disabled = false;
        // play() puede rechazarse si el elemento aún no está visible; se ignora
        return video.play().catch(function () {});
      });
  }

  // --- Rellenar selector con las cámaras disponibles ---
  function cargarCamaras() {
    return navigator.mediaDevices.enumerateDevices()
      .then(function (dispositivos) {
        const camaras = dispositivos.filter(function (d) {
          return d.kind === 'videoinput';
        });

        selectCamara.innerHTML = '';
        camaras.forEach(function (cam, i) {
          const op = document.createElement('option');
          op.value       = cam.deviceId;
          op.textContent = cam.label || ('Camara ' + (i + 1));
          selectCamara.appendChild(op);
        });

        selectCamara.style.display = camaras.length > 1 ? 'block' : 'none';

        // Marcar en el select la cámara que realmente está activa
        if (streamActual) {
          const track = streamActual.getVideoTracks()[0];
          if (track) {
            const id = track.getSettings().deviceId;
            if (id) selectCamara.value = id;
          }
        }
      });
  }

  // --- Botón Imagen ---
  btnFoto.addEventListener('click', function () {
    if (streamActual) {
      detenerCamara();
      return;
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('La camara no esta disponible. Abre la app por https o desde localhost.');
      return;
    }

    iniciarStream(null)
      .then(cargarCamaras)
      .catch(function (error) {
        console.error('No se pudo abrir la camara:', error);
        alert('No se pudo abrir la camara: ' + error.message);
        detenerCamara();
      });
  });

  // --- Cambio de cámara en el selector ---
  selectCamara.addEventListener('change', function () {
    iniciarStream(selectCamara.value)
      .catch(function (error) {
        console.error('No se pudo cambiar la camara:', error);
        alert('No se pudo cambiar la camara: ' + error.message);
      });
  });

  // --- Botón Capturar ---
btnCapturar.addEventListener('click', function () {
  if (!streamActual) {
    alert('Primero enciende la camara con el boton "Imagen".');
    return;
  }

  const MAX = 400;
  const escala = Math.min(1, MAX / video.videoWidth);
  const w = Math.round(video.videoWidth  * escala);
  const h = Math.round(video.videoHeight * escala);

  canvas.width  = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(video, 0, 0, w, h);

  const fotoFinal = canvas.toDataURL('image/jpeg', 0.5);
  foto.src        = fotoFinal;
  campoFoto.value = fotoFinal;

  detenerCamara();
  mostrarFoto();
});

  btnCapturar.disabled = true;
  ocultarTodo();

  window.limpiarFoto = function () {
    campoFoto.value = '';
    foto.removeAttribute('src');
    detenerCamara();
  };
} else {
  window.limpiarFoto = function () {};
}