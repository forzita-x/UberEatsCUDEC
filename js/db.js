<<<<<<< HEAD
db.collection("platillos").onSnapshot((collection)) => {
    collection.forEach((registro)) => {
        console.log(registro.data());
    };
};
=======
db.collection("platillos").onSnapshot((coleccion) => {
    coleccion.forEach((registro) => {
        console.log(registro);
    });
});
>>>>>>> 9b8c55b6c9f0d0cabe41214613f33183fd6e3126
