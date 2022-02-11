from glob import glob
import json
import re
from flask import Flask, request, jsonify, session, redirect, url_for
from flask_cors import CORS
import logging
from pprint import pprint
from matcher import searchAPI
from matcher import chunks

import spacy
import os.path
import pickle
import os
import concurrent.futures



nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)
models = {}
doc = None



def thread_model(sub_reviews):
    thread_dictionary ={}
    for review in sub_reviews:
        thread_dictionary[review['review_id']] = nlp(review['text'])
    return thread_dictionary


def loadModel(dataset ="converted_sample_dataset.json", reload=False):
    cpus = os.cpu_count()
    global models
    pkl_exists = os.path.exists("data.pkl")
    if(reload or not pkl_exists):
        with open(dataset, "r") as f:
            data = json.load(f)
        chunk_bins = len(data)//(cpus-1)
        data_chunks = list(chunks(data, chunk_bins))
        processes = []
        with concurrent.futures.ThreadPoolExecutor(max_workers=cpus-1) as executor:
            for result in executor.map(thread_model, data_chunks):
                processes.append(result)
        with open("data.pkl", "wb") as fout:
            for res in processes:
                pickle.dump(res, fout)
                # models.update(res)
            
        #dump models into pickle
        pkl_file = open("data.pkl", "wb")
        pickle.dump(models, pkl_file)
        pkl_file.close()
    else:
        with open("data.pkl", "rb") as fin:
            while True:
                try:
                    print("loading chunk")
                    small_dict = pickle.load(fin)
                except EOFError:
                    break
                models.update(small_dict)
        # pkl_file = open("data.pkl", "rb")
        # models = pickle.load(pkl_file)


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
    # loadModel("medium_yelp_review.json")
    loadModel()
    app.run(host="0.0.0.0", port=5000)