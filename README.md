# Stripe E-Commerce Payment Project (Xuan's SA Take-Home Project)
A simple e-commerce application built in Python using the Flask framework, demonstrating Stripe payment integration with Stripe's Payment Element.



## Table of Contents
- [🛠️ Build, configure and run the application](#️-build-configure-and-run-the-application)
    - [Get Started](#to-get-started)
- [📚 How does this solution work?](#-how-does-this-solution-work)
    - [Solution overview](#solution-overview)
    - [Stripe APIs, Element and Method used](#stripe-apis-element-and-method-used)
    - [Application architecture](#application-architecture)
- [🚀 Approach, 📝 Documentation & ⚠️ Challenges](#-approach--documentation--challenges)
    - [Approach](#approach)
    - [Documentation](#documentation)
    - [Challenges](#challenges)
- [🌟 Future Enhancements](#-future-enhancements)
    - [More To Do](#more-to-do)



## 🛠️ Build, configure and run the application 
### To get started
Clone the repository and run pip3 to install dependencies:

```
git clone https://github.com/XuanNiLeong/sa-takehome-project-python.git && cd sa-takehome-project-python
pip3 install -r requirements.txt
```

Rename `sample.env` to `.env` and populate it with your Stripe account's test API keys.

Then run the application locally:

```
flask run
```

Navigate to [http://localhost:5000](http://localhost:5000) to view the index page.



## 📚 How does this solution work? 
### Solution overview
1. **Book selection** – The user selects a book and clicks **Purchase** on the Index Page.
2. **Checkout initialization** – The user is redirected to the Checkout Page. The backend creates a Stripe Payment Intent by calling `/create-payment-intent`.
3. **Payment form rendering** – Stripe’s Payment Element is displayed, providing a secure and customizable payment form.
4. **User input** – The user enters their email address, chooses a payment method, and provides card details.
5. **Payment confirmation** – Once the payment is submitted and confirmed, the user is redirected to the `/success` page. This page displays a purchase confirmation including the total amount charged and the corresponding Stripe Payment Intent ID.

### Stripe APIs, Element and Method used 
- [Payment Intent API](https://docs.stripe.com/api/payment_intents/create) - Creates a PaymentIntent on the server using `stripe.PaymentIntent.create()` with the amount and currency.
- [Stripe Create Element Object](https://docs.stripe.com/js/elements_object/create) - In the browser, create an Elements instance with `stripe.elements({ clientSecret })`, then create a Payment Element with `elements.create("payment")`.
- [Stripe Submit Element Object](https://docs.stripe.com/js/elements/submit) - Validate the Payment Element form fields and collect any required data before confirming the payment using `elements.submit()`.
- [ConfirmPayment Method](https://docs.stripe.com/js/payment_intents/confirm_payment) - Confirm a PaymentIntent using data collected by the Payment Element using `stripe.confirmPayment()`.

### Application architecture 

The payment workflow follows a clear client-server-Stripe sequence:

1. **Book Selection ( Client --> )**
    - User browses the index page and selects a book to purchase.
    - Clicking **Purchase** navigates the user to the checkout page.

2. **Checkout Initialization ( --> Server --> Stripe --> )**
    - The checkout page requests a Payment Intent from the Flask backend (`/create-payment-intent`).
    - The backend creates a Payment Intent via Stripe's API and returns a `clientSecret` to the client.

3. **Payment Form ( --> Client --> )**
    - Payment Intent is returned to Client.
    - The Stripe Payment Element is displayed, initialized with the `clientSecret`.
    - User enters their email, selects a payment method, and provides card details.

4. **Payment Confirmation ( --> Stripe --> )**
    - The client submits the payment form.
    - Stripe processes the payment using `stripe.confirmPayment()`.

5. **Success Page ( --> Client )**
    - Upon successful payment, the user is redirected to the `/success` page.
    - The page shows the purchase details, including the total amount charged and the Payment Intent ID.



## 🚀 Approach, 📝 Documentation & ⚠️ Challenges
### Approach 
1. **Understand the requirements and Research Stripe APIs** - Reviewed the project brief thoroughly to understand the expected user experience and project requirements. Researched the differences between Stripe’s Payment Element and Checkout. Explored the documentations to identify the most suitable APIs and UI components for secure payment handling, focusing on Payment Intents and Stripe Elements.

2. **Plan the architecture and flow** - Mapped out a clear user journey from book selection to payment confirmation, and designed the application’s structure, including client-server interactions, API endpoints, and data flow.

3. **Iterative implementation** - Developed the application incrementally, starting with basic Flask routes and templates, then integrated the Stripe Payment APIs and Element to handle payment intent creation, submission, and confirmation.

4. **Test, debug and refine** - Simulated the payment workflow to evaluate functionality and error handling. Addressed issues identified in the [Challenges](#challenges) section and improved both the code and user interface based on testing insights and console log observations.

5. **Document and validate** - Created clear documentation of the implementation and validated the application to ensure it worked as intended.

### Documentation 
- **Initial Research**
    - [Stripe Payment Element](https://docs.stripe.com/payments/payment-element)
    - [Stripe Checkout](https://docs.stripe.com/payments/checkout) 
    - [How Stripe accepts a payment](https://docs.stripe.com/payments/accept-a-payment?platform=web&ui=elements#web-create-intent)
    - [Stripe Account Activation](https://docs.stripe.com/get-started/account/activate)
- **APIs** 
    - [Payment Intent API](https://docs.stripe.com/api/payment_intents/create)
    - [Stripe Create Element Object](https://docs.stripe.com/js/elements_object/create)
    - [Stripe Submit Element Object](https://docs.stripe.com/js/elements/submit) 
    - [ConfirmPayment Method](https://docs.stripe.com/js/payment_intents/confirm_payment)
- **Payment Element Customisation** 
    - [Appearance](https://docs.stripe.com/elements/appearance-api)
    - [Layout](https://docs.stripe.com/payments/payment-element#layout)
- **JavaScript** 
    - [Event Listener](https://www.w3schools.com/js/js_htmldom_eventlistener.asp)
    - [Changing HTML Content](https://www.w3schools.com/js/js_htmldom_eventlistener.asp)
    - [Finding HTML Elements](https://www.w3schools.com/js/js_htmldom_elements.asp)

### Challenges 
1. **Stripe Payment Element failed to mount** because `clientSecret` was undefined, preventing initialization. This occurred due to not using `JSON.stringify()` when passing the amount in the request body to `/create-payment-intent`, which caused the backend to fail in returning a valid `clientSecret`. Corrected the request by properly stringifying the body before sending it to the backend, ensuring a valid clientSecret was returned and allowing the Payment Element to initialize successfully.

2. **Failure to redirect user to the correct success page** after a successful payment.This occured as the entire `clientSecret` was mistakenly passed to the Payment Intent query. Since the `clientSecret` contains both an identifier and a secret, this caused the redirection to fail. Corrected the implementation by splitting the `clientSecret` and using only the first part (the Payment Intent ID) for the query, which enabled the redirect to the proper success page.

3. **Rusty JavaScript skills** after not doing web development for a while. There were multiple occasions where I needed to identify specific elements in the HTML page in order to remove or update values, or to trigger actions. Overcame this by referring to JavaScript documentation. 



## 🌟 Future Enhancements 
### More to do 
1. **Profiles** – Implement a user authentication system with login/signup functionality to associate payment history, wishlists, and preferences with individual accounts. This would allow the application to provide personalized book recommendations based on past purchases.

2. **Enhanced Features** – Add a shopping cart to allow users to purchase multiple items at once, include shipping details, generate invoices to be sent to the user’s email, and handle refunds. This would improve the checkout experience and streamline order processing.

3. **Webhook Handling** – Implement Stripe's webhook handling to automatically update payment status, trigger order fulfillment, and manage refunds in real-time, improving reliability and automation.

4. **Database Integration** – Integrate product information with a real database, such as CosmosDB, to manage products, prices, and inventory. This would make the application more scalable and easier to maintain.


