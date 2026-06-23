db.collection("platillos").onSnapshot((coleccion) => {
datos.docChanges().forEach((registro) =>{
    if (registro.type==="added"){
    agregarALista(registro.doc.data(),registro.doc.id);
    }
})
});