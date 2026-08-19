// Sincronizacion de la coleccion "platillos" con Firestore.
// Requiere firebase.js (define `db`) e index.js (define mostrarPlatillo, etc.).
// Solo se carga en index.html.

if (!db) {
  console.error('Firestore no esta disponible: no se cargaran los platillos.');
} else {

  const coleccionPlatillos = db.collection('platillos');

  coleccionPlatillos.onSnapshot(
    function (datos) {
      datos.docChanges().forEach(function (registro) {
        const platillo = registro.doc.data();
        const id = registro.doc.id;

        if (registro.type === 'added') mostrarPlatillo(platillo, id);
        if (registro.type === 'modified') actualizarPlatillo(platillo, id);
        if (registro.type === 'removed') borrarPlatillo(id);
      });
    },
    function (error) {
      console.error('Error al escuchar los platillos:', error);
      mostrarAviso(
        error.code === 'permission-denied'
          ? 'No se pudieron cargar los platillos: revisa firestore.rules.'
          : 'No se pudieron cargar los platillos: ' + error.message
      );
    }
  );

  /* ---------------------------------------------------------------- */
  /* Alta de platillos                                                  */
  /* ---------------------------------------------------------------- */

  const formularioAgregar = document.querySelector('.add-recipe');
  const campoNombre      = document.getElementById('title');
  const campoIngredientes = document.getElementById('ingredientes');
  const campoPrecio      = document.getElementById('price');
  const campoFotoOculto  = document.getElementById('fotoFinal');
  const botonAgregar     = formularioAgregar ? formularioAgregar.querySelector('button') : null;

  function guardarPlatillo(nombre, ingredientes, precio, fotoBase64) {
    const platilloNuevo = {
      nombre: nombre,
      ingredientes: ingredientes,
      precio: precio,
      foto: fotoBase64,
      creado: firebase.firestore.FieldValue.serverTimestamp()
    };

    coleccionPlatillos.add(platilloNuevo)
      .then(function () {
        formularioAgregar.reset();
        window.limpiarFoto();
        M.updateTextFields();
        alert('Platillo agregado');
      })
      .catch(function (error) {
        console.error('Error al agregar el platillo:', error);
        alert('Error al agregar el platillo: ' + error.message);
      })
      .finally(function () {
        if (botonAgregar) botonAgregar.disabled = false;
      });
  }

  if (formularioAgregar && campoNombre && campoIngredientes && campoPrecio && campoFotoOculto) {
    formularioAgregar.addEventListener('submit', function (e) {
      e.preventDefault();

      const nombre      = campoNombre.value.trim();
      const ingredientes = campoIngredientes.value.trim();
      const precio      = Number.parseFloat(campoPrecio.value);
      const fotoBase64  = campoFotoOculto.value;

      if (!nombre || !ingredientes) {
        alert('Escribe el nombre y los ingredientes del platillo.');
        return;
      }
      if (!Number.isFinite(precio) || precio < 0) {
        alert('El precio debe ser un numero mayor o igual a cero.');
        return;
      }

      if (botonAgregar) botonAgregar.disabled = true;

      guardarPlatillo(nombre, ingredientes, precio, fotoBase64);
    });
  }

  /* ---------------------------------------------------------------- */
  /* Baja de platillos                                                  */
  /* ---------------------------------------------------------------- */

  const zonaPlatillos = document.querySelector('.recipes');

  if (zonaPlatillos) {
    zonaPlatillos.addEventListener('click', function (e) {
      const icono = e.target.closest('.recipe-delete i');
      if (!icono) return;

      const tarjeta = icono.closest('.recipe');
      const id = tarjeta ? tarjeta.dataset.id : null;
      if (!id) return;

      if (!confirm('Desea eliminar el platillo?')) return;

      coleccionPlatillos.doc(id).delete()
        .then(function () {
          console.log('Platillo eliminado correctamente.');
        })
        .catch(function (error) {
          console.error('Error al eliminar:', error);
          alert('Hubo un error al intentar eliminar el platillo: ' + error.message);
        });
    });
  }

}