
export function sendRequest(url, method, body = null) {

    let options = {
        method: method,
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(body),
        credentials: "include",
    };

    return fetch(url, options)
        .then((res) => {
            return res.json();
        })
        .catch((err) => err)

}

export function sendRequestGET(url, method) {

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

}

// //For signUp
// export function signup(ObjUser) {

//     let options = {
//         method: "post",
//         headers: {
//             "Content-Type": "application/json; charset=utf-8",
//         },
//         body: JSON.stringify(ObjUser),
//         credentials: "include",
//     };

//     return fetch("http://localhost:3000/api/auth/signup", options)
//         .then((res) => {
//             return res.json();
//         })
//         .catch((err) => err)

// }

