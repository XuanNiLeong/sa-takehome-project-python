document.addEventListener("DOMContentLoaded", async() => {

  // Create Stripe instance 
  const publishableKeyResponse = await fetch("/config");
  const publishableKeyData = await publishableKeyResponse.json();
  stripe = Stripe(publishableKeyData.publishableKey);

  // Extract Payment Intent ID and Total Amount from URL 
  const urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams);
  const paymentIntentId = urlParams.get("payment_intent");
  const amount = (urlParams.get("amount") / 100).toFixed(2);

  console.log("URL Parameters: ", {paymentIntentId,amount});

  // Display total amount charged 
  if (amount) {
    document.getElementById("total-amount").innerText = amount;
  } else (
    console.error("Amount not received.")
  )

  // Display payment intent ID 
  if (paymentIntentId) {
    document.getElementById("payment-intent-id").innerText = paymentIntentId;
  } else (
    console.error("Payment intent ID not received.")
  )

});




