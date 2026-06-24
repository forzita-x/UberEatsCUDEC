<<<<<<< HEAD
let contenidoLista = '';

db.collection("platillos").onSnapshot((datos) => {
    datos.docChanges().forEach((registro) => {
        if (registro.type === "added") {
=======
let contenidoLista= '';
db.collection("platillos").onSnapshot((datos)=>{
    datos.docChanges().forEach((registro)=>{
        if (registro.type==="added"){
>>>>>>> c5c0bb400be9f674646e62b7f8a489f7ce1b2168
            agregarALista(registro.doc.data(), registro.doc.id);
        }
    });
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems);
});

<<<<<<< HEAD
function agregarALista(platillo, id) {
    contenidoLista += `<option value='${id}'>
    ${platillo.nombre}
    </option>`;
    document.getElementById("listaPlatillos").innerHTML = contenidoLista;
=======
function agregarALista (platillo, id) {
    contenido += `<option value= '${id}'>
    ${platillo.nombre}
    </option>`;
    document.getElementById("listaPlatillos").innerHTML = contenidoLista; 
>>>>>>> c5c0bb400be9f674646e62b7f8a489f7ce1b2168
}