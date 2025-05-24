from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import requests
import os

API_URL = "https://api-inference.huggingface.co/models/gpt2"
headers = {"Authorization": f"Bearer {os.getenv('HF_API_TOKEN')}"}

app = Flask(__name__)
CORS(app)

mood_prompts = {
    "smile": "Write a joyful story.",
    "neutral": "Describe a peaceful evening by the lake.",
    "lovely": "Create an adventurous story about discovering a hidden treasure.",
    "angry": "Write a dramatic story about someone overcoming anger.",
    "crying": "Tell a touching story about someone finding hope in sadness.",
}

@cross_origin()
def query(inputMood):
    response = requests.post(API_URL, headers=headers, json=inputMood)
    print("Status code:", response.status_code)
    print("Response content:", response.text)
    response.raise_for_status() 
    return response.json()

@cross_origin()
def generate_story(prompt):
    response = query({"inputs": prompt})
    print("Raw HF response:", response)

    if isinstance(response, list) and len(response) > 0:
        return response[0].get('generated_text', "No story generated.")
    elif isinstance(response, dict) and "error" in response:
        return f"HF API Error: {response['error']}"
    else:
        return "Error: Unexpected response format from Hugging Face."

@app.route('/data', methods=["POST"])
@cross_origin()
def sending():
    data = request.get_json()
    emoji = data.get("emojiName", "sym")

    input_prompt = mood_prompts.get(emoji)
    if not input_prompt:
        return jsonify({"error": "Invalid mood/emoji selected."}), 400

    story = generate_story(input_prompt)
    return jsonify({"Story": story})

if __name__ == "__main__":
    app.run(debug=True)