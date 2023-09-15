import StripeData from "stripe";
import { useState } from "react";
import ReactSelect from "react-select";
import React, { useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { loadStripe } from "@stripe/stripe-js";
import { BsArrowLeftShort } from "react-icons/bs";
import { BiDollar, BiEuro } from "react-icons/bi";
import { PiCurrencyInrDuotone } from "react-icons/pi";
import { ToastContainer, toast } from "react-toastify";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
const config = require('../config.js');
const Stripe = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [inputValues, setInputValues] = useState({});
  const [paymentBtn, setPaymentBtn] = useState(true);
  const [icon, setIcon] = useState(<BiDollar />);
  const [nameField, setNameField] = useState(true);
  const [emailField, setEmailField] = useState(true);
  const [productValue, setProductValue] = useState({});
  const [amountField, setAmountField] = useState(false);
  const [contactValue, setContactctValue] = useState({});
  const [buttonActive, setbuttonActive] = useState(true);
  const [productField, setProductField] = useState(false);
  const [continueToPay, setContinueToPay] = useState(false);
  const [productDisplay, setProductDisplay] = useState(true);
  const [currency, setCurrency] = useState({ label: "USD", value: "usd" });
  const options = [
    { label: "USD", value: "usd" },
    { label: "INR", value: "inr" },
    { label: "EUR", value: "eur" },
  ];
  loadStripe(config.STRIPE_PUBLISHKEY);

  const handleProductDetails = (el) => {
    el.preventDefault();
    const { product, amount, currency } = el.target;
    setProductValue({
      product: product.value,
      amount: amount.value,
      currency: currency.value,
    });
  };

  useEffect(() => {
    if (productValue.product === "") {
      setProductField(true);
    }
    if (productValue.amount === "") {
      setAmountField(true);
    }
    if (productValue.product !== "" && productValue.amount !== "") {
      setProductDisplay(false);
      setContinueToPay(true);
    }
    if (productValue.product === undefined) {
      setProductDisplay(true);
      setContinueToPay(false);
      setProductField(true);
    }
    if (productValue.amount === undefined) {
      setProductDisplay(true);
      setContinueToPay(false);
      setAmountField(true);
    }
  }, [productValue]);

  const backToProduct = () => {
    setProductDisplay(true);
    setContinueToPay(false);
  };

  const payment = async (product, amount, currency, paymentMethod) => {
    try {
      const stripe = StripeData(config.STRIPE_SECRETKEY);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100,
        currency: currency,
        description: product,
        payment_method_types: [paymentMethod],
      });
      return `${paymentIntent.client_secret}`;
    } catch (el) {
      console.log(el);
    }
  };
  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    const { name, email } = e.target;
    if (name.value === "") {
      setNameField(true);
    }
    if (email.value === "") {
      setEmailField(true);
    }
    if (!stripe || !elements) {
      return;
    }
    const clientSecret = await payment(
      productValue.product,
      productValue.amount,
      productValue.currency,
      "card"
    );
    const { paymentIntent: result, error } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: name.value,
            email: email.value,
            address: {
              line1: "123 Main St.",
              line2: "Apt. 4",
              city: "Anytown",
              state: "CA",
              postal_code: "12345",
              country: "US",
            },
          },
        },
      }
    );
    if (error) {
    } else if (result.status === "succeeded") {
      console.log(result);
      setInputValues({});
      setContactctValue({});
      setCurrency({ label: "USD", value: "usd" });
      setProductDisplay(true);
      setContinueToPay(false);
      toast.success("Payment Success...!", {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }
  };

  const handleInputField = (el) => {
    const name = el.target.name;
    const value = el.target.value;
    setInputValues((prev) => ({
      ...prev,
      [`${name}`]: value,
    }));
  };

  useEffect(() => {
    if (currency.value === "usd") {
      setIcon(<BiDollar />);
    } else if (currency.value === "eur") {
      setIcon(<BiEuro />);
    } else {
      setIcon(<PiCurrencyInrDuotone />);
    }

    setInputValues((prev) => ({
      ...prev,
      currency: currency.value,
    }));
  }, [currency]);

  useEffect(() => {
    if (inputValues.product !== "") {
      setProductField(false);
    } else {
      setProductField(true);
    }
    if (inputValues.amount !== "") {
      setAmountField(false);
    } else {
      setAmountField(true);
    }
    if (
      inputValues.product !== "" &&
      inputValues.amount !== "" &&
      inputValues.product !== undefined &&
      inputValues.amount !== undefined
    ) {
      setbuttonActive(false);
    } else {
      setbuttonActive(true);
    }
  }, [inputValues]);

  const handleContctDetails = (el) => {
    const value = el.target.value;
    const name = el.target.name;
    setContactctValue((prev) => ({
      ...prev,
      [`${name}`]: value,
    }));
  };

  useEffect(() => {
    if (contactValue.name !== "") {
      setNameField(false);
    } else {
      setNameField(true);
    }
    if (contactValue.email !== "") {
      setEmailField(false);
    } else {
      setEmailField(true);
    }
    if (
      contactValue.name !== "" &&
      contactValue.email !== "" &&
      contactValue.name !== undefined &&
      contactValue.email !== undefined
    ) {
      setPaymentBtn(false);
    } else {
      setPaymentBtn(true);
    }

    if (contactValue.name === undefined) {
      setNameField(false);
    }

    if (contactValue.email === undefined) {
      setEmailField(false);
    }
  }, [contactValue]);

  return (
    <>
      <div className="stripePayment">
        <div className="stripe__content">
          <ToastContainer />
          {productDisplay && (
            <form
              className="handleProductDetails"
              onSubmit={handleProductDetails}
            >
              <h2>Stripe Payment Integration</h2>
              <div className="d--flex">
                <div className="input__field">
                  <label htmlFor="product">Product Name : </label>
                  <input
                    type="text"
                    id="product"
                    name="product"
                    value={inputValues.product}
                    placeholder="Enter product..."
                    onChange={handleInputField}
                  />
                  {productField && <p>*Please fill the required field</p>}
                </div>
                <div className="input__field">
                  <label htmlFor="price">Product Price : </label>
                  <input
                    type="number"
                    id="price"
                    name="amount"
                    value={inputValues.amount}
                    onChange={handleInputField}
                    placeholder="Enter price..."
                  />
                  {amountField && <p>*Please fill the required field</p>}
                </div>
              </div>
              <label>Select currency</label>
              <ReactSelect
                name="currency"
                onChange={(el) => {
                  setCurrency(el);
                }}
                value={currency}
                options={options}
              />
              <button>Continue</button>
            </form>
          )}
          {continueToPay && (
            <form
              className="handleConfirmPayment"
              onSubmit={handleConfirmPayment}
            >
              <button
                type="button"
                onClick={backToProduct}
                className="back__To__Product"
              >
                <BsArrowLeftShort />
              </button>
              <div>
                <button type="button" className="g__pay">
                  <span>G</span>Pay
                </button>
                <div className="card__field">
                  <p className="or__card">Or Pay with card</p>
                  <hr />
                </div>
                <div className="input__field">
                  <label htmlFor="name">Name : </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactValue.name}
                    onChange={handleContctDetails}
                    placeholder="Enter Your Name..."
                  />
                  {nameField && <p>*Please fill the required field</p>}
                </div>
                <div className="input__field">
                  <label htmlFor="email">Email : </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactValue.email}
                    onChange={handleContctDetails}
                    placeholder="Enter Your E-mail..."
                  />
                  {emailField && <p>*Please fill the required field</p>}
                </div>
                <CardElement />
                <button className="payment__btn">
                  Pay {icon} {inputValues.amount}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default Stripe;
