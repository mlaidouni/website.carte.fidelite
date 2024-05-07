# website.carte.fidelite <!-- omit in toc -->

## Table des matières <!-- omit in toc -->

1. [Modules](#modules)
2. [Base de donnée](#base-de-donnée)
   1. [Étape 1: Connectez vous à PostgreSQL](#étape-1-connectez-vous-à-postgresql)
   2. [Étape 2: Créez la base de donnée](#étape-2-créez-la-base-de-donnée)
   3. [Étape 3: Remplir la base de donnée](#étape-3-remplir-la-base-de-donnée)
   4. [Étape 4: Initaliser le mot de passe](#étape-4-initaliser-le-mot-de-passe)
3. [Lancer l'application](#lancer-lapplication)

## Modules

Les modules suivants sont nécessaires pour lancer l'application (les versions sont celles utilisées lors du développement).

```bash
├── bootstrap@5.3.3 # Pour le design
├── canvas-confetti@1.9.2 # Pour les animations de confettis
├── dotenv@16.4.5 # Pour les variables d'environnement
├── ejs@3.1.10 # Pour les templates HTML
├── express-session@1.18.0 # Pour les sessions utilisateur
├── express@4.19.2 # Pour le serveur
├── moment@2.30.1 # Pour la gestion des dates
├── multer@1.4.5-lts.1 # Pour l'upload de fichiers
└── pg@8.11.3 # Pour la connexion à PostgreSQL
```

Pour installer tous les modules en une fois, utilisez la commande suivante

```bash
npm install bootstrap@5.3.3 canvas-confetti@1.9.2 dotenv@16.4.5 ejs@3.1.10 express-session@1.18.0 express@4.19.2 moment@2.30.1 multer@1.4.5-lts.1 pg@8.11.3
```

## Base de donnée

> [!IMPORTANT]  
> **Pré-requis**: avoir PostgreSQL installé

### Étape 1: Connectez vous à PostgreSQL

```bash
# Connectez vous au serveur PostgreSQL
psql
```

<!-- ### Étape 2: Changez le mot de passe

Dans Postgres, exécutez les commandes suivantes:

```sql
-- Une fois connecté, changez le mdp de l'utilisateur
\password
-- Entrez le nouveau mot de passe: `alo`
Enter new password for user "<votre_nom_utilisateur>": alo
Enter it again: alo
``` -->

### Étape 2: Créez la base de donnée

Sans quitter Postgres, exécutez les commandes suivantes:

```sql
DROP DATABASE IF EXISTS websitecartefidelite;
CREATE DATABASE websitecartefidelite;
\q -- Puis quittez
```

Une fois cette étape effectuée, vous pourrez vous connecter à la base de donnée `websitecartefidelite` avec la commande suivante:

```bash
psql websitecartefidelite
```

### Étape 3: Remplir la base de donnée

Pour remplir la base de donnée, connectez vous puis exécutez les commandes suivantes:

```sql
\i create.database.sql
```

### Étape 4: Initaliser le mot de passe

Dans le fichier [.env](.env), changez la valeur de la variable `PG_PASSWORD`, et mettez-y votre mot de passe PostgreSQL.

> [!TIP]  
> Pour changer votre mot passe PostgreSQL, utilisez la commande `\password`, ou exécutez la commande suivante:
>
> > `ALTER USER <votre_nom_utilisateur> WITH PASSWORD '<nouveau_mot_de_passe>';`

## Lancer l'application

Pour lancer l'application, exécutez la commande suivante:

```bash
node serveur.js
```

L'application sera accessible à l'adresse suivante: [http://localhost:8080](http://localhost:8080)
