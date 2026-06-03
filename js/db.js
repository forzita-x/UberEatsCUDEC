db.collection("platillos").onSnapshot((coleccion) => {
    coleccion.forEach((registro) => {
        console.log(registro);
    });
});