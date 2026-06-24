let contenidoLista= '';
db.collection("platillos").onSnapshot((datos)=>{
    datos.docChanges().forEach((registro)=>{
        if (registro.type==="added"){
            agregarALista(registro.doc.data(), registro.doc.id);
        }
    });
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
});

function agregarALista (platillo, id) {
    contenido += `<option value= '${id}'>
    ${platillo.nombre}
    </option>`;
    document.getElementById("listaPlatillos").innerHTML = contenidoLista; 
}