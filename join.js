const url = 'https://localhost:5001/api/';
const baseurl= 'http://localhost:8080';
window.addEventListener("load", () => {
    let id = getId()
    if (id == null)
        return null;       // need to show an error message
    if (!window.localStorage.getItem("token")) {
        return null;       // need to redirect to login page
    }
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", url + "Group/InfoGroup?idGroup=" + id, true);
    xhttp.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem("token"));
    xhttp.send();
    xhttp.onreadystatechange = (data) => {
        if (data.currentTarget.readyState == 4 && data.currentTarget.status == 200) {
            grupInfo = JSON.parse(data.currentTarget.responseText);
            $("#grupname").text(grupInfo.nume)
            $("#nrMembrii").text(grupInfo.participanti)
            if (grupInfo.inGroup == true) {
                $("#accept").text("You are already in this group");
            } else
                $("#accept").removeClass("disabled")
        } else if (data.currentTarget.readyState == 4)
            console.error(data.currentTarget.responseText);
    }

})


function cancel() {
    window.location.href = baseurl;
}

function join() {
    $("#accept").addClass("disabled")
    const xhttp = new XMLHttpRequest();
    xhttp.open('POST', url + "Group/joingroup", true);
    xhttp.setRequestHeader("Authorization", "Bearer " + window.localStorage.getItem("token"));
    xhttp.setRequestHeader("Content-type", "application/json");
    if (!getId()) {
        return null;
    }
    let body = {
        GroupId: getId(),
    }
    xhttp.onreadystatechange=(data) => {
        if (data.currentTarget.readyState == 4 && data.currentTarget.status == 200) {
            rez = JSON.parse(data.currentTarget.responseText);
            console.log(rez.message);
            $("#message").text(rez.message);
            $("#message").addClass("text-primary");
        } else if (data.currentTarget.readyState == 4) {
            rez = JSON.parse(data.currentTarget.responseText);
            console.error(rez.message);
            $("#message").addClass("text-danger");
            $("#message").text(rez.message);
        }
    }
    xhttp.send(JSON.stringify(body));

}

function getId() {
    let params = (new URL(document.location)).searchParams;
    return params.get("id");
}