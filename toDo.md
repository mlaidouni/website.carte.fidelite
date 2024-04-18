# To do

## A faire (style)

- [x] Rendre le texte du dropdown client blanc (ou plus lisibles)
- [x] Ajouter du padding entre les boutons (notamment modifier, supprimer etc dans le compte gérante)
- [x] Les inputs dépassent de la card lorsqu'on tente une modification.
- [x] N'afficher les boutons que lorsque la card est survolée (voir exemple sur le site de la fnac.)
- [x] Le titre des sections (comme 'Liste des clients', 'Liste des cadeaux') doit être centré et stylisé.
- [x] Fixer la taille des images des card, notamment pour les cadeaux, pcq là c'est du grand n'importe quoi.
- [x] Ajouter du padding entre les boutons de l'ajout de client/cadeau dans la gérante.

## A faire (gestion d'erreur et affichage)

- [ ] Gérer l'affichage graphique des erreurs, un peu comme pour la page de connexion (par ex, avec des alertes).
- [x] Lorsqu'il y a une erreur lors d'une modif de client, les input ne partent pas alors que le bouton valider part. Pour reproduire cette erreur: modifier un client -> changer le numéro avec plus de 10 chiffres -> valider.
- [x] Gérer l'erreur dans le cas où le client ne s'est pas connecté. Pour reproduire cette erreur: se déconnecter -> revenir à la page précédente -> recharger la page.

## A faire (correction et fonctionnalités)

- [x] Certaines colonnes sont encore écrites en dur dans le code de gestion_personnes et gestion_cadeaux.
- [x] Pour la suppression, il faut vérifier que le client existe avant de le supprimer. **UTILE ??**
- [x] Modification des images des cadeaux.
- [x] Problème lors de la mise à jour d'un client. Pour reproduire cette erreur: se connecter avec un client. Puis changer le nb de points côté gérante, et reload côté client. rien ne change.
- [x] **Gérer l'insertion par type (normal/spécial) !**
- [x] Problème de mise à jour de l'affichage des points (y'a un `<del>` alors que points)
- [ ] gestion des stock
      a

## A faire (exigences du sujet)

- [ ] Ajouter les menus déroulants pour les caractéristiques des cadeaux. Ces caractéristiques doivent modifier l'id de la card qui représente le cadeau, id qui sera pris en compte lors de l'ajout du cadeau au panier.
- [x] au début de la connection, vérifier si la date = DATE_NAISSANCE du client, afficher animation
  - [x] si oui, on **ajoute** des cadeaux spéciaux au client
- [x] affichage des cadeaux actuellements dans le panier
  - [x] **bouton** pour **supprimer** un cadeau du panier
  - [x] **bouton** pour **vider** le panier
- [x] **bouton** pour valider le panier
  - [x] **mise à jour** du nombre de points
  - [x] **vider le panier**

> [!CAUTION]  
> ![alt text](toDo.png)

## Page d'accueil

- [x] Affichage d'une image pour la connection de la gérante
  - [x] cliquer sur l'image $\to$ redirection vers la page de connection de la gérante
- [x] Affichage d'une image pour la connection du client
  - [x] cliquer sur l'image $\to$ redirection vers la page de connection du client

## Côté client

> [!NOTE]  
> Toutes les URI sont en `/client/...`

### Page de connection

- [x] formulaire: un **identifiant unique** avec un **mot de passe**
- [x] si l'identifiant existe et que le mot de passe est correct, on **redirige vers la page de compte**

<!-- Alignement -->

### Page de compte

- [x] affichage du **nombre de points**
- [ ] au début de la connection, vérifier si la date = DATE_NAISSANCE du client
  - [ ] si oui, on **ajoute** des cadeaux spéciaux au client
    - _FIXME: Comment ajouter des cadeaux, alors que l'on affiche toujours tous les cadeaux dont les points est $\le$ points du client et que ces cadeaux spéciaux ne sont pas dans la BD, ou du moins, pas partagés._
- [x] affichage de la **liste des cadeaux disponibles** pour elle
  - [x] CADEAUX.prix $\le$ CLIENT.points
- [x] **bouton** pour **ajouter** un cadeau dans le panier
- [x] **pseudo mise à jour** des points à chaque ajout dans le panier: c'est à dire qu'on affiche le nombre de points, et le nombre de points hypothétique à côté, à chaque ajout dans le panier.
  - [x] **affichage** du nombre de cadeaux dans le panier
- [x] chaque cadeau est représenté par une **image, un nom, un prix en points**
  - [x] **menu déroulant** pour spécifier les caractéristiques du cadeau

### Page du panier

- [ ] affichage des cadeaux actuellements dans le panier
  - [ ] **bouton** pour **supprimer** un cadeau du panier
  - [ ] **bouton** pour **vider** le panier
- [ ] **bouton** pour valider le panier
  - [ ] **mise à jour** du nombre de points
  - [ ] **vider le panier**

## Côté gérante

> [!NOTE]  
> Toutes les URI sont en `/gerante/...`

### Page de connection

- [x] formulaire: un **identifiant unique** avec un **mot de passe**
- [x] si l'identifiant existe et que le mot de passe est correct, on **redirige vers la page de compte**

### Page de compte

- [x] voir la liste des clients
- [x] ajouter un client
- [x] supprimer un client
- [x] modifier un client (points, ...)
- [ ] ajouter un cadeau
- [x] supprimer cadeau
- [x] modifier un cadeau
- [x] voir la liste des cadeaux

---

## Architecture

- 1 page `accueil.html`:

```html
<a href="https://localhost:8080/client/connexion">
  <img src="...img_client..." />
</a>
<a href="https://localhost:8080/gerante/connexion">
  <img src="...img_gerante..." />
</a>
```

- 1 page `connexion.ejs` (même page pour connexion client et gerante)  
  un formulaire avec `utilisateur` et `motdepasse`. Le nom d'utilisateur des clients est utilisé comme id dans la table `personnes`.
- 1 page `compte_client.ejs`:
  - affichage du nombre de points
  - affichage des cadeaux actuellements dans le panier (comment est stocké le panier ??)
  - bouton pour switcher entre la page de compte et la page d'achat des cadeaux
  - boutons pour supprimer / vider / valider le panier (comment faire pour mettre à jour les points lorsque le bouton est cliqué ??)
- 1 page `compte_client.ejs`:
  - bouton pour switcher entre la page de compte et la page d'achat des cadeaux
  - affichage de la liste des cadeaux disponibles pour elle
  - bouton pour ajouter un cadeau dans le panier
  - pseudo mise à jour des points à chaque ajout dans le panier
  - chaque cadeau est représenté par une image, un nom, un prix en points
  - menu déroulant pour spécifier les caractéristiques du cadeau
- 1 page `compte_gerante.ejs`:
  - menu de navigation, pour gérer soit les clients, soit les cadeaux
  - voir la liste des clients
  - boutons sur chaque client pour modifier / supprimer
  - bouton pour ajouter client -> redirection vers un formulaire ???
  - boutons pour ajouter (par caracteristiques) / supprimer (par cadeau_id) un cadeau
- module `gestion_personnes`:  
  voir liste / ajouter / supprimer / modifier client. Utilisé pour trouver les personnes (clients / gérante) lors de la connexion.
- module `gestion_cadeaux`: ajouter / supprimer cadeaux
- script `serveur.js`:
  - route `client/connexion` -> redirection vers la route `client/compte`
  - route `client/compte` -> render la page `compte_client.ejs`
  - route `client/achat` -> render la page `compte_client.ejs`
  - route `gerante/connexion` -> redirection vers la route `gerante/compte`
  - route `gerante/compte` -> render la page `compte_gerante.ejs`
