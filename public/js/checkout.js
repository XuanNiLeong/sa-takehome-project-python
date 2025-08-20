
// Create Payment Intent 
// Get Client Secret
// Initialise Stripe Payment Element 
document.addEventListener("DOMContentLoaded", async function () {

    // Create Stripe instance 
    const publishableKeyResponse = await fetch("/config");
    const publishableKeyData = await publishableKeyResponse.json();
    stripe = Stripe(publishableKeyData.publishableKey);

    // Get amount to be paid 
    const amount = document.querySelector("#pay-button-amount").getAttribute("data-amount");

    // Notify if amount is invalid 
    if (amount <= 0) {
        document.getElementById("payment-message").innerText = "This is an invalid amount";
        return;
    }

    // Create payment intent and get client secret
    const clientSecretResponse = await fetch("/create-payment-intent", {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({amount:amount})
    });
    const clientSecretData = await clientSecretResponse.json();
    const clientSecret = clientSecretData.clientSecret;
    console.log("Amount to be paid: ", amount);
    console.log("Client secret extracted: ", clientSecret);

    // Notify if client secret not received 
    if (!clientSecret) {
        document.getElementById("payment-message").innerText = "Client Secret not received";
        return; 
    }

    // Initialise payment element and mount it to the right place in checkout.html
    // Customise the appearance and layout of Stripe Payment Element 
    const appearance = { 
        theme: 'flat',
        variables: {
            fontFamily: 'Verdana',
            fontLineHeight: '1.5',
            borderRadius: '0',
            colorBackground: '#fff',
            focusBoxShadow: 'none',
            focusOutline: '-webkit-focus-ring-color auto 1px',
            tabIconSelectedColor: 'var(--colorText)'
        },
        rules: {
            '.Input, .CheckboxInput, .CodeInput': {
            transition: 'none',
            boxShadow: 'inset -1px -1px #ffffff, inset 1px 1px #0a0a0a, inset -2px -2px #dfdfdf, inset 2px 2px #808080'
            },
            '.Input': {
            padding: '12px'
            },
            '.Input--invalid': {
            color: '#DF1B41'
            },
            '.Tab, .Block, .PickerItem--selected': {
            backgroundColor: '#dfdfdf',
            boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf'
            },
            '.Tab': {
            transition: 'none'
            },
            '.Tab:hover': {
            backgroundColor: '#eee'
            },
            '.Tab--selected, .Tab--selected:focus, .Tab--selected:hover': {
            color: 'var(--colorText)',
            backgroundColor: '#ccc'
            },
            '.Tab:focus, .Tab--selected:focus': {
            boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
            outline: 'none'
            },
            '.Tab:focus-visible': {
            outline: 'var(--focusOutline)'
            },
            '.PickerItem': {
            backgroundColor: '#dfdfdf',
            boxShadow: 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf',
            transition: 'none'
            },
            '.PickerItem:hover': {
            backgroundColor: '#eee'
            },
            '.PickerItem--highlight': {
            outline: '1px solid blue'
            },
            '.PickerItem--selected:hover': {
            backgroundColor: '#dfdfdf'
            }
        }    
    };
    const elements = stripe.elements({clientSecret, appearance});
    const options = {
        layout: {
            type: 'accordion',
            defaultCollapsed: false,
            radios: false,
            spacedAccordionItems: true
        }
    };
    const paymentElement = elements.create("payment", options);
    paymentElement.mount("#payment-element");

    // Make sure email is valid 
    function isValidEmail(email){
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    // Submit payment and redirect to confirmation page 
    const paymentForm = document.getElementById("payment-form");
    if (paymentForm) {
        paymentForm.addEventListener("submit", async(event) => {
            event.preventDefault(); // only execute action when event is triggered

            const email = document.getElementById("email").value;
            console.log(email);

            if (!isValidEmail(email)) {
                document.getElementById("payment-message").innerText = "Please enter a valid email. "
                return;
            }

            // Only retrive the payment intent id from the client secret 
            paymentIntentId = clientSecret.split("_secret")[0];
            console.log(paymentIntentId);

            // Generate the redirect url to success.html
            const url = window.location.origin + `/success?payment_intent=${paymentIntentId}&amount=${amount}`
            console.log(url);
            
            await elements.submit();
            const {error} = await stripe.confirmPayment ({
                elements,
                clientSecret, 
                confirmParams: {return_url:url}
            });

            if ({error}) {
                document.getElementById('payment-message').innerText = error.message;
            }
        });
    } else {
        console.error("Payment form doesn't exist.")
    }

});