import cohere
import secrets
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from dotenv import load_dotenv 
import os

load_dotenv()

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = secrets.token_hex(16)

key = os.getenv('COHERE_API_KEY')
co = cohere.Client(key)

CORS(app, origins="*", supports_credentials=True)

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
    data = request.get_json()
    emoji = data.get("emojiName", "")
    input_prompt = mood_prompts.get(emoji, "Write a story.")
    story = generate_story(input_prompt)
    return jsonify({"Story": story})

# to use frontend in templates and stativ folders
@app.route('/')
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)