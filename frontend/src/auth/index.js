import {API} from "../config";

export const signup = (user) =>{
    return  fetch(`${API}/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then(response =>{
            return response.json()
        })
        .catch(error =>{
            console.log(error)
        })
}