from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

fake_excuses = {
    "school": [
        "Sorry, I had a fever and couldn't make it to class.",
        "My alarm didn't go off and I missed the bus.",
        "I had a doctor's appointment that ran late.",
    ],
    "work": [
        "My internet went down during an important client call.",
        "I had a sudden migraine and couldn't focus at all.",
        "My car broke down on the way to the office.",
    ],
    "family": [
        "There was a sudden medical emergency in the family.",
        "I had to take care of a sick relative unexpectedly.",
    ],
    "social": [
        "Something urgent came up and I couldn't attend the event.",
        "I wasn't feeling well and didn't want to spread anything.",
    ]
}

@app.route("/generate_excuse", methods=["POST"])
def generate_excuse():
    data = request.get_json()
    scenario = data.get("scenario", "general")
    import random
    excuses = fake_excuses.get(scenario, ["Something unexpected happened."])
    excuse = random.choice(excuses)
    return jsonify({"excuse": excuse})

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)
