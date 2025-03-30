/** -- Début déclaration constantes (const) et variables (let) -- **/
  let elementArray; // Stocke les données des travaux
  const allBtn = document.querySelector(".allBtn");//Sélectionne l'élément du DOM avec la classe allBtn
/** -- Fin déclaration constantes et variables -- **/

/** -- Début Code exécuté au chargement du site -- **/
  fetchCategoriesWorks(); // Charge les catégories pour créer les boutons
  fetchDataWorks(); // Charge les données des travaux pour les afficher dans la galerie

  

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


// Fonction pour gérer le filtrage des photos
function AddGalleryModale() {
  console.log("AddGalleryModale a été appelée");
  // Code pour gérer les fonctionnalités liées à la modale
}
/** -- Fin déclaration des fonctions -- */















