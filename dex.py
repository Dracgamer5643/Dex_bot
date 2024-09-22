from flask import Flask, render_template, request, jsonify, Response
from dex_chatting import dex_chat
import os

app = Flask(__name__)

@app.route('/', methods={'GET', 'POST'})
def dex():
    if request.method == 'POST':
        prompt = request.form.get('prompt')
        result = dex_chat(prompt)
        return jsonify({'response': f'{result}'})
    return render_template('dex.html')

if __name__ == '__main__':
    if not os.path.exists('bing_images'):
        os.makedirs('bing_images')

    app.run(debug=True, port=8080)