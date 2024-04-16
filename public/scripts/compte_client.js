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
        // On vide la ligne contenant la liste des cadeaux
        $(".list-cadeaux").empty();
        // Puis on la rempli avec les cadeaux achetables
        let cadeaux = response.cadeaux;
        for (let i = 0; i < cadeaux.length; i++) {
          let cadeau = cadeaux[i];
          // On crée une card pour chaque cadeau
          let card = `<div class="col mb-4">
          <div id="${cadeau.cadeaux_id}" class="card">
            <img
              class="card-img-top"
              src="/images/${cadeau.image}"
              alt="${cadeau.image}"
            />
            <div class="card-body">
              <h5 class="card-title">${cadeau.nom}</h5>
              <p class="card-text">${cadeau.prix} €</p>
              <details>
                <summary>Plus d'informations</summary>
                <p class="card-text"></p>
              </details>
              <button
                id="${cadeau.cadeaux_id}"
                class="btn btn-success add-to-panier"
                type="button"
                >Ajouter au panier</button
              >
            </div>
          </div>
        </div>`;

          /* On ajoute le détails du cadeau. $(card) est un objet jQuery créé à
          partir de la card, nécessaire pour utiliser la fonction find(). */
          let details = $(card).find("details");
          if (cadeau.taille)
            details.append(
              `<p class="card-text">Taille : ${cadeau.taille}</p>`
            );
          if (cadeau.couleur) card;
          details.append(
            `<hr /><p class="card-text">Couleur : ${cadeau.couleur}</p>`
          );
          if (cadeau.couleur) card;
          details.append(
            `<hr /><p class="card-text"> ${cadeau.description}</p>`
          );

          // Une fois entièrement créée, on ajoute la card
          $(".list-cadeaux").append(card);
        }
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
