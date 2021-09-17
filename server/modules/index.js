const fs = require('fs');

// fonction pour supprimé photo de utilisateur dans le file system
exports.deleteImg = (objWithKey) => {

    return new Promise((resolve, reject) => {

        const fileName = objWithKey.split('/images/')[1];
        fs.unlink(`images/${fileName}`, (err) => {
            if (err) {
                reject(err)
            }
            else {
                resolve()
            }
        });

    })

}