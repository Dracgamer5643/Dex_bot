from flask import Flask, render_template, request, jsonify, Response
from dex_chatting import dex_chat
from gtts import gTTS
import io

app = Flask(__name__)

@app.route('/', methods={'GET', 'POST'})
def dex():
    if request.method == 'POST':
        prompt = request.form.get('prompt')
        result = dex_chat(prompt)
        return jsonify({'response': f'{result}'})
    return render_template('dex.html')

@app.route('/say', methods=['POST'])
def say():
    if request.method == 'POST':
        text = request.form['text']
        if text:
            tts = gTTS(text=text, lang='en')
            audio_stream = io.BytesIO()
            tts.save(audio_stream)
            audio_stream.seek(0)

        return Response(audio_stream, mimetype='audio/mpeg')
    return "No text provided", 400

if __name__ == '__main__':
    app.run(debug=True, port=8080)