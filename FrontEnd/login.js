const submit = document.querySelector('input[type="submit"]'); //Sélectionne l'élément input de type submit dans le document HTML et le stocke dans la variable submit.

submit.addEventListener("click", function (e) {
    e.preventDefault(); //empêche l'action par défaut du formulaire (qui serait de soumettre le formulaire).
    fetchUserLogin(); //appelle la fonction fetchUserLogin pour gérer la connexion de l'utilisateur
});

function fetchUserLogin() {  //declarer une fontion 
    const email = document.getElementById("email").value;//Sélectionne les valeurs des champs email et password dans le document HTML et les stocke dans des variables
    const password = document.getElementById("password").value;
    const errorMsg = document.querySelector(".erreur-msg");//Sélectionne l'élément avec la classe erreur-msg pour afficher les messages d'erreur.

    fetch("http://"+ window.location.hostname +":5678/api/users/login", {
        method: "POST",
        headers: { //Définit les en-têtes de la requête pour indiquer que le contenu est en JSON
            "Content-Type": "application/json",
            accept: "application/json",
        },
        body: JSON.stringify({ //Convertit les valeurs email et password en une chaîne JSON et les envoie dans le corps de la requête
            "email": email,
            "password": password,
        })
    })
    .then(response => {
        if (response.ok) { //Si la réponse est correcte, elle est convertie en JSON
            return response.json();
        } else {
            localStorage.setItem("token", undefined);//Si la réponse n'est pas correcte, les éléments token et login dans le stockage local sont définis comme undefined
            localStorage.setItem("login", undefined);
            errorMsg.innerText = "Erreur dans l’identifiant ou le mot de passe";
            console.log("Connexion Impossible : Erreur Identifiant ou Mot de passe");
            throw new Error('Connexion Impossible');
        }
    })
    .then(dataUser => {
        // Token d'autentification qui traite les données JSON retournées par le serveur: 
        // Stocke le token d'authentification et la connexion dans le stockage local.
        // Redirige l'utilisateur vers la page index.html
        localStorage.setItem("token", dataUser.token);
        localStorage.setItem("login", true);
        window.location.href = "./index.html";
    })
    .catch(error => {
        console.log(error);
    });
}

function Filters() {
    const btns = document.getElementsByClassName("btn");
    for (let i = 1; i < btns.length; i++) {
        btns[i].addEventListener("click", () => {
            const filterbtn = elementArray.filter(element => element.categoryId === i);
            for (let j = 0; j < btns.length; j++) {
                btns[j].classList.remove("active");
            }
            btns[i].classList.add("active");
            document.querySelector(".gallery").innerHTML = "";
            AddGallery(filterbtn);
        });
    }

    // btn "Tous"
    btns[0].addEventListener("click", () => {
        const filterTous = elementArray.filter(element => true); // Filter all elements
        for (let j = 0; j < btns.length; j++) {
            btns[j].classList.remove("active");
        }
        btns[0].classList.add("active");
        document.querySelector(".gallery").innerHTML = "";
        AddGallery(filterTous);
    });
}

const log = document.querySelector("#log");
const banner = document.querySelector(".banner");
const modifierContainer = document.querySelector(".modifier-container");
const modifierprojetsContainer = document.querySelector(".modifier-projets-container");
const projetsContainer = document.querySelector(".projets-container");

function editMode() {
    if (localStorage.getItem('login')) {
        banner.style.display = "flex";
        log.innerText = "logout";
        modifierContainer.style.display = "flex";
        modifierprojetsContainer.style.display = "flex";
        projetsContainer.style.marginBottom = "92px";
        document.querySelectorAll('.allBtn').forEach(btn => btn.style.display = "none");

        console.log("Vous êtes connecté !");
    } else {
        banner.style.display = "none";
        log.innerText = "login";
        modifierContainer.style.display = "none";
        modifierprojetsContainer.style.display = "none";
        projetsContainer.style.marginBottom = "";
        document.querySelectorAll('.allBtn').forEach(btn => btn.style.display = "block");

        console.log("Vous n'êtes pas connecté !");
    }
}

// "logout", supprime login et token
log.addEventListener("click", () => {
    if (localStorage.getItem('login')) {
        localStorage.removeItem("login");
        localStorage.removeItem("token");
        editMode();
    } else {
        // Here you would handle the login logic (e.g., show login form)
    }
});

editMode();


