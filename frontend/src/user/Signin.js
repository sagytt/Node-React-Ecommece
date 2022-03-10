import React, {useState} from "react";
import {Link, Redirect} from "react-router-dom";
import Layout from '../core/Layout'
import {API} from "../config";
import {signin, authenticate, isAuthenticated} from "../auth";

const Signin = () => {
    const [values, setValues] = useState({
        email: 'sagix515@gmail.com',
        password: 'vevos535',
        error: '',
        loading: false,
        redirectToReferrer: false
    })

    const {email, password, loading, error, redirectToReferrer} = values;
    const {user} = isAuthenticated();

    const handleChange = name => event => {
        setValues({...values, error: false, [name]: event.target.value});
    }

    const clickSubmit = (event) => {
        event.preventDefault();
        signin({email, password, loading: true})
            .then(data => {
                if (data.error) {
                    setValues({...values, error: data.error, loading: false})
                } else {
                    authenticate(data, () => {
                        setValues(
                            {
                                ...values,
                                redirectToReferrer: true
                            });
                    });
                }
            });
    }

    const signUpForm = () => (
        <form>
            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={handleChange('email')}
                       type="email" className="form-control"
                       value={email}
                />
            </div>
            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={handleChange('password')}
                       type="password" className="form-control"
                       value={password}
                />
            </div>
            <button onClick={clickSubmit} className="btn btn-primary">Submit</button>
        </form>
    )

    const showError = () => (
        <div className="alert alert-danger"
             style={{display: error ? '' : "none"}}>
            {error}
        </div>
    )
    const showLoading = () => (
        loading && (<div className="spinner-border" role="status">
            <span className="sr-only">Loading...</span>
        </div>)
    )

    const redirectUser = () => {
        if (redirectToReferrer) {
            if(user && user.role === 1){
                return <Redirect to="/admin/dashboard"/>
            }else{
                return <Redirect to="/user/dashboard"/>
            }
        }
    }
    return (
        <Layout title="Signin" description="Just signin page" className="container col-md-8 offset-md-2">
            {showLoading()}
            {showError()}
            {signUpForm()}
            {redirectUser()}
        </Layout>
    )
}

export default Signin;