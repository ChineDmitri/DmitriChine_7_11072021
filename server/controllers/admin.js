const qAdmin = require("../mysql/queryAdmin");
const qUser = require("../mysql/queryUser");


const modules = require("../modules/index");


exports.getAllUsers = (req, res, next) => {

    qAdmin.queryGetAllUsers(req.body.userId)
        .then((users) => res.status(200).json(users))
        .catch((err) => res.status(500).json(err));

};


exports.changeProfil = (req, res, next) => {

    const body = {
        memberId: req.body.memberIdChange,
        profil: req.body.profilChange
    }

    qAdmin.queryChangeProfil(body)
        .then(() => res.status(200).json({
            message: "Profil changed!",
            change: true
        }))
        .catch((err) => res.status(500).json(err));

};


exports.desavivationAndActivationUser = (req, res, next) => {

    const body = {
        memberId: req.body.memberIdChange,
        status: req.body.activeChange
    }

    qAdmin.queryDesavivationAndActivationUser(body)
        .then(() => res.status(200).json({
            active: !body.status
        }))
        .catch((err) => res.status(500).json(err));

};


exports.deleteUser = (req, res, next) => {

    qUser.queryGetOneUser(parseInt(req.params.id, 10))
        .then((user) => {
            if (user[0].profil_img_url != "http://localhost:3000/images/custom_photo_user.png" &&
                user[0].profil_img_url !== null) {
                modules.deleteImg(user[0].profil_img_url)
                    .then(() => { })
                    .catch(err => console.log(err)) // si jamais fichier n'existé pas envoyer error (par ex. 4058)
            }

            qUser.queryDeleteUser(parseInt(req.params.id, 10))
                .then(() => {
                    res.status(200).json({
                        message: "User deleted!",
                        deleted: true
                    })
                })
                .catch((err) => res.status(400).json(err));
        })
        .catch((error) => res.status(500).json({ error }));



};

