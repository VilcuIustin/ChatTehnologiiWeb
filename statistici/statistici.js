let istoric;

function loadStatistici() {
    istoric = new IstoricNumarMesaje();
    $("#content").empty();
    $("#content").load("statistici/statistici.html");
    istoric.newMesaj(new MesajeZi(50, new Date().toISOString().slice(0, 10)));
    console.log(istoric)


}