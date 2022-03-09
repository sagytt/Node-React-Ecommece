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
export const signin = user =>{
    return  fetch(`${API}/signin`, {
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

export const authenticate = (data, next) =>{
    if(typeof window !== 'undefined'){
        localStorage.setItem('jwt', JSON.stringify(data))
        next();
    }
}

export const signout = (next) =>{
    if(typeof window !== 'undefined'){
        localStorage.removeItem('jwt');
        next();

        return fetch(`${API}/signout`,{
            method: "GET",
        })
            .then(response =>{
            console.log('signout', response);
        })
            .catch(err => console.log(err));
    }
}
