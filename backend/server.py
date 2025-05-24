from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173", "http://localhost:5173"], supports_credentials=True)

API_URL = "https://api-inference.huggingface.co/models/gpt2-large"
HF_API_TOKEN = os.getenv('HF_API_TOKEN')
headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}

mood_prompts = {
    "smile": "Write a joyful story.",
    "neutral": "Describe a peaceful evening by the lake.",
    "lovely": "Create an adventurous story about discovering a hidden treasure.",
    "angry": "Write a dramatic story about someone overcoming anger.",
    "crying": "Tell a touching story about someone finding hope in sadness.",
}

def query(inputMood):
    response = requests.post(API_URL, headers=headers, json=inputMood)
    return response.json()

def generate_story(prompt):
    response = query({"inputs": prompt})
    return response[0]['generated_text']

@app.route('/data', methods=["POST"])
def sending():
    data = request.get_json()
    emoji = data.get("emojiName", "")
    input_prompt = mood_prompts[emoji]
    story = generate_story(input_prompt)
    return jsonify({"Story": story})

# @app.route('/data', methods=["POST"])
# def sending():
#     data = request.get_json()
#     emoji = data.get("emojiName", "")
#     return jsonify({"Story": f"You have choosen {emoji}"})

if __name__ == "__main__":
    app.run(debug=True)