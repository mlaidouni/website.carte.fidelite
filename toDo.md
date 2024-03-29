# To do

## Fonctionnalité

- [ ] page de connection
  - [ ] URI `/gerante` pour la gérante
- [ ] page d'accueil:
  - [ ] présentation de l’ensemble des cadeaux disponible pour elle.
- [ ] page de compte de client:
  - [ ] contient entre autre le nombre de points qu’elle a accumulé
- [ ] page de gestion des cadeaux:
  - [ ] ajout / suppression / modification
  - [ ] affichage de l’ensemble des cadeaux
  - [ ] un cadeaux est défini par: nom, prix en points + taille, couleur, ... si pertienent\*
- [ ] page achat cadeau:
  - [ ] affichage des cadeaux disponibles pour le client
  - [ ] menu déroulant pour spécifier les caractéristiques du cadeau: (taille, couleur, ...)
  - [ ] mise à jour des points à chaque ajout dans le panier
- [ ] page de gestion du panier

## Conditions à respecter

- [ ] Dans la page d'accueil, afficher seulement les cadeaux avec un nombre de point $\le$ nombre de points de la cliente.

> [!WARNING]  
> Faire attention à ce que, dans la page html, l'id de l'objet html représentant le cadeau soit le même que l'id du cadeau, pour pouvoir le supprimer de la BD
