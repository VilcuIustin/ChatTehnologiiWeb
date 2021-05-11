urlHub = "https://localhost:5001/hub";

const connection = new signalR.HubConnectionBuilder()
    .withUrl(urlHub, {
        accessTokenFactory: () => (window.localStorage.getItem('token'))

    })
    .configureLogging(signalR.LogLevel.Information).build();

async function start() {
    try {
        console.log(connection);
        await connection.start();

        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

connection.on("conectat", (mesaj) => {
    console.log(mesaj);
})

connection.on("new message", (mesaj, username, msgId, userId, groupId) => {
    console.log(mesaj, username, msgId, userId, groupId);
    console.log(conv);
    let msg = new Mesaj(mesaj, username, msgId, userId);
    addCards(msg);
    console.log(msg);
    // conv[id.split("c")[1] - 1][0].id
    let este_conv = conv.flat().findIndex(el =>
        (el.denumire != null && el.id == groupId)
    );
    conv[este_conv / 2][1].mesaj = mesaj;
    let loc = "#c" + ((este_conv / 2) + 1) + " > p";
    console.log(loc);
    $(loc).text(mesaj);

})




