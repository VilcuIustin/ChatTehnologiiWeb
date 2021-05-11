class IstoricNumarMesaje {
    constructor() {
        this.mesaje= []
    }
    /**
     *   @param {MesajeZi} mesaj
     */
    newMesaj(mesaj){
        this.mesaje.push(mesaj);
    }
    getAll(){
        return this.mesaje;
    }
}