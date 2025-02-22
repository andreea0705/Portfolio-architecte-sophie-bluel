/** -- Début déclaration constantes (const) et variables (let) -- **/
  let elementArray;
  const allBtn = document.querySelector(".allBtn");//Sélectionne l'élément du DOM avec la classe allBtn
/** -- Fin déclaration constantes et variables -- **/

/** -- Début Code exécuté au chargement du site -- **/
  fetchCategoriesWorks();
  fetchDataWorks();
/** -- Fin Code exécuté au chargement du site -- **/

/** -- Début déclaration des fonctions -- */
async function fetchDataWorks() {
  try {
      fetch("http://" + window.location.hostname + ":5678/api/works")
      .then(response => {
          return response.json(); // Convertit la réponse en format JSON
      })
      .then(dataCategories => {
          AddGalleryModale(dataCategories); // Appelle une fonction pour ajouter la galerie modale
      });
      // Assurez-vous que elementArray est défini quelque part dans votre code
      elementArray = dataCategories;
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
/** -- Fin déclaration des fonctions -- */

