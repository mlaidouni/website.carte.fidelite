// FIXME: faire fonctionner ce truc
$(document).ready(function () {
  // Affiche un message dans la console pour vérifier que le script est bien chargé
  console.log("aloooooooooooooooooooo");
  // Importation du module gestion_cadeaux.js
  const gestion_cadeaux = require("./gestion_cadeaux");

  // Sélection de tous les boutons de classe "btn-delete"
  $(".btn-delete").click(function () {
    // Récupération de l'ID du cadeau en utilisant l'attribut id du parent div
    let cadeauId = $(this).parent().attr("id");

    // Affiche l'ID du cadeau dans la console
    console.log(`Cadeau ID: ${cadeauId}`);

    // Appel de la fonction deleteCadeau avec l'ID du cadeau
    gestion_cadeaux.delete(cadeauId);
  });
});
