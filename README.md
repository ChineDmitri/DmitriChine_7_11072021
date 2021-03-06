* # Groupomania
Projet n7 de la formation Web Développeur chez OpenClassRooms.com
![](https://i.imgur.com/gvrr5gd.png)
> Le projet consiste à construire un réseau social interne pour les employés de Groupomania. Le but de cet outil est de faciliter les interactions entre collègues. Le département RH de Groupomania a laissé libre cours à son imagination pour les fonctionnalités du réseau et a imaginé plusieurs briques pour favoriser les échanges entre collègues.

* # Utiles nécessaire
1. NodeJs 14.17.6 
3. MySQL 8.0

* # Installation
1. Les ports:

    a) MySQL: **3308**;
    
    b) Server (back-end): **3000**;
    
    c) Client (front-end): **8080**;
1. Dans le fichier *MySQL-8.0my.ini* de votre client MySQL ajoutez:
    
    `innodb_autoinc_lock_mode		= 0 `
3. Dans les dossiers : *client* et *server* exécutez la commande **`npm install`**
4. Dans le dossier *server* executez commande **`npm run start`**
    >   - Listening on port 3000
    >   - Database connection --TEST: OK!
5. Dans le dossier *client* executez commande **`npm run serve`**
    >    App running at:
    >   - Local:   http://localhost:8080/ 
    >   - Network: [http://xx.xx.xx.xxx:8080/](http://localhost:8080/)
6. Par default vous avez compte administrateur
    > Email: [admin@groupomania.fr](https://www.linkedin.com/in/dmitri-chine/)
    > Password: Groupomania1

* # Fonctionnalité générale du site
1. Création des posts avec une image ou sans,
1. Commenté des posts,
1. Possibilité utilisation des émoji &#128578;
1. Espace personnalisé avec gestion du compte, avatar, et affichage des posts et des commentaires publie,
1. Espace administrateur (***Utilisation technique Drag&Drop***)
1. Les 3 catégorie utilisateur (utilisateur, administrateur, modérateur)

* # Screenshots
| [![](https://i.imgur.com/WYNAOkr.png)](https://i.imgur.com/WYNAOkr.png) | [![](https://i.imgur.com/3DJt12D.png)](https://i.imgur.com/3DJt12D.png) | [![](https://i.imgur.com/A49xqJ5.png)](https://i.imgur.com/A49xqJ5.png) | [![](https://i.imgur.com/EmETeSI.png)](https://i.imgur.com/EmETeSI.png) |
| ----------------------------------------------------------------------- | ------------------------------------ | ------------------------------------ | -----

* # Hébergement

Link: https://dcdev-groupomania.herokuapp.com/


User
Login: user1@groupomania.fr
Password: Groupomania1

Moderator
Login: moderator@groupomania.fr
Password: Groupomania1

Admin
Login: admin1@groupomania.fr
Password: Groupomania1



> Certaines fonctionnalités étaient enlevées comme suppression utilisateur, modification mode de passe et activation/désactivation fonction que comme activation.
> Heroku ne permet pas gardé image téléchargé, donc ils suppriment dans quelque delais.