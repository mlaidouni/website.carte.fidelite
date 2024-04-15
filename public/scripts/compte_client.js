$(document).ready(function () {
  /* ******************** Gestion des boutons - Général *********** */

  // Déconnexion du client
  $(document).on("click", ".client-deconnexion", function () {
    /* On envoie une requête en POST pour indiquer au serveur de déconnecter
     * le client. Le serveur se charge de rediriger l'utilisateur vers la
     * page de connexion client. On se contente donc d'afficher un message
     * de succès. */

    // Requête AJAX pour déconnecter le client
    $.ajax({
      // On envoie une requête de type POST à l'URL /gerante/compte/clients
      url: "/client/deconnexion",
      type: "POST",
      success: function (data) {
        // Si la déconnexion a réussi, on redirigie la page
        window.location.href = "/client/connexion";
      },
      error: function (error) {
        // En cas d'erreur, on affiche l'erreur dans la console
        console.error(error.responseJSON.message);
        // On affiche une alerte pour informer l'utilisateur
        alert("Une erreur est survenue lors de la déconnexion du client.");
      },
    });
  });

  /* ******************** Gestion des boutons - Accueil *********** */

  // Ajout d'un cadeau au panier
  $(document).on("click", ".add-to-panier", function () {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // L'identifiant de la card, i.e du cadeau
    let id = card.attr("id");

    $.ajax({
      type: "POST",
      url: "/client/compte/cadeau?data=accueil",
      data: { id: id },
      success: function (response) {
        // TODO: Gérer le nombre de cadeaux d'un même type pour pouvoir faire les TODO suivants
        // TODO: Supprimer la card de l'affichage si la quantité est à 0
        // TODO: Add la possibilité de sélectionner la quantité à ajouter au panier

        // On met à jour l'affichage du nombre de cadeaux dans le panier
        $(".nav-panier-counter").text(response.panier_counter);

        // On met à jour l'affichage du nombre de points
        $(".nav-points-counter").html(
          `<del>${response.points}</del> ${response.points_h}`
        );

        // TODO: On met à jour l'affichage des cadeaux
        // ... card.parent().remove();
      },
      error: function (error) {
        // En cas d'erreur, on affiche l'erreur dans la console
        console.error(error.responseJSON.message);
        // On affiche une alerte pour informer l'utilisateur
        alert("Une erreur est survenue lors de l'ajout du cadeau au panier.");
      },
    });
  });

  /* ******************** Gestion des boutons - Panier *********** */
});
