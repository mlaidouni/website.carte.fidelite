$(document).ready(function () {
  /* *********** Fonctions utilitaires *********** */

  // Crée un input
  function createInput(type, className, value) {
    return $("<input>", {
      type: type,
      class: className,
      value: value,
    });
  }

  // Crée un span
  function createSpan(className, text) {
    return $("<span>", {
      class: className,
      text: text,
    });
  }

  // Modifier un bouton
  function switchButton(button, text, oldClass, newClass) {
    // On change le texte du bouton
    button.text(text);
    // On change le style du bouton
    button.removeClass(oldClass).addClass(newClass);
  }

  // Envoie une requête AJAX
  function sendAJAX(url, type, data, successCb, errorTxt) {
    $.ajax({
      url: url,
      type: type,
      data: data,
      success: successCb,
      error: function (error) {
        // En cas d'erreur, on affiche l'erreur dans la console
        console.error(error.responseJSON.message);
        // On affiche une alerte pour informer l'utilisateur
        alert(`Une erreur est survenue lors de ${errorTxt}.`);
      },
    });
  }

  // Envoie d'une requête AJAX pour supprimer des données
  function delAJAX(url, successCb, errorTxt) {
    sendAJAX(url, "DELETE", null, successCb, `la suppression ${errorTxt}`);
  }

  // Envoie d'une requête AJAX pour mettre à jour des données
  function putAJAX(url, data, successCb, errorTxt) {
    sendAJAX(url, "PUT", data, successCb, `la mise à jour ${errorTxt}`);
  }

  // Envoie d'une requête AJAX pour ajouter des données
  function postAJAX(url, data, successCb, errorTxt) {
    sendAJAX(url, "POST", data, successCb, `l'ajout ${errorTxt}`);
  }

  /* *********** Gestion des boutons des card - Suppression *********** */

  // TODO: Ajouter le bouton "Annuler", pour annuler les modifications

  /**
   * Supprime un élément dans la BD et dans l'interface.
   * @param {button} button - Le bouton qui a été cliqué.
   * @param {string} urlType - Le type de l'URL (cadeaux ou clients).
   * @param {string} type - Le type de l'élément (cadeau ou client).
   */
  function deleteDbElement(button, urlType, type) {
    // La card représentant l'élément
    let card = button.closest(".card");

    // L'identifiant de la card, i.e de l'élément
    let id = card.attr("id");

    // Requête AJAX pour supprimer l'élément
    delAJAX(
      `/gerante/compte/${urlType}?id=${id}`,
      (data) => {
        /* Si la suppression dans la BD a réussi, on supprime entièrement la
         * card, i.e la card elle-même et la colonne qui la contient */
        card.parent().remove();
      },
      `du ${type}`
    );
  }

  // Suppression d'un cadeau (bouton de classe "cadeau-delete")
  $(document).on("click", ".cadeau-delete", function () {
    deleteDbElement($(this), "cadeaux", "cadeau");
  });

  // Suppression d'un client (bouton de classe "client-delete")
  $(".client-delete").click(function () {
    deleteDbElement($(this), "clients", "client");
  });

  /* *********** Gestion des boutons des card - Update *********** */

  /**
   * Met à jour l'affichage pour modifier un élément.
   * @param {*} button - Le bouton qui a été cliqué.
   * @param {*} card - La card représentant l'élément.
   */
  function updateElement(button, card) {
    /* Pour chaque champ, on remplace le span par un input de type text, avec
     * les mêmes classes et valeurs */
    card.find("span").each(function () {
      if ($(this).attr("class") === "type") {
        let select = $("<select>", {
          class: $(this).attr("class"),
          name: $(this).attr("class"),
          required: true,
        }).append(
          $("<option>", { value: "normal", text: "Normal" }),
          $("<option>", { value: "special", text: "Spécial" })
        );
        $(this).replaceWith(select);
      }
      let input = $("<input>", {
        type: $(this).attr("type"),
        class: $(this).attr("class"),
        value: $(this).text(),
      });
      $(this).replaceWith(input);
    });

    // On update le bouton
    switchButton(button, "Valider", "btn-primary", "btn-success");
  }

  /**
   * Valide la modification d'un élément dans la BD et dans l'interface.
   * @param {*} button - Le bouton qui a été cliqué.
   * @param {*} card - La card représentant l'élément.
   * @param {*} urlType - Le type de l'URL (cadeaux ou clients).
   * @param {*} type - Le type de l'élément (cadeau ou client).
   */
  function valideElement(button, card, urlType, type) {
    // L'identifiant de la card, i.e de l'élément
    const id = card.attr("id");

    // Les nouvelles valeurs pour l'élément
    const newValues = {};
    card.find("input").each(function () {
      // On récupère l'attribut (la classe) et la valeur correspondant
      newValues[$(this).attr("class")] = $(this).val();
    });
    card.find("select").each(function () {
      // On récupère l'attribut (la classe) et la valeur correspondant
      newValues[$(this).attr("class")] = $(this).val();
    });
    // Requête AJAX pour mettre à jour l'élément
    putAJAX(
      `/gerante/compte/${urlType}?id=${id}`,
      newValues,
      (data) => {
        // Si l'update dans la BD a réussi, on transforme les input en span
        card.find("input").each(function () {
          let span = createSpan($(this).attr("class"), $(this).val());
          $(this).replaceWith(span);
          // On update le bouton
          switchButton(button, "Modifier", "btn-success", "btn-primary");
        });
        card.find("select").each(function () {
          let span = createSpan($(this).attr("class"), $(this).val());
          $(this).replaceWith(span);
          // On update le bouton
          switchButton(button, "Modifier", "btn-success", "btn-primary");
        });
      },
      `du ${type}`
    );
  }

  // Modification d'un cadeau (bouton de classe "cadeau-update")
  $(document).on("click", ".cadeau-update", function () {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // Si le bouton dit "Modifier", on transforme les span en input
    if ($(this).text() === "Modifier") updateElement($(this), card);
    // Si le bouton dit "Valider", on envoie les modifications au serveur
    else valideElement($(this), card, "cadeaux", "cadeau");
  });

  // Modification d'un client (bouton de classe "client-update")
  $(document).on("click", ".client-update", function () {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // Si le bouton dit "Modifier", on transforme les span en input
    if ($(this).text() === "Modifier") updateElement($(this), card);
    // Si le bouton dit "Valider", on envoie les modifications au serveur
    else valideElement($(this), card, "clients", "client");
  });

  /* *********** Gestion des boutons des card - Ajout *********** */

  /* Ajout: Sélection de tous les boutons de classe "cadeaux-add"
   * Crée le formulaire pour l'ajout d'un cadeau. */
  $(document).on("click", ".cadeaux-add", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // On vide la card et on la transforme en formulaire
    card.empty();
    let form = $("<form>", {
      // Le formulaire est le corps de la card
      class: "card-body",
      // On envoie les données du formulaire à l'URL /gerante/compte/cadeaux
      method: "post",
      action: "/gerante/compte/cadeaux",
      // Nécessaire pour le module multer
      enctype: "multipart/form-data",
    });

    // On récupère les champs de la table nécessaire pour le formulaire
    let champs = [
      "nom",
      "prix",
      "type",
      "taille",
      "couleur",
      "description",
      "stock",
      "image",
    ];

    // Pour chaque champ, on ajoute un input au formulaire
    champs.forEach(function (champ) {
      // Les champs nom, prix et image sont obligatoires
      if (champ === "nom") {
        form.append(
          $("<input>", {
            type: "text",
            class: "form-control " + champ,
            name: champ,
            placeholder: champ,
            required: true,
          })
        );
      } else if (champ === "prix" || champ === "stock") {
        form.append(
          $("<input>", {
            type: "number",
            min: "0",
            max: "2147483647",
            class: "form-control " + champ,
            name: champ,
            placeholder: champ,
            required: true,
          })
        );
      } else if (champ === "type") {
        form.append(
          $("<select>", {
            class: "form-control " + champ,
            name: champ,
            required: true,
          }).append(
            $("<option>", { value: "normal", text: "Normal" }),
            $("<option>", { value: "special", text: "Spécial" })
          )
        );
      } else if (champ === "image") {
        form.append(
          $("<input>", {
            type: "file",
            // Nom pour être reconnu par multer et le serveur
            name: "uploaded-image",
            // On ajoute la classe "form-control-file" pour le style bootstrap
            class: "form-control-file " + champ,
            placeholder: champ,
            required: true,
          })
        );
      } else {
        form.append(
          $("<input>", {
            type: $(this).attr("type"),
            class: "form-control " + champ,
            name: champ,
            placeholder: champ,
            required: false,
          })
        );
      }
    });

    // Ajouter les boutons Valider et Annuler
    form.append(
      $("<button>", {
        text: "Valider",
        class: "btn btn-success mr-2 cadeaux-add-valider",
        type: "submit",
      })
    );
    form.append(
      $("<button>", {
        text: "Annuler",
        class: "btn btn-warning cadeaux-add-reset",
        type: "button",
      })
    );

    // On remplace le contenu actuel de la card par le formulaire
    card.html(form);
  });

  /* Ajout: Sélection de tous les boutons de classe "cadeaux-add-valider"
   * Envoie les données du formulaire au serveur pour ajouter un cadeau. */
  $(document).on("submit", ".cadeaux-add-valider", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // Les données pour le nouveau cadeau
    let data = {};
    card.find("input").each(() => {
      // On récupère l'attribut (la classe) et la valeur correspondant
      data[$(this).attr("name")] = $(this).val();
    });

    // Requête AJAX pour mettre à jour l'élément
    postAJAX(
      "/gerante/compte/cadeaux",
      data,
      (data) => {
        // Si l'ajout dans la BD a réussi, on recharge la page
        window.location.href = "/gerante/compte?data=cadeau";
      },
      "du cadeau"
    );
  });

  // Si l'ajout de cadeau est annulé
  $(document).on("click", ".cadeaux-add-reset", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // On efface le contenu actuel de la card, i.e le formulaire
    card.empty();
    // On remplace ce contenu par la card d'ajout de cadeau initiale
    let cardBody = $("<div>", {
      class: "card-body d-flex justify-content-center align-items-center",
    });

    // Création du bouton "Ajouter cadeau"
    let btnAddCadeau = $("<button>", {
      class: "btn btn-success cadeaux-add",
      type: "button",
      text: "Ajouter cadeau",
    });

    // On ajoute le bouton "Ajouter cadeau"
    cardBody.append(btnAddCadeau);

    // On remplace le contenu actuel de la card par cardBody
    card.html(cardBody);
  });

  /* Ajout: Sélection de tous les boutons de classe "clients-add"
   * Crée le formulaire pour l'ajout d'un client. */
  $(document).on("click", ".clients-add", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // On vide la card et on la transforme en formulaire
    card.empty();
    let form = $("<form>", {
      // Le formulaire est le corps de la card
      class: "card-body",
      // On envoie les données du formulaire à l'URL /gerante/compte/clients
      method: "post",
      action: "/gerante/compte/clients",
    });

    // On récupère les champs de la table nécessaire pour le formulaire
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

    // Pour chaque champ, on ajoute un input au formulaire
    champs.forEach(function (champ) {
      if (champ === "points") {
        form.append(
          $("<input>", {
            type: "number",
            min: "0",
            max: "2147483647",
            class: "form-control " + champ,
            name: champ,
            placeholder: champ,
            required: true,
          })
        );
      } else if (champ === "dateNaissance") {
        form.append(
          $("<input>", {
            type: "date",
            class: "form-control " + champ,
            name: champ,
            placeholder: champ,
            required: true,
          })
        );
      } else if (champ === "telephone") {
        form.append(
          $("<input>", {
            type: "text",
            class: "form-control " + champ,
            maxlength: "10",
            name: champ,
            placeholder: champ,
            required: true,
          })
        );
      } else {
        form.append(
          $("<input>", {
            type: "text",
            class: "form-control " + champ,
            name: champ,
            placeholder: champ,
            required: true,
          })
        );
      }
    });

    // Ajouter les boutons Valider et Annuler
    form.append(
      $("<button>", {
        text: "Valider",
        class: "btn btn-success mr-2 clients-add-valider",
        type: "submit",
      })
    );
    form.append(
      $("<button>", {
        text: "Annuler",
        class: "btn btn-warning clients-add-reset",
        type: "button",
      })
    );

    // On remplace le contenu actuel de la card par le formulaire
    card.html(form);
  });

  /* Ajout: Sélection de tous les boutons de classe "clients-add-valider"
   * Envoie les données du formulaire au serveur pour ajouter un client. */
  $(document).on("submit", ".clients-add-valider", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // Les données pour le nouveau client
    let data = {};
    card.find("input").each(function () {
      // On récupère l'attribut (la classe) et la valeur correspondant
      data[$(this).attr("name")] = $(this).val();
    });

    // Requête AJAX pour mettre à jour l'élément
    $.ajax({
      // On envoie une requête de type POST à l'URL /gerante/compte/clients
      url: "/gerante/compte/clients",
      type: "POST",
      data: data, // Les données à envoyer
      success: function (data) {
        // Si l'ajout dans la BD a réussi, le serveur à rechargé la page
        window.location.href = "/gerante/compte?data=client";
      },
      error: function (error) {
        // En cas d'erreur, on affiche l'erreur dans la console
        console.error(error.responseJSON.message);
        // On affiche une alerte pour informer l'utilisateur
        alert("Une erreur est survenue lors de l'ajout du client.");
      },
    });
  });

  // Si l'ajout de client est annulé
  $(document).on("click", ".clients-add-reset", function (e) {
    // La card représentant l'élément
    let card = $(this).closest(".card");

    // On efface le contenu actuel de la card, i.e le formulaire
    card.empty();
    // On remplace ce contenu par la card d'ajout de client initiale
    let cardBody = $("<div>", {
      class: "card-body d-flex justify-content-center align-items-center",
    });

    // Création du bouton "Ajouter client"
    let btnAddClient = $("<button>", {
      class: "btn btn-success clients-add",
      type: "button",
      text: "Ajouter client",
    });

    // On ajoute le bouton "Ajouter client"
    cardBody.append(btnAddCadeau);

    // On remplace le contenu actuel de la card par cardBody
    card.html(cardBody);
  });
});
