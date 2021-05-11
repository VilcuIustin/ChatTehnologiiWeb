const url = 'https://localhost:5001/api/'
const urlJoin = 'http://localhost:8080/join.html?id='
let user = null;
let conv = [];
let token;
let curentChat = 0;
let position = 0;
let pagesize = 10;
window.addEventListener("load", async () => {
    token = localStorage.getItem("token");
    if (token != null) {
        console.log(token);
        decodeToken(token);
        start();
        console.log("Token gasit...");
        $("#content").load("Chat/chat.html");
        //     .then(()=>{
        //
        await getData(url + "group/AfisareGrupuri?", position, pagesize);
        //
        // });
    } else {
        console.error("NU A FOST GASIT TOKENUL");
        $("#content").load("login.html");
    }

})

async function decodeToken(token) {
    let values = JSON.parse(atob(token.split('.')[1]));
    user = new User(values.email, values.Nume, values.Id);
}


async function getData(url, pagenumber, pagesize) {
    if(pagenumber==0)
        conv=[]
    const response = await fetch(url + new URLSearchParams({
        pagezise: pagesize,
        pagenumber: pagenumber,
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + window.localStorage.getItem('token')
        },
    }).then((response) => {
        var enc = new TextDecoder("utf-8");
        response.body.getReader()
            .read()
            .then((res) => {
                rez = JSON.parse(enc.decode(res.value));
                position++;
                console.log(rez);
                ($.get("Chat/card.html").then((e) => {
                    for (let i = 0; i < rez.grupuri.length; i++) {
                        conv.push([rez.grupuri[i], rez.last_message[i]])
                        console.log("" + rez.grupuri[i].denumire);
                        $("#groups  > #conv").append(e);
                        $("#c0 > h6").text(rez.grupuri[i].denumire);
                        $("#c0 > p").text(rez.last_message[i].mesaj);
                        $("#c0").click((e) => {
                            cardClick(e);
                        });
                        $("#c0").attr('id', "c" + (rez.grupuri[i].id));
                    }
                }))
            })
    }).catch((error) => {
        console.error(error);
    });
}

async function loadmore() {
    await getData(url + "group/AfisareGrupuri?", position, pagesize);
}

async function getMessages(url, groupId, pagenumber, pagesize) {
    const response = await fetch(url + "?" + new URLSearchParams({
        groupId, groupId,
        pagesize: pagesize,
        pagenumber: pagenumber,
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + window.localStorage.getItem('token')
        },
    }).then((response) => {
        var enc = new TextDecoder("utf-8");
        response.body.getReader()
            .read()
            .then((res) => {
                addCards(JSON.parse(enc.decode(res.value)));
            }).catch((e) => {
            console.error(e);
        })
    }).catch((e) => {
        console.error(e);
    })
}

function addCards(messages) {                           //adauga mesajele in chat
    console.log(messages);
    $.get("Chat/messageCard.html").then((card) => {
        if (messages instanceof Mesaj) {
            appendMessage(messages, card, true);
        } else {
            messages.forEach(el => {
                appendMessage(el, card, false);
            })
        }

    }).catch((err) => {
        console.log(err);
    })
}

function appendMessage(el, card, mod) {       //aici le da append(true) sau prepend(false)
    if (mod)
        $("#zona_mesaje").append(card);
    else
        $("#zona_mesaje").prepend(card);
    console.log(el.mesaj);
    $("#ums0").text(el.nume);
    $("#ms0").text(el.mesaj);
    $("#ums0").attr('id', "ums" + el.id);
    $("#ms0").attr('id', "ms" + el.id);
    if (el.userId == user.id) {
        $("#m0").removeClass("align-items-start");
        $("#m0").addClass("align-items-end");
    }
    $("#m0").attr('id', "m" + el.id);
}

async function creareGrup() {
    let nume_grup = document.getElementById("numegrupnou").value.trim();
    if (nume_grup.length == 0) {
        alert("Numele grupului trebuie sa fie anonim");
        return;
    }
    body = {
        Denumire: nume_grup
    }

    const response = await fetch(url + "group/creategroup", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + window.localStorage.getItem('token')

        },
        body: JSON.stringify(body)
    }).then((data) => {
        let enc = new TextDecoder("utf-8");
        position=0;
        data.body.getReader()
            .read()
            .then((res) => {
                console.log(res);
                $("#conv").empty();
                getData(url + "group/AfisareGrupuri?", position, pagesize)
            })
    }).catch((e) => {
        console.error(e);
    });
}

async function addMessage() {                                               //trimite post request pentru a adauga un mesaj nou
    let mesaj = document.getElementById("newmsg").value.trim();
    if (mesaj.length == 0) {
        alert("Un mesaj trebuie sa nu fie gol");
        return;
    }
    body = {
        Id: curentChat,
        Message: mesaj
    }
    console.error(curentChat);
    const response = await fetch(url + "message/AddMessage", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + window.localStorage.getItem('token')

        },
        body: JSON.stringify(body)
    }).then((data) => {
        let enc = new TextDecoder("utf-8");
        data.body.getReader()
            .read()
            .then((res) => {
                console.log(enc.decode(res.value));
            })
    }).catch((e) => {
        console.error(e);
    });
}


/**
 *
 * @param {Event} e
 */
async function cardClick(e) {
    var id = $(e.currentTarget).attr("id");

    if (conv[id.split("c")[1] - 1][0].id == curentChat) {
        return;
    }
    $("#zona_mesaje").empty();
    curentChat = conv[id.split("c")[1] - 1][0].id;
    let denumire_grup = conv[id.split("c")[1] - 1][0].denumire;
    if ($("* > #titlu_grup").val() != null)
        $("#titlu_grup").text(denumire_grup);
    else {
        $.get("Chat/headerMessage.html").then((comp) => {

            $("#chatzone").append(comp);
            $("#titlu_grup").text(denumire_grup);
            $("#chatzone> #conv-header > #btnJoin").click(() => {
                console.log("testulet")
                navigator.clipboard.writeText(urlJoin + curentChat)
            })
        })
    }
    await getMessages(url + "message/GetMessage", conv[id.split("c")[1] - 1][0].id, 0, 20);

}










