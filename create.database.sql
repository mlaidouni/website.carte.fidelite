-- -- Si la base de données existe, la supprimer
-- DROP DATABASE IF EXISTS WEBSITECARTEFIDELITE;

-- -- Création de la base de données website_carte_fidelite
-- CREATE DATABASE WEBSITECARTEFIDELITE;

-- -- Connection à la base de données website_carte_fidelite
-- \c WEBSITECARTEFIDELITE;

-- Suppression des tables si elles existent
DROP TABLE IF EXISTS CADEAUX;

DROP TABLE IF EXISTS PERSONNES;

-- Création de la table cadeaux
CREATE TABLE CADEAUX (
    CADEAU_ID SERIAL PRIMARY KEY, -- Identifiant du cadeau
    NOM VARCHAR(255) NOT NULL, -- Nom du cadeau
    PRIX INTEGER NOT NULL, -- Prix du cadeau en points
    TYPE VARCHAR(7) NOT NULL DEFAULT 'normal', -- Type du cadeau (normal ou special)
    TAILLE VARCHAR(255), -- Taille du cadeau (not required)
    COULEUR VARCHAR(255), -- Couleur du cadeau (not required)
    DESCRIPTION TEXT, -- Description du cadeau (not required)
    STOCK INTEGER NOT NULL, --Nombre d'élément en stock
    IMAGE VARCHAR(255) -- URL de l'image du cadeau (not required)
);

-- Création de la table personnes
CREATE TABLE PERSONNES (
    USER_ID VARCHAR(255) PRIMARY KEY, -- Identifiant de connexion de la personne
    PASSWORD VARCHAR(255) NOT NULL, -- Mot de passe de la personne
    ROLE VARCHAR(1) DEFAULT 'U', -- Role de la personne (A OU U, U par défaut)
    NOM VARCHAR(255) NOT NULL, -- Nom de la personne
    PRENOM VARCHAR(255) NOT NULL, -- Prénom de la personne
    EMAIL VARCHAR(255) NOT NULL, -- Adresse email de la personne
    TELEPHONE VARCHAR(10) NOT NULL, -- Numéro de téléphone de la personne
    DATE_NAISSANCE VARCHAR(10) NOT NULL, -- Date de naissance de la personne
    POINTS INTEGER NOT NULL -- Nombre de points de la personne
);

-- Remplissage de la table cadeaux
INSERT INTO CADEAUX (
    NOM,
    PRIX,
    TYPE,
    TAILLE,
    COULEUR,
    DESCRIPTION,
    STOCK,
    IMAGE
) VALUES (
    'Moumou le mouton',
    100,
    'special',
    '20 cm',
    'Blanc',
    'Un doudou ultra doux !',
    1,
    'moumou.png'
),
(
    'Sac à dos',
    15,
    'normal',
    NULL,
    'Bleu',
    'Sac à dos en nylon imperméable',
    3,
    'sac-a-dos.png'
),
(
    'Mug',
    6,
    'normal',
    NULL,
    NULL,
    'Mug en céramique avec motif personnalisé',
    12,
    'mug-blanc.png'
),
(
    'Clé USB',
    7,
    'normal',
    NULL,
    'Argent',
    'Clé USB 32 Go avec connecteur rétractable',
    7,
    'usb.png'
),
(
    'Parapluie',
    12,
    'normal',
    NULL,
    'Rouge',
    'Parapluie pliable avec motif floral',
    6,
    'parapluie.png'
),
(
    'Gourde',
    10,
    'normal',
    NULL,
    'Vert',
    'Gourde en acier inoxydable 500 ml',
    5,
    'kungfupanda.png'
),
(
    'Stylo',
    2,
    'normal',
    NULL,
    NULL,
    'Stylo à bille rétractable',
    6,
    'stylo.png'
),
(
    'Carnet de notes',
    11,
    'normal',
    NULL,
    'Rose',
    'Carnet de notes ligné avec couverture en cuir synthétique',
    5,
    'carnet-de-notes.png'
),
(
    'Porte-clés',
    3,
    'normal',
    NULL,
    'Jaune',
    'Porte-clés en métal avec pendentif en forme de cœur',
    912,
    'kungfupanda.png'
),
(
    'Tapis de souris',
    18,
    'normal',
    NULL,
    'Gris',
    'Tapis de souris avec surface lisse',
    2,
    'kungfupanda.png'
),
(
    'Lampe de poche',
    16,
    'normal',
    NULL,
    'Noir',
    'Lampe de poche LED compacte avec dragonne',
    8,
    'shrek_swamp.png'
),
(
    'Maillot Real Madrid',
    105,
    'special',
    'M',
    'Noir',
    'Maillot Third du Real Madrid 2023/2024',
    10,
    'real.png'
);

-- Insertion des données dans la table personnes
INSERT INTO PERSONNES (
    USER_ID,
    PASSWORD,
    ROLE,
    NOM,
    PRENOM,
    EMAIL,
    TELEPHONE,
    DATE_NAISSANCE,
    POINTS
) VALUES (
    'Akashi7',
    'password',
    'U',
    'KHEMAKHEM',
    'Ayman',
    'ayman@grimpette.fr',
    '0600000000',
    '2003-11-01',
    10
),
(
    'janad',
    'password',
    'U',
    'AYADI',
    'Jana',
    'jana@grimpette.fr',
    '0600000000',
    '2003-04-19',
    105
),
(
    'elyogangshit',
    'password',
    'A',
    'FRIEDMANN',
    'Elyo',
    'elyo@grimpette.fr',
    '0600000000',
    '2003-02-11',
    500
),
(
    'man',
    'password',
    'U',
    'BAHA',
    'Manon',
    'man@grimpette.fr',
    '0600000000',
    '2003-01-19',
    14
),
(
    'iliou',
    'password',
    'U',
    'CRAGUE',
    'Ilian',
    'iliou@grimpette.fr',
    '0600000000',
    '2004-12-14',
    4
),
(
    'nav',
    'password',
    'U',
    'SINGH',
    'Navdeep',
    'nav@grimpette.fr',
    '0600000000',
    '2003-01-01',
    6
),
(
    'villomega',
    'password',
    'U',
    'MOREL',
    'Victor',
    'morel@grimpette.fr',
    '0600000000',
    '2003-07-08',
    2
),
(
    'ralizz',
    'password',
    'U',
    'RANJALAHY',
    'Elisa',
    'elisa@grimpette.fr',
    '0600000000',
    '2003-06-10',
    13
),
(
    'kmzx',
    'password',
    'A',
    'LAIDOUNI',
    'Mohamed',
    'mohaldn@grimpette.fr',
    '0600000000',
    '2003-06-30',
    1
),
(
    'laure',
    'password',
    'U',
    'HAMME',
    'Laure',
    'lh@grimpette.fr',
    '0600000000',
    '2003-01-01',
    25
),
(
    'john.doe',
    'password',
    'U',
    'DOE',
    'John',
    'john@gmail.com',
    '0123456789',
    '2006-06-06',
    4
);