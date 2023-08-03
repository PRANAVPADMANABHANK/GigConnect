import React, { useEffect, useState } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import newRequest from "../../utils/newRequest.js";
import { useParams } from "react-router-dom";
import "./Pay.scss";
import CheckoutForm from '../../components/checkoutForm/CheckoutForm.jsx';


// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe("pk_test_51NatHjSFb6D21E8zYJxFOAgfSyv3ptVQZAsu9FcJup0ON65ZGsSmyLJjDw6dOdsSGrmHVrLzmYvRkYlzPvL3YfE200Pvcn63mD");

const Pay = () => {
    const [clientSecret, setClientSecret] = useState("");

    const { id } = useParams();

    useEffect(() => {
        const makeRequest = async () => {
            try {
                const res = await newRequest.post(`/orders/create-payment-intent/${id}`);
                console.log(res, "////////")
                setClientSecret(res.data.clientSecret);
            
            } catch (err) {
                console.log(err);
            }
        };
        makeRequest();
    }, []);

    const appearance = {
        theme: 'stripe',
    };
    const options = {
        clientSecret,
        appearance,
    };
    console.log(options,"options")
    console.log(stripePromise, "stripePromise")

    return (
        <div className="App">
            {clientSecret && (
                <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                </Elements>
            )}
        </div>
    )
}

export default Pay