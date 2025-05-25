import cohere
import secrets
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv 
import os

load_dotenv()

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

key = os.getenv('COHERE_API_KEY')
co = cohere.Client(key)

CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

mood_prompts = {
    "smile": "Write a joyful story.",
    "neutral": "Describe a peaceful evening by the lake.",
    "lovely": "Create an adventurous story about discovering a hidden treasure.",
    "angry": "Write a dramatic story about someone overcoming anger.",
    "crying": "Tell a touching story about someone finding hope in sadness.",
}

def generate_story(prompt):
    response = co.generate(
        model='command',
        prompt=prompt,
        temperature=0.8
    )
    return response.generations[0].text.strip()

@app.route('/data', methods=["POST"])
def sending():
    data = request.get_json()
    emoji = data.get("emojiName", "")
    input_prompt = mood_prompts.get(emoji, "Write a story.")
    story = generate_story(input_prompt)
    return jsonify({"Story": story})

if __name__ == "__main__":
    app.run(debug=True)