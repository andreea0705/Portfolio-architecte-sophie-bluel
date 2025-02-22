const submit = document.querySelector('input[type="submit"]'); //recuperer la valeur de l'email

submit.addEventListener("click", function (e) {
    e.preventDefault();
    fetchUserLogin();
});

function fetchUserLogin() {  //declarer une fontion 
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.querySelector(".erreur-msg");

    fetch("http://"+ window.location.hostname +":5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            accept: "application/json",
        },
        body: JSON.stringify({
            "email": email,
            "password": password,
        })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            localStorage.setItem("token", undefined);
            localStorage.setItem("login", undefined);
            errorMsg.innerText = "Erreur dans l’identifiant ou le mot de passe";
            console.log("Connexion Impossible : Erreur Identifiant ou Mot de passe");
            throw new Error('Connexion Impossible');
        }
    })
    .then(dataUser => {
        // Token d'autentification
        localStorage.setItem("token", dataUser.token);
        localStorage.setItem("login", true);
        window.location.href = "./index.html";
    })
    .catch(error => {
        console.log(error);
    });
}

