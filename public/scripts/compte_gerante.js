// FIXME: faire fonctionner ce truc
$(document).ready(function () {
  // console.log("booooooooooooooooooooooooooooooooooooooooooooooooooooooooooo");
  // Affiche un message dans la console pour vérifier que le script est bien chargé
  // Importation du module gestion_cadeaux.js
  // const gestion_cadeaux = require("./gestion_cadeaux");

  // Sélection de tous les boutons de classe "btn-delete"
  $(".btn-danger").click(function () {
    // On remonte l'arborescence du DOM pour trouver le premier élément de
    // classe "card" qui est le parent direct du bouton
    let parent = $(this).closest(".card");
    // Puis on récupère l'identifiant de cet élément
    let cadeauId = parent.attr("id");

    // Affiche l'ID du cadeau dans la console
    console.log(`Cadeau ID: ${cadeauId}`);

    // Appel de la fonction deleteCadeau avec l'ID du cadeau
    // await gestion_cadeaux.delete(cadeauId);

    $.get("/gerante/compte/cadeaux/delete", { id: cadeauId }, function (data) {
      console.log("baba");
    });
  });
});
