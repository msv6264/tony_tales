import cohere
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": [
    "https://tonytales-story-generator.onrender.com",
    "http://localhost:5173"
]}})

co = cohere.Client(os.getenv('COHERE_API_KEY'))

mood_prompts = {
    "smile": "Write a joyful story. Give me the whole story without asking me any questions.",
    "neutral": "Describe a peaceful evening by the lake. Give me the whole story without asking me any questions.",
    "lovely": "Create an adventurous story about discovering a hidden treasure. Give me the whole story without asking me any questions.",
    "angry": "Write a dramatic story about someone overcoming anger. Give me the whole story without asking me any questions.",
    "crying": "Tell a touching story about someone finding hope in sadness. Give me the whole story without asking me any questions.",
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
    try:
        data = request.get_json()
        if not data or 'emojiName' not in data:
            return jsonify({"error": "Invalid input"}), 400

        emoji = data['emojiName']
        input_prompt = mood_prompts.get(emoji, "Write a story.")
        story = generate_story(input_prompt)
        return jsonify({"Story": story})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def home():
    return "✅ Tony Tales Flask backend is running!"
