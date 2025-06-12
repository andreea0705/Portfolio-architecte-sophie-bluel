/** -- Début déclaration constantes (const) et variables (let) -- **/
  let elementArray; // Stocke les données des travaux
  const allBtn = document.querySelector(".allBtn");//Sélectionne l'élément du DOM avec la classe allBtn
  const modifierProjetsContainer = document.querySelector(".modifier-projets-container"); // Boutons liés à "modifier"
  //récupérer des éléments du DOM avec document.querySelector() et document.querySelectorAll()
  const modal2 = document.querySelector(".modal-container2");
  const modal1 = document.querySelector(".modal-container");
  const modalOpen = document.querySelectorAll(".modal-open");//Sélectionne tous les éléments .modal-open (boutons qui ouvrent modal1)
  const modalClose = document.querySelectorAll(".modal-close");//Sélectionne tous les boutons .modal-close (pour fermer les modales)
  const arrowBack = document.querySelector(".arrowback");
  const AddPicture = document.querySelector(".addpicture");//Sélectionne le bouton .addpicture (qui ouvre modal2 pour ajouter une image)
  const imgContainer = document.querySelector(".img-container");//sélectionne l'élément HTML où les images seront affichées
  const AddPicModal = document.querySelector(".input-addpic");//AddPicModal → Sélectionne l'input pour uploader une image (.input-addpic).
  const previewImg = document.querySelector(".import-pictures");//previewImg → Sélectionne l'endroit où l'image sera affichée (.import-pictures).
  const AddTitle = document.querySelector(".title"); //AddTitle → Sélectionne le champ texte pour le titre (.title)
  const AddCategorie = document.querySelector(".category");//Sélectionne le menu déroulant des catégories
  const Submit = document.querySelector(".valider");//Submit → Sélectionne le bouton "Valider" (.valider).
  const msgError = document.querySelector(".msg-error");
  const form = document.querySelector(".formmodal2");
  let inputCategory = ""; //inputCategory → Variable pour stocker la catégorie sélectionnée
  let inputTitle = ""; //inputTitle → Variable pour stocker le titre saisi
  let imgPreview = ""; //imgPreview → Variable pour stocker l'image sélectionnée
  //definir le token
  const token = localStorage.getItem("token"); //recuperer ce qu il y a sur le local storage
  console.log("Token d'authentification :", token);
/** -- Fin déclaration constantes et variables -- **/


/** -- Début Code exécuté au chargement du site -- **/
  document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM complètement chargé.");
    fetchCategoriesWorks(); // Charge les catégories pour créer les boutons
    fetchDataWorks(); // Charge les données des travaux pour les afficher dans la galerie
    
    // Vérifie si l'utilisateur est connecté
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const loginLink = document.getElementById("loginLink"); // Sélectionne le bouton "login/logout"

    if (isLoggedIn) {
      console.log("Utilisateur connecté.");
      loginLink.textContent = "logout"; // Change le texte en "Logout"
      loginLink.href = "#"; // Empêche la redirection inutile
      loginLink.addEventListener("click", handleLogout); // Associe la fonction de déconnexion
      showButtons(); // Affiche les boutons réservés aux utilisateurs connectés
    } else {
      console.log("Utilisateur non connecté.");
      loginLink.textContent = "login"; // Change le texte en "Login"
      loginLink.href = "./login.html"; // Redirige vers la page de connexion
      
      hideButtons(); // Cache les boutons réservés aux utilisateurs connectés
    }

    //Ouverture de la première modale
    modalOpen.forEach((trigger) => trigger.addEventListener("click", () => {
      OpenModal();
      fetchGalleryImages(); // Lorsque l'utilisateur ouvre une modale, cela déclenche fetchGalleryImages() pour afficher les images dans la modale
    }));
    //^Pour chaque élément .modal-open, on écoute le clic et exécute OpenModal()

    modalClose.forEach((trigger) => trigger.addEventListener("click", CloseModal));
    //^Ajoute un écouteur de clic à chaque bouton .modal-close

    //Si l’utilisateur veut revenir à la première modale après avoir ouvert modal2, il clique sur .arrowback
    arrowBack.addEventListener("click", () => {
      modal1.classList.add("active");
      modal2.classList.remove("active");
    });
    
    // btn ajouter des photos
    AddPicture.addEventListener("click", () => { //Quand l’utilisateur clique sur .addpicture, modal2 s'affiche, et modal1 se ferme
      modal2.classList.add("active");
      modal1.classList.remove("active");
    });

    //Bouton pour soumettre le formulaire de création d'une nouvelle image
    Submit.addEventListener("click", () => { 
      if (imgPreview && inputTitle && inputCategory) { //On vérifie ici si tous les champs sont bien remplis: choisir une image et categorie;renseignér un titre
        const formData = new FormData();// Cette partie crée un objet formData qui stocke les données à envoyer
        console.log(imgPreview, inputTitle, inputCategory);
        formData.append("image", imgPreview);
        formData.append("title", inputTitle);
        formData.append("category", inputCategory);
        console.log(formData);

        const token = localStorage.getItem("token"); //recuperer ce qu il y a sur le local storage

        console.log("Token d'authentification :", token);

        fetchDataSubmit(formData); //On appelle fetchDataSubmit(), qui va envoyer formData à l’API
        
      } else {
        msgError.innerText = "Veuillez remplir tous les champs.";
        msgError.style.color = "red";
        setTimeout(() => {
          msgError.innerText = "";
        }, 4000);
        console.log("Tous les champs ne sont pas remplis !");
      }
        
    });

    addFormListeners();
  });
/** -- Fin Code exécuté au chargement du site -- **/


/** -- Début déclaration des fonctions -- */
  function fetchDataWorks() {
    try {
        fetch("http://" + window.location.hostname + ":5678/api/works")
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erreur API : ${response.statusText}`);
          }
          return response.json(); // Convertit la réponse en format JSON
        })
        .then(dataWorks => {
            //TODO : Afficher toutes les travaux (dataWorks) dans le HTML 
          if (!dataWorks || dataWorks.length === 0) {
            console.error("Aucune donnée reçue pour les travaux.");
            return;
          }
          console.log("Données des travaux récupérées :", dataWorks);
          elementArray = dataWorks; // Stocke les travaux dans la variable globale
          AddPhotos(dataWorks); // Affiche toutes les photos dans la galerie
        });
    } catch (error) {
        console.log(error);
    }
  }

  function fetchCategoriesWorks() { 
    try {
        //Envoie une requête à l'API pour obtenir les catégories
      fetch("http://" + window.location.hostname + ":5678/api/categories")
        .then(response => {
          if (!response.ok) {
            throw new Error(`Erreur API : ${response.statusText}`);
          }
          return response.json();//Convertit la réponse en format JSON
        })
        .then(dataCategories => {
          if (!dataCategories || dataCategories.length === 0) {
            console.error("Aucune catégorie reçue depuis l'API.");
            return;
          }
          AddBtn(dataCategories);//Appeller une fonction pour ajouter les boutons de catégories
          AddEventsToFiltersButton();
          
        });
    } catch (error) {
        console.log(error);
    }
  }

  function AddBtn(categories) {//Parcourt chaque catégorie pour créer un bouton
    // Création Btn + Class
    // Vide le conteneur avant d'ajouter les boutons
    allBtn.innerHTML = ""; 
    // Ajouter le bouton "Tous" en premier
    const allButton = `<button class="btn" id="tous">Tous</button>`;
    allBtn.innerHTML += allButton;
    
    categories.forEach((element) => {
      // console.log(element.name, element.id);
      const button = `<button class="btn" id=${element.id}>${element.name}</button>`;
      allBtn.innerHTML += button;//Crée un bouton avec la classe btn et l'ajoute à l'élément allBtn en utilisant innerHTML
      // allBtn.innerHTML = button + allBtn.innerHTML
    });
  }

  function AddPhotos(photos) {
    if (!photos || photos.length === 0) {
      console.warn("Aucune photo à afficher.");
      return; // Arrête la fonction si `photos` est vide ou non défini
    }
    // Sélectionne l'élément galerie
    const galleryContainer = document.querySelector(".gallery");
    galleryContainer.innerHTML = ""; // Vider la galerie avant d'ajouter les nouvelles photos

    // Parcourt chaque photo pour créer un élément HTML
      photos.forEach((photo) => {
      // Création de l'élément figure
      const figure = `
        <figure data-category="${photo.categoryId}">
          <img src="${photo.imageUrl}" alt="${photo.title}">
          <figcaption>${photo.title}</figcaption>
        </figure>`;
      
      galleryContainer.innerHTML += figure; // Ajoute l'élément figure à la galerie
    });
  }

  //Quand j'appelle cette fonction, les evenements de clics sont rattachés aux boutons de filtres
  function AddEventsToFiltersButton(){
    document.querySelectorAll(".btn").forEach(button => {
      button.addEventListener("click", () => {
        const selectedCategory = button.id; // Récupérer l'ID de la catégorie sélectionnée
        const allPhotos = document.querySelectorAll(".gallery figure"); // Sélectionner toutes les figures dans la galerie
        const galleryContainer = document.querySelector(".gallery");
    
        // Vider la galerie avant d'afficher les photos filtrées
        galleryContainer.innerHTML = "";
    
        // Filtrer les photos directement depuis les données API
        const filteredPhotos = elementArray.filter(photo =>
        selectedCategory === "tous" || photo.categoryId === parseInt(selectedCategory)
        );

        AddPhotos(filteredPhotos); // Affiche les photos filtrées

        // Gérer la classe active pour les boutons
        document.querySelectorAll(".btn").forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
      });
    });
  }

  /** -- Fonction pour afficher les boutons si l'utilisateur est connecté -- **/
  function showButtons() {
    const allBtn = document.querySelector(".allBtn");
    const modifierProjetsContainer = document.querySelector(".modifier-projets-container");

    if (allBtn) allBtn.style.display = "flex"; // Affiche les boutons
    if (modifierProjetsContainer) modifierProjetsContainer.style.display = "flex"; // Affiche les boutons de modification
  }

  /** -- Fonction pour cacher les boutons si l'utilisateur n'est pas connecté -- **/
  function hideButtons() {
    const allBtn = document.querySelector(".allBtn");
    const modifierProjetsContainer = document.querySelector(".modifier-projets-container");

    if (allBtn) allBtn.style.display = "none"; // Cache les boutons
    if (modifierProjetsContainer) modifierProjetsContainer.style.display = "none"; // Cache les boutons de modification
  }

  /** -- Fonction pour gérer la déconnexion -- **/
  function handleLogout(event) {
    event.preventDefault(); // Empêche le rechargement de la page au clic sur "Logout"
    localStorage.removeItem("isLoggedIn"); // Supprime l'état connecté
    localStorage.removeItem("userEmail"); // Supprime l'email
    console.log("Utilisateur déconnecté.");
    location.reload(); // Recharge la page pour appliquer les changements
  }

  function OpenModal() {
    modal1.classList.add("active");//Ajoute la classe "active" à modal1, ce qui affiche la modale.
  }

  function CloseModal() { //Supprime "active" de modal1 et modal2, les rendant invisibles
    modal1.classList.remove("active");
    modal2.classList.remove("active");
  }

  function fetchGalleryImages() {
    console.log("fetchGalleryImages() exécutée"); // Vérifie si la fonction est appelée
    fetch("http://" + window.location.hostname + ":5678/api/works")
        .then(response => response.json())
        .then(data => {
            console.log("Données des images :", data); // Vérifie que les données arrivent bien
            displayImages(data);
        })
        .catch(error => console.error("Erreur lors du chargement des images :", error));
  }

  //la fonction displayImages(images), qui s'occupe d'afficher les images dans le conteneur .img-container
  function displayImages(images) {
    imgContainer.innerHTML = ""; // Nettoie le conteneur avant d’ajouter les nouvelles images


    images.forEach(image => { //Pour chaque image, le code crée et ajoute des éléments HTML à la galerie
        const figure = document.createElement("figure");//Crée un élément HTML <figure> pour organiser l’image et ses boutons
        figure.classList.add("element-modal");
        //Ajout de l’icône de suppression
        const deleteIcon = document.createElement("img");//Crée une balise <img> pour l’icône poubelle
        deleteIcon.src = "./assets/icons/bin.svg";//Définit l’image de l’icône (un fichier bin.svg)
        deleteIcon.alt = "Supprimer";//Ajoute un texte alternatif au cas où l’image ne s’afficherait pas
        deleteIcon.classList.add("logobin");
        deleteIcon.setAttribute("data-id", image.id);//Ajoute un attribut personnalisé data-id, qui stocke l'ID unique de l’image
        //Ajout de l’image
        const imgElement = document.createElement("img");//Crée une balise <img> pour afficher l’image.
        imgElement.src = image.imageUrl;//Charge l’image avec l’URL récupérée depuis image.imageUrl.
        imgElement.alt = image.title;//Ajoute un texte alternatif basé sur le titre de l’image.


        
        imgElement.classList.add("img-modal");

        const caption = document.createElement("figcaption");
        caption.textContent = "Éditer";
        //Ajout des éléments icone image et legende dans figure
        figure.appendChild(deleteIcon);
        figure.appendChild(imgElement);
        figure.appendChild(caption);

        imgContainer.appendChild(figure);//La <figure> est ajoutée au conteneur imgContainer ou tout sera afichee
    });

    // Suppression des images au clic sur l'icône poubelle
    document.querySelectorAll(".logobin").forEach(bin => { //Sélectionne toutes les icônes poubelles
        bin.addEventListener("click", () => { //Écoute le clic de l’utilisateur sur l’icône poubelle.
            deleteImage(bin.getAttribute("data-id"));//Appelle la fonction deleteImage(imageId) pour supprimer l’image.(Récupère l’ID de l’image stocké dans data-id)
        });
    });
  }

  async function fetchDataSubmit(formData) {
    try {
      // Fetch ajout des travaux
      const response = await fetch(
        "http://" + window.location.hostname + ":5678/api/works",
        {
          method: "POST", //Indique qu’on ajoute un nouvel élément
          headers: {
            Authorization: `Bearer ${token}`, //Ajoute un jeton d’authentification pour vérifier que l’utilisateur est connecté
          },
          body: formData, //Envoie les données en format FormData
        }
      );
      const dataresponse = await response.json();
      console.log(dataresponse);
      msgError.style.color = "#1D6154";
      Submit.style.background = "#1D6154";

      //Clear les galleries
      const gallery = document.querySelector(".gallery");


      gallery.innerHTML = ""; //Efface la galerie avant d’ajouter le nouveau projet
      fetchDataWorks(); //Recharge les travaux
      previewImg.style.setProperty("visibility", "hidden"); //Cache l’image d’aperçu après l’envoi
      imgContainer.style.setProperty("display", "flex");
      form.reset(); 
      //fermer la modale
      modal1.classList.remove("active"); 
      modal2.classList.remove("active");

      // Réinitialisation des variables pour une nouvelle soumission
      imgPreview = "";
      inputTitle = "";
      inputCategory = "";
      
      previewImg.src = ""; // Efface l'image affichée pour éviter qu'elle reste visible
      previewImg.style.setProperty("visibility", "hidden");
      AddTitle.value = ""; // Réinitialise le champ titre
      AddCategorie.selectedIndex = 0; // Réinitialise la sélection de catégorie

      // Désactiver le bouton "Valider" après réinitialisation
      Submit.style.backgroundColor = ""; 
      Submit.style.cursor = "default";
      Submit.disabled = true;

      setTimeout(() => {
        msgError.innerText = "";
      }, 4000);
    } catch (error) {
      console.log("Il y a eu une erreur sur le Fetch: " + error);
    }
  }

  //Suppression d’une image
  function deleteImage(imageId) {
    fetch("http://" + window.location.hostname + `:5678/api/works/${imageId}`, {
        method: "DELETE",//Envoie une requête DELETE à l’API pour supprimer une image spécifique
        headers: {
            accept: "*/*",
            Authorization: `Bearer ${token}`,
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("Échec de la suppression");
        console.log("Image supprimée :", imageId);
        fetchGalleryImages(); // Recharge la galerie après suppression
        fetchDataWorks();
    })
    .catch(error => console.error("Erreur suppression :", error));
  }

  function addFormListeners() { 
    // Ajout images
    AddPicModal.addEventListener("input", (e) => {
      console.log(AddPicModal.files[0]);
      imgPreview = e.target.files[0];
      const img = URL.createObjectURL(AddPicModal.files[0]);
      // console.log(img)
      previewImg.src = img;
      previewImg.style.setProperty("visibility", "visible");
    });

    //Titre
    AddTitle.addEventListener("input", (e) => { //Récupération du titre et de la catégorie
      inputTitle = e.target.value;
      console.log(inputTitle);
    });
    
    AddTitle.addEventListener("keyup", (e) => {
      validateForm();
    });

    AddCategorie.addEventListener("input", (e) => {
      inputCategory = e.target.selectedIndex;
      console.log(inputCategory);
    });

    // Si tout les elements sont remplies alors changements couleurs boutons !== (strictement different)
    form.addEventListener("change", () => { //Changement de couleur du bouton "Valider"
      validateForm();
    });
  }

  function validateForm(){//Quand tous les champs sont remplis, le bouton devient actif
      if (imgPreview !== "" && inputTitle !== "" && inputCategory !== "") {
        Submit.style.background = "#1D6154";
        Submit.style.cursor = "pointer";
        Submit.disabled = false ;
      } else {
        Submit.style.backgroundColor = ""; // Réinitialise la couleur par défaut du bouton
        Submit.disabled = true ;
      }
  }

/** -- Fin déclaration des fonctions -- */