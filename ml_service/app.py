from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np

app = Flask(__name__)
CORS(app) # Taaki Node.js backend se requests block na hon

# 1. Model (Brain) ko load karo
with open('dropout_model.pkl', 'rb') as f:
    model = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Node.js se data receive karo
        data = request.json
        
        # Features ko correct order mein array mein convert karo
        # Order: attendance, cgpa, backlogs, assignments, fees_paid
        features = np.array([[
            data['attendance'],
            data['cgpa'],
            data['backlogs'],
            data['assignments'],
            data['fees_paid']
        ]])
        
        # 2. Prediction: Probability nikalte hain (0 to 1)
        # model.predict_proba humein batata hai ki kitne percent chance hain
        prediction_proba = model.predict_proba(features)
        
        # Dropout hone ki probability (Class 1)
        risk_percent = round(prediction_proba[0][1] * 100, 2)
        
        return jsonify({
            "status": "success",
            "ml_risk_score": risk_percent,
            "message": "Prediction successful"
        })

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

if __name__ == '__main__':
    # Flask ko port 5001 par chalate hain (Node.js 5000 par hai)
    print("🚀 ML Service running on http://localhost:5001")
    app.run(port=5001, debug=True)