function logout() {
    window.localStorage.removeItem("token");
    $("#content").load("login.html");
}


async function loginReq(url, data) {
    console.log(url);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((data) => {
        let enc = new TextDecoder("utf-8");
        data.body.getReader()
            .read()
            .then((res) => {
                let rezultat = JSON.parse(enc.decode(res.value));
                user = new User(rezultat.email, rezultat.nume, rezultat.id);
                window.localStorage.setItem("token", rezultat.token);
                console.log(user, rezultat);
                document.getElementById("login").style.display = "none";
                $("#content").load("Chat/chat.html");
                getData(this.url + "group/AfisareGrupuri?", 0, 10);

            })
    }).catch((e) => {
        console.error(e);
    });
}

async function login() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    //  email = "vilcuiustin@gmail.com";
    // password = "1234";
    if (email == 0)
        return alert("Emailul nu poate sa fie necompletat");
    if (password == 0)
        return alert("Parola nu poate sa fie necompletata");
    const body = {
        email: email,
        password: password
    }
    console.log(body);
    await loginReq(url + "account/login", body);

}