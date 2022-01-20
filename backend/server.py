import json
from flask import Flask, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import logging
from pprint import pprint
from matcher import searchAPI

app = Flask(__name__)

CORS(app)

@app.route('/submit', methods=['GET'])
def submit():
    pattern = request.args['pattern']
    matched = searchAPI(pattern)
    rows = []
    for index, row in enumerate(matched):
        rows.append({"id": index, "review_id": row['review_id'], "review": row['matched_parts']})
    
    pprint(rows[0])
    response = {"rows": rows}
    return jsonify(response)


if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG)
    app.debug = True
    app.run(host="0.0.0.0", port=5000)