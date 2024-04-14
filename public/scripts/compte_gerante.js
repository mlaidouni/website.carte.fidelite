/* NOTE: Explication des requêtes PUT et PATCH
 * PUT: mise à jour de toutes les informations d'une source
 * PATCH: Mise à jour de certaines informations */

// TODO: NETTOYER CE CODE

$(document).ready(function () {
  // Par défaut, les boutons "Annuler" sont cachés
  $(".client-reset").hide();
  $(".cadeau-annule").hide();

  /* ******************** Gestion des boutons des card - Cadeaux *********** */

  // Suppression: Sélection de tous les boutons de classe "cadeau-delete"
  $(document).on("click", ".cadeau-delete", function () {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // L'identifiant de la card, i.e du cadeau
    let id = card.attr("id");

    // Requête AJAX pour supprimer le cadeau
    $.ajax({
      // On envoie une requête de type DELETE à l'URL /gerante/compte/cadeaux
      url: `/gerante/compte/cadeaux?id=${id}`,
      type: "DELETE",
      // Lorsqu'on a reçu une réponse du serveur, on exécute cette fonction
      success: function (data) {
        // Si la suppression dans la BD a réussi, on supprime entièrement la card,
        // i.e la card elle-même et la colonne qui la contient
        if (data.success) card.parent().remove();
        // Sinon, on affiche une erreur dans la console
        else console.log("compte_gerante.js: cadeau-delete.click(): Erreur !");
      },
      // En cas d'erreur, on affiche l'erreur dans la console
      error: function (error) {
        console.error("Erreur:", error);
      },
    });
  });

  // Modification: Sélection de tous les boutons de classe "cadeau-update"
  $(document).on("click", ".cadeau-update", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // Si le bouton dit "Modifier", on transforme les span en input
    if ($(this).text() === "Modifier") {
      // Pour chaque champ, on remplace le span par un input de type text, avec
      // avec les mêmes classes et valeurs
      card.find("span").each(function () {
        let input = $("<input>", {
          type: "text",
          class: $(this).attr("class"),
          value: $(this).text(),
        });
        $(this).replaceWith(input);
      });

      // On change le bouton
      $(this).text("Valider");
      // On change le style du bouton
      $(this).removeClass("btn-dark").addClass("btn-success");
    }

    // Si le bouton dit "Valider", on envoie les modifications au serveur
    else {
      // L'identifiant de la card, i.e de l'élément
      let id = card.attr("id");

      // Les nouvelles valeurs pour le cadeau
      let newValues = {};
      card.find("input").each(function () {
        // On récupère l'attribut (la classe) et la valeur correspondant
        newValues[$(this).attr("class")] = $(this).val();
      });

      // Requête AJAX pour mettre à jour l'élément
      $.ajax({
        // On envoie une requête de type PUT à l'URL /gerante/compte/cadeaux
        url: `/gerante/compte/cadeaux?id=${id}`,
        // Voir le commentaire en ligne 1
        type: "PUT",
        // Les nouvelles valeurs à envoyer
        data: newValues,
        success: function (data) {
          // Si l'update dans la BD a réussi, on transforme les input en span
          if (data.success) {
            card.find("input").each(function () {
              let span = $("<span>", {
                class: $(this).attr("class"),
                text: $(this).val(),
              });
              $(this).replaceWith(span);
            });
          } else {
            console.log("compte_gerante.js: cadeau-update.click(): Erreur !");
          }
        },
        error: function (error) {
          console.error("Erreur:", error);
        },
      });

      // On change le bouton
      $(this).text("Modifier");
      // On change le style du bouton
      $(this).removeClass("btn-success").addClass("btn-dark");
    }
  });

  /* ******************** Gestion des boutons des card - Clients *********** */

  // Suppression: Sélection de tous les boutons de classe "client-delete"
  $(".client-delete").click(function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // L'identifiant de la card, i.e du client
    let id = card.attr("id");

    // Requête AJAX pour supprimer le client
    $.ajax({
      // On envoie une requête de type DELETE à l'URL /gerante/compte/clients
      url: `/gerante/compte/clients?id=${id}`,
      type: "DELETE",
      // Lorsqu'on a reçu une réponse du serveur, on exécute cette fonction
      success: function (data) {
        // Si la suppression dans la BD a réussi, on supprime entièrement la card,
        // i.e la card elle-même et la colonne qui la contient
        if (data.success) card.parent().remove();
        // Sinon, on affiche une erreur dans la console
        else console.log("compte_gerante.js: client-delete.click(): Erreur !");
      },
      // En cas d'erreur, on affiche l'erreur dans la console
      error: function (error) {
        console.error("Erreur:", error);
      },
    });
  });

  // TODO: Ajouter le bouton "Annuler", pour annuler les modifications
  // Modification: Sélection de tous les boutons de classe "client-update"
  $(document).on("click", ".client-update", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // Si le bouton dit "Modifier", on transforme les span en input
    if ($(this).text() === "Modifier") {
      // Pour chaque champ, on remplace le span par un input de type text, avec
      // avec les mêmes classes et valeurs
      card.find("span").each(function () {
        let input = $("<input>", {
          type: "text",
          class: $(this).attr("class"),
          value: $(this).text(),
        });
        $(this).replaceWith(input);
      });

      // On affiche le bouton "Annuler" de la card
      card.find(".client-reset").show();
      // On change le bouton
      $(this).text("Valider");
      // On change le style du bouton
      $(this).removeClass("btn-dark").addClass("btn-success");
    }

    // Si le bouton dit "Valider", on envoie les modifications au serveur
    else {
      // L'identifiant de la card, i.e de l'élément
      let id = card.attr("id");

      // Les nouvelles valeurs pour le client
      let newValues = {};
      card.find("input").each(function () {
        // On récupère l'attribut (la classe) et la valeur correspondant
        newValues[$(this).attr("class")] = $(this).val();
      });

      // Requête AJAX pour mettre à jour l'élément
      $.ajax({
        // On envoie une requête de type PUT à l'URL /gerante/compte/clients
        url: `/gerante/compte/clients?id=${id}`,
        // Voir le commentaire en ligne 1
        type: "PUT",
        // Les nouvelles valeurs à envoyer
        data: newValues,
        success: function (data) {
          // Si l'update dans la BD a réussi, on transforme les input en span
          if (data.success) {
            card.find("input").each(function () {
              let span = $("<span>", {
                class: $(this).attr("class"),
                text: $(this).val(),
              });
              $(this).replaceWith(span);
            });
          } else {
            console.log("compte_gerante.js: client-update.click(): Erreur !");
          }
        },
        error: function (error) {
          console.error("Erreur:", error);
        },
      });

      // On affiche le bouton "Annuler" et on cache le bouton "Supprimer"
      card.find(".client-annule").hide();
      // On change le bouton
      $(this).text("Modifier");
      // On change le style du bouton
      $(this).removeClass("btn-success").addClass("btn-dark");
    }
  });

  $(document).on("click", ".client-add", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // Si le bouton dit "Ajouter Client", on la transforme en formulaire
    card.empty();
    //Le corps de la card où on ajoute les élements du formulaire
    let form = $("<form>", {
      class: "card-body",
      method: "post",
      action: "/gerante/compte/clients",
    });
    // Ajouter les champs du formulaire
    let champs = [
      "userID",
      "password",
      "nom",
      "prenom",
      "email",
      "telephone",
      "dateNaissance",
      "points",
    ];
    champs.forEach(function (champ) {
      form.append(
        $("<input>", {
          type: "text",
          class: "form-control " + champ,
          name: champ,
          placeholder: champ,
          required: true,
        })
      );
    });

    // Ajouter les boutons Valider et Annuler
    form.append(
      $("<button>", {
        text: "Valider",
        class: "btn btn-success client-valider-ajout",
        type: "submit",
      })
    );
    form.append(
      $("<button>", {
        text: "Annuler",
        class: "btn btn-warning client-annule-ajout",
        type: "button",
      })
    );

    card.html(form);
    // Ajouter ici le gestionnaire pour le bouton Valider pour envoyer les données...
  });

  // Si l'ajout de client est annulé
  $(document).on("click", ".client-annule-ajout", function (e) {
    let card = $(this).closest(".card");
    card.empty(); // Efface le contenu actuel de form
    let form = $("<div>", {
      class: "card-body d-flex justify-content-center align-items-center",
    });
    // Restaure le bouton "Ajouter cadeau" dans form
    form.append(
      '<button id="add_cadeau" class="btn btn-success client-add" type="button">Ajouter Client</button>'
    );
    card.html(form);
  });

  $(document).on("submit", ".client-valider-ajout", function (e) {
    console.log("Ajout en cours");
    let card = $(this).closest(".card");

    // Les nouvelles valeurs pour le client
    let newValues = {};
    card.find("input").each(function () {
      // On récupère l'attribut (la classe) et la valeur correspondant
      newValues[$(this).attr("name")] = $(this).val();
      console.log(newValues[$(this).attr("name")]);
    });

    // Requête AJAX pour mettre à jour l'élément
    $.ajax({
      // On envoie une requête de type POST à l'URL /gerante/compte/clients
      url: "/gerante/compte/clients",
      // Voir le commentaire en ligne 1
      type: "POST",
      // Les nouvelles valeurs à envoyer
      data: newValues,
      success: function (data) {
        console.log("Client ajouté");
        // Une fois le client ajouté, on recharge la page
      },
      error: function (error) {
        console.error("Erreur:", error);
      },
    });
  });

  // FIXME: Retirer et ça, et effectuer plutôt un remplacement du bouton "supprimer"
  // Annulation: Sélection de tous les boutons de classe "client-annule"
  $(document).on("click", ".client-annule", function (e) {
    // La card représentant le client
    let card = $(this).closest(".card");

    // L'id du client
    let id = card.attr("id");

    // La liste des input
    let input = card.find("input");

    input.each(function () {});

    $.get(`/gerante/compte/clients/?id=${id}`, (data) => {
      // Pour chaque attribut à modifier
      for (let attr in data) {
        // On cherche dans la liste, l'input qui le représente
        input.each(function () {
          if ($(this).attr("class") === attr) {
            let span = $("<span>", {
              class: $(this).attr("class"),
              text: data[attr],
            });
            // Puis on remplace l'input par le span
            $(this).replaceWith(span);
          }
        });
      }
    });
  });
  /* ********************  ******************** */
});
