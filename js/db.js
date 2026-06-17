db.collection("platillos").onSnapshot((coleccion) => {
    coleccion.docChanges().forEach((registro) => {
        if (registro.type === "added"){
            mostrarPlatillo(registro.doc.data(), registro.doc.id);
            agregarALista(registro.doc.data(), registro.doc.id);
        }
        if (registro.type === "modified"){
            actualizarPlatillo(registro.doc.data(), registro.doc.id);
        }
        if (registro === "removed") {
            borrarPlatillo(registro.doc.id);
        }
    });
});

const formularioAgregar = document.querySelector("form");
formularioAgregar.addEventListener("submit", (e) => {
    e.preventDefault();
    const platilloNuevo = {
        nombre: formularioAgregar.nombre.value,
        ingredientes: formularioAgregar.ingredientes.value,
        precio: formularioAgregar.precio.value
    }
    db.collection("platillos").add(platilloNuevo)
    .catch((error) => {
        console.log(error);
        alert("Error al agregar platillo");
    }
    );

    formularioAgregar.nombre.value = "";
    formularioAgregar.ingredientes.value = "";
    formularioAgregar.precio.value = "";
    alert("Platillo agregado");
});

const platilloBorrar = document.querySelector(".recipes");
platilloBorrar.addEventListener("click",(e) => {
    if (e.target.tagName === 'I'){
        const id = e.target.getAttribute("data-id");
        db.collection("platillos").doc(id).delete();

    }
    confirm("¿Estas seguro de borrar el platillo");
})