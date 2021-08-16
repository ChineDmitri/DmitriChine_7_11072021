
// send request sans fichier
export function sendRequest(url, method, body = null) {

    if (method === "GET") {

        let options = {
            method: method,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            credentials: "include",
        };

        return fetch(url, options)
            .then((res) => {
                return res.json();
            })
            .catch((err) => err)

    } else {

        let options = {
            method: method,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: body !== null ? JSON.stringify(body) : null, // si body null on fait pas JSON.stringify
            credentials: "include",
        };

        return fetch(url, options)
            .then((res) => {
                return res.json();
            })
            .catch((err) => err)

    }

}


// send request avec form data pour le request avec le fichier (image)
export function sendRequestFD(url, method, body = null) {

    let options = {
        method: method,
        body: body,
        credentials: "include",
    };

    return fetch(url, options)
        .then((res) => {
            return res.json();
        })
        .catch((err) => err)

}
