db.collection("platillos").onSnapshot((collection)) => {
    collection.forEach((registro)) => {
        console.log(registro.data());
    };
};