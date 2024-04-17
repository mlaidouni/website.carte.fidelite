# website.carte.fidelite <!-- omit in toc -->

## Table des matières <!-- omit in toc -->

1. [Base de donnée](#base-de-donnée)
   1. [Étape 1: Connectez vous à PostgreSQL](#étape-1-connectez-vous-à-postgresql)
   2. [Étape 2: Créez la base de donnée](#étape-2-créez-la-base-de-donnée)
   3. [Étape 3: Remplir la base de donnée](#étape-3-remplir-la-base-de-donnée)
   4. [Étape 4: Initaliser le mot de passe](#étape-4-initaliser-le-mot-de-passe)
   5. [Étape 4: Lancer l'application](#étape-4-lancer-lapplication)

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
> Pour changer votre mot passe PostgreSQL, exécutez la commande suivante:
>
> > `ALTER USER <votre_nom_utilisateur> WITH PASSWORD '<nouveau_mot_de_passe>';`

### Étape 4: Lancer l'application

```bash
node serveur.js
```
