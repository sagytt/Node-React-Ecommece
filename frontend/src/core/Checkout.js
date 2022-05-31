import React, {useState, useEffect} from 'react';
import {isAuthenticated} from '../auth';
import {Link} from 'react-router-dom';
import {emptyCart} from './CartHelpers'
import {getBrainTreeClientToken, processPayment} from "./apiCore";
import DropIn from "braintree-web-drop-in-react";


const Checkout = ({products}) => {
    const [data, setData] = useState({
        success: false,
        clientToken: null,
        error: '',
        instance: {},
        address: ''
    })

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getBrainTreeClientToken(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
                setData({...data, error: data.error});
            } else {
                console.log(data);
                setData({clientToken: data.clientToken});
            }
        });
    };


    useEffect(() => {
        getToken(userId, token);
    }, []);

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };

    const showCheckout = () => {
        return isAuthenticated() ? (
            <div>{showDropIn()}</div>
        ) : (
            <Link to="/signin">
                <button className="btn btn-primary">Sign in to checkout</button>
            </Link>
        )
    }

    const buy = () => {
        //send the nonce to your server
        //nonce = data.instance.requestPaymentMethod
        let nonce;
        let getNonce = data.instance.requestPaymentMethod()
            .then(data => {
                nonce = data.nonce
                //once you have nonce (card type, card number) send nonce as 'paymentMethodNonce'
                //and also total to be charged

                const paymentData = {
                    paymentMethodNonce: nonce,
                    amount: getTotal(products)
                }

                processPayment(userId, token, paymentData)
                    .then(response => {
                        setData({...data, success: response.success})
                    })
                emptyCart(() => {
                    console.log('payment success and empty cart')
                })
                    .catch(error => console.log(error))
            })
            .catch(error => {
                console.log('dropin error', error)
                setData({...data, error: error.message})
            })
    }

    const showDropIn = () => (
        <div onBlur={() => setData({...data, error: ""})}>
            {data.clientToken !== null && products.length > 0 ? (
                <div>
                    <DropIn options={{
                        authorization: data.clientToken
                    }} onInstance={instance => (data.instance = instance)}/>
                    <button onClick={buy} className="btn btn-success btn-block">Pay</button>
                </div>
            ) : null}
        </div>
    );

    const showError = error => (
        <div className="alert alert-danger" style={{display: error ? '' : 'none'}}>
            {error}
        </div>
    );

    const showSuccess = success => (
        <div className="alert alert-info" style={{display: success ? '' : 'none'}}>
            Thanks! Your payment was successful!
        </div>
    );

    return (<div>
            <h2>Total: ${getTotal()}</h2>
            {showSuccess(data.success)}
            {showError(data.error)}
            {showCheckout()}
        </div>
    );
}

export default Checkout

