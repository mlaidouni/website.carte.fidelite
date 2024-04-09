$(document).ready(function () {
  /* ******************** Gestion des boutons des card - Cadeaux ******************** */

  // Suppression: Sélection de tous les boutons de classe "cadeau-delete"
  $(".cadeau-delete").click(function (e) {
    // La carte représentant l'élément
    let card = $(this).closest(".card");

    // L'identifiant de la carte, i.e de l'élément
    let id = card.attr("id");

    // Requête AJAX pour supprimer l'élément
    $.ajax({
      // On envoie une requête DELETE à l'URL /gerante/compte/cadeaux?id=id
      url: `/gerante/compte/cadeaux?id=${id}`,
      type: "DELETE",
      // Lorsqu'on a reçu une réponse du serveur, on exécute cette fonction
      success: function (data) {
        // Si la suppression dans la BD a réussi, on supprime entièrement la carte,
        // i.e la carte elle-même et la colonne qui la contient
        if (data.success) card.parent().remove();
        else console.log("compte_gerante.js: cadeau-delete.click(): Erreur !");
      },
      // En cas d'erreur, on affiche l'erreur dans la console
      error: function (error) {
        console.error("Erreur:", error);
      },
    });
  });

  /* ******************** Gestion des boutons des card - Clients ******************** */

  // Suppression: Sélection de tous les boutons de classe "cadeau-delete"
  $(".client-delete").click(function (e) {
    // La carte représentant l'élément
    let card = $(this).closest(".card");

    // L'identifiant de la carte, i.e de l'élément
    let id = card.attr("id");

    // Requête AJAX pour supprimer l'élément
    $.ajax({
      // On envoie une requête DELETE à l'URL /gerante/compte/cadeaux?id=id
      url: `/gerante/compte/clients?id=${id}`,
      type: "DELETE",
      // Lorsqu'on a reçu une réponse du serveur, on exécute cette fonction
      success: function (data) {
        // Si la suppression dans la BD a réussi, on supprime entièrement la carte,
        // i.e la carte elle-même et la colonne qui la contient
        if (data.success) card.parent().remove();
        else console.log("compte_gerante.js: client-delete.click(): Erreur !");
      },
      // En cas d'erreur, on affiche l'erreur dans la console
      error: function (error) {
        console.error("Erreur:", error);
      },
    });
  });
});
