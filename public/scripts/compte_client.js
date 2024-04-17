$(document).ready(function () {
  /* ******************** Gestion de l'anniversaire *********** */
  // Animation de l'aniversaire
  function annivAnimation() {
    // Le texte à animer
    let annivText = $(".anniv-text");
    // On récupère la largeur du texte et du div contenant le texte
    let textWidth = annivText.width();
    let divWidth = $(".anniv-div").width();
    // On place le texte à droite du div
    annivText.css({ left: divWidth });
    // On anime le texte pour le faire défiler
    annivText.animate({ left: -textWidth }, 20000, "linear", function () {
      // On replace le texte à droite du div
      annivText.css({ left: divWidth });
      // On relance l'animation
      annivAnimation();
    });

    // On fait chuter pleins de confettis depuis le haut de l'écran
    for (let i = 0; i < 10; i++) {
      confetti({
        particleCount: 200,
        spread: 70,
        startVelocity: 20,
        // Les confettis chutent progressivement
        gravity: 1,
        origin: { y: 0, x: i / 10 }, // start from different positions across the width
      });
    }
    // On lance des confetti
    confetti({
      // Nombre de particules
      particleCount: 2000,
      // Couleurs des particules
      spread: 70,
      // Les confettis remontent progressivement
      gravity: -1,
      origin: { y: 0.4 },
    });
  }

  // Requête AJAX pour obtenir la valeur de isAnniversaire
  $.ajax({
    url: "/client/isAnniversaire",
    type: "GET",
    success: function (data) {
      if (data.isAnniversaire) {
        annivAnimation();
      }
    },
  });
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
          <div id="${cadeau.cadeau_id}" class="card">
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
                id="${cadeau.cadeau_id}"
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

  $(document).on("click", ".valide-panier", function () {
    let card = $(this).closest(".container");
    card.empty();

    $.ajax({
      url: '/client/compte/panier',  // L'URL du endpoint du serveur
      type: 'GET',                          // Type de la requête HTTP
      data: {
        // Ici, vous pouvez ajouter les données que vous souhaitez envoyer au serveur.
        // Par exemple, si vous avez besoin d'envoyer des identifiants des cadeaux dans le panier :
        // cadeauxId: [123, 456, 789]
      },
      success: function (response) {
        console.log('Réponse du serveur:', response);
        // Vous pouvez également mettre à jour l'interface utilisateur ici pour confirmer que la commande a été traitée.
      },
      error: function (xhr, status, error) {
        console.error('Erreur lors de l\'envoi de la commande:', error);
      }

    });
    card.append('<h1 class = "card-body d-flex justify-content-center fw-bold text-white" >Commande envoyée</h1>');
    card.append(' <a href="/client/compte" id="return" class="btn btn-success align-items-center return" type="button" >Revenir a la page d\'achat</a>')
  });




  /* ******************** Gestion des boutons - Panier *********** */
});
