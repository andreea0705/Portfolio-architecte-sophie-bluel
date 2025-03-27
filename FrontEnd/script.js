/** -- Début déclaration constantes (const) et variables (let) -- **/
  let elementArray;
  const allBtn = document.querySelector(".allBtn");//Sélectionne l'élément du DOM avec la classe allBtn
/** -- Fin déclaration constantes et variables -- **/

/** -- Début Code exécuté au chargement du site -- **/
  fetchCategoriesWorks();
  fetchDataWorks();

  

/** -- Fin Code exécuté au chargement du site -- **/

/** -- Début déclaration des fonctions -- */
function fetchDataWorks() {
  try {
      fetch("http://" + window.location.hostname + ":5678/api/works")
      .then(response => {
          return response.json(); // Convertit la réponse en format JSON
      })
      .then(dataWorks => {
          //TODO : Afficher toutes les travaux (dataWorks) dans le HTML 
          
          elementArray = dataWorks;
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
        return response.json();//Convertit la réponse en format JSON
      })
      .then(dataCategories => {
        AddBtn(dataCategories);//Appeller une fonction pour ajouter les boutons de catégories
        AddEventsToFiltersButton();
      });
    } catch (error) {
      console.log(error);
    }
}

function AddBtn(categories) {//Parcourt chaque catégorie pour créer un bouton
  // Création Btn + Class
  categories.forEach((element) => {
    // console.log(element.name, element.id);
    const button = `<button class="btn" id=${element.id}>${element.name}</button>`;
    allBtn.innerHTML += button;//Crée un bouton avec la classe btn et l'ajoute à l'élément allBtn en utilisant innerHTML
    // allBtn.innerHTML = button + allBtn.innerHTML
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
  
      // Parcourir toutes les photos pour filtrer
      allPhotos.forEach(photo => {
        const category = photo.querySelector("figcaption").textContent; // Récupérer la catégorie via le texte du figcaption
        
        if (selectedCategory === "tous" || category.includes(selectedCategory)) {
          galleryContainer.appendChild(photo); // Ajouter la photo correspondante
        }
      });
  
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















