import os
import stripe

from dotenv import load_dotenv
from flask import Flask, jsonify, request, render_template

from stripe import PaymentIntent  

load_dotenv()

app = Flask(__name__,
  static_url_path='',
  template_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), "views"),
  static_folder=os.path.join(os.path.dirname(os.path.abspath(__file__)), "public"))

# Configure Stripe API
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')

# Home route
@app.route('/', methods=['GET'])
def index():
  return render_template('index.html')

# Get Stripe publishable key 
@app.route('/config', methods=['GET'] )
def get_config():
  return jsonify({"publishableKey":os.getenv("STRIPE_PUBLISHABLE_KEY")})

# Create payment intent when user select a book to purchase 
@app.route('/create-payment-intent', methods=['POST'])
def create_payment_intent():
  try:
    data = request.json
    amount = int(data.get('amount',0)) # Get the amount, default to 0 if no amount is provided 

    if amount <= 0:
      return jsonify({"error":"Invalid amount"}), 400 # Prevent invalid payments
    
    payment_intent = stripe.PaymentIntent.create(
      amount = amount, 
      currency = "gbp",
      automatic_payment_methods = {"enabled":True}
    )
    print(amount)
    print(f"Payment Intent Created:  {payment_intent.id}, Client Secret: {payment_intent.client_secret}")
    return jsonify({"clientSecret":payment_intent.client_secret})
  
  except Exception as e: 
    return jsonify(error=str(e)), 400


# Checkout route
@app.route('/checkout', methods=['GET'])
def checkout():
  # Just hardcoding amounts here to avoid using a database
  item = request.args.get('item')
  title = None
  amount = None
  error = None

  if item == '1':
    title = 'The Art of Doing Science and Engineering'
    amount = 2300
  elif item == '2':
    title = 'The Making of Prince of Persia: Journals 1985-1993'
    amount = 2500
  elif item == '3':
    title = 'Working in Public: The Making and Maintenance of Open Source'
    amount = 2800
  else:
    # Included in layout view, feel free to assign error
    error = 'No item selected'

  return render_template('checkout.html', title=title, amount=amount, error=error)

# Success route
@app.route('/success', methods=['GET'])
def success():
  return render_template('success.html')


if __name__ == '__main__':
  app.run(port=5000, host='0.0.0.0', debug=True)
