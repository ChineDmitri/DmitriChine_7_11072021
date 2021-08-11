export function login(ObjUser) {

    let options = {
        method: "post",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(ObjUser),
        credentials: "include",
    };

    return fetch("http://localhost:3000/api/auth/login", options)
        .then((res) => {
            return res.json();
        })
        .catch((err) => err)

}
