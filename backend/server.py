import json
import re
from flask import Flask, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import logging
from pprint import pprint
from matcher import searchAPI

import spacy

nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)
models = {}
doc = None

def loadModel(dataset ="converted_sample_dataset.json"):
    with open(dataset, "r") as f:
        data = json.load(f)
    for review in data:
        models[review['review_id']] = nlp(review['text'])


CORS(app)



@app.route('/submit', methods=['GET'])
def submit():
    pattern = request.args['pattern']
    matched = searchAPI(pattern, data=models)
    rows = []
    for index, row in enumerate(matched):
        rows.append({"id": index, "review_id": row['review_id'], "review": {"text": row['text'], "matched_parts": row['matched']}})
    
    response = {"rows": rows}
    return jsonify(response)


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    app.debug = True
    loadModel()
    app.run(host="0.0.0.0", port=8081)