import {API} from "../config";

export const createCategory = (userId, token, category) =>{
    console.log('im here')
    return fetch(`${API}/category/create/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(category)
    })
        .then(response =>{
            return response.json()
        })
        .catch(error =>{
            console.log(error)
        })
}
