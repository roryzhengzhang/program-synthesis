from lib2to3.pytree import convert
from nis import match
import spacy
from spacy.matcher import Matcher
import re
import json
from pprint import pprint
import time

nlp = spacy.load("en_core_web_sm")


# nltk.download('omw-1.4')

def search2(reviews, patterns):
    '''
        texts: an array of dictionaries regarding reviews
        patterns: a group of patterns consumable by spacy matcher
    '''
    matched = []
    for review_id in reviews.keys():
        for p in patterns: 
            matched_sentences = match_pattern2(reviews[review_id], p, reviewId=review_id)
            if len(matched_sentences) > 0:
                matched.extend(matched_sentences)
    return matched

def match_pattern2(doc, pattern, reviewId):
    matcher = Matcher(nlp.vocab)

    matcher.add("Pattern", [pattern])
    matched_sentences = []
    for sent in doc.sents:
        matches = matcher(sent)
        matched_part = []
        if matches is not None and len(matches) != 0:
            for _, start, end in matches:
                matched_string = sent[start:end]
                matched_part.append(" ".join([i.text for i in matched_string]))

            matched_sentences.append({"review_id": reviewId, "text": " ".join([i.text for i in sent]), "matched": matched_part})
    return matched_sentences
    # for match_id, start, end in matches:
    #     string_id = nlp.vocab.strings[match_id]
    #     span = doc[start:end]
    #     print(match_id, string_id, start, end, span.text)

def search(reviews, patterns):
    '''
        texts: an array of dictionaries regarding reviews
        patterns: a group of patterns consumable by spacy matcher
    '''
    matched = []
    for review in reviews:
        for p in patterns: 
            matched_sentences = match_pattern(review['text'], p, review['review_id'], review['business_id'])
            if len(matched_sentences) > 0:
                matched.extend(matched_sentences)
    return matched

def match_pattern(text, pattern, reviewId, businessId):
    doc = nlp(text)
    
    matcher = Matcher(nlp.vocab)
   
    matcher.add("Pattern", [pattern])
    matched_sentences = []
    for sent in doc.sents:
        matches = matcher(sent)
        matched_part = []
        if matches is not None and len(matches) != 0:
            for _, start, end in matches:
                matched_string = sent[start:end]
                matched_part.append(" ".join([i.text for i in matched_string]))
            matched_sentences.append({"review_id": reviewId, "business_id": businessId, "text": " ".join([i.text for i in sent]), "matched": matched_part})

    return matched_sentences
    # for match_id, start, end in matches:
    #     string_id = nlp.vocab.strings[match_id]
    #     span = doc[start:end]
    #     print(match_id, string_id, start, end, span.text)

def convert_pattern(type, value=None):
    if type == "LEMMA":
        word = nlp(value)
        value = word[0].lemma_
    options = {
        "VERB": {"POS": "VERB"},
        "ADP": {"POS": "ADP"},
        "PROPN": {"POS": "PROPN"},
        "NOUN": {"POS": "NOUN"},
        "ADJ": {"POS": "ADJ"},
        "ADV": {"POS": "ADV"},
        "AUX": {"POS": "AUX"},
        "NUM": {"POS": "NUM"},
        "PRON": {"POS": "PRON"},
        "WORD": {"LOWER": value},
        "LEMMA": {"LEMMA": value},
        "WILDCARD": { "TEXT": {"REGEX": ".*"}, "OP": "*"},
        "SIGN": {"ORTH": value},
        "ENT": {"ENT_TYPE": value},
        "REG": {"TEXT": {"REGEX": value}}
    }
    pattern = options[type]
    return pattern

def identify_type(p):
    if p in ["VERB", "ADP", "PROPN", "NOUN", "ADJ", "ADV", "AUX", "PRON", "NUM"]:
        return p
    if p == "*":
        return "WILDCARD"
    if re.search(r"\[.*\]", p):
        return "LEMMA"
    if p in ["$", "%", "#", "@"]:
        return "SIGN"
    if re.search(r"^\$", p):
        return "ENT"
    if re.search(r"\(.*\)", p):
        return "REG"
    else:
        return "WORD"

def extract_value(p, type):
    if type in ["WORD", "SIGN"]:
        return p
    if type == "REG":
        result = re.search(r"\((.*)\)", p)
        value = result.group(1)
        return value
    if type == "LEMMA":
        result = re.search(r"\[(.*)\]", p)
        value = result.group(1)
        return value
    if type == "ENT":
        result = re.search(r"^\$(.*)", p)
        value = result.group(1)
        return value
    else:
        return None

# parse the user-provided pattern of DSL to the pattern in the syntax of spacy matcher  
def parse_pattern(pattern_str):
    # the pattern is connected by "+"
    global_patterns = []
    tokens = pattern_str.split("+")
    tokens = [t.strip() for t in tokens]
    if '|' in tokens[0]:
        parts = tokens[0].split('|')
        for p in parts:
            type = identify_type(p)
            value = extract_value(p, type)
            iter_parse_pattern(tokens[1:], [convert_pattern(type, value)], global_patterns)
    else:
        type = identify_type(tokens[0])
        value = extract_value(tokens[0], type)
        iter_parse_pattern(tokens[1:], [convert_pattern(type, value)], global_patterns)
    return global_patterns

def iter_parse_pattern(tokens, partial_list, global_patterns):
    # print(f"global patterns: {global_patterns}")

    if tokens is None or len(tokens) == 0:
        global_patterns.append(partial_list)
        return
    
    token = tokens[0]
    if '|' in token:
        parts = token.split('|')
        for p in parts:
            type = identify_type(p)
            value = extract_value(p, type)
            new_list = [i for i in partial_list]
            new_list.append(convert_pattern(type, value))
            iter_parse_pattern(tokens[1:], new_list, global_patterns)
    else:
        type = identify_type(tokens[0])
        value = extract_value(tokens[0], type)
        new_list = [i for i in partial_list]
        new_list.append(convert_pattern(type, value))
        partial_list.append(convert_pattern(type, value))
        iter_parse_pattern(tokens[1:], new_list, global_patterns)

def searchAPI(pattern, dataset="converted_sample_dataset.json", data=None):
    if data:
        patterns = parse_pattern(pattern)
        matched = search2(data, patterns)
        return matched
    with open(dataset, "r") as f:
        patterns = parse_pattern(pattern)
        pprint(patterns)
        data = json.load(f)
        matched = search(data, patterns)

        return matched

# if __name__ == '__main__':
#     # text = "Hello, world! Hello world! This is Zheng's test."
#     # pattern = [{"LOWER": "hello"}, {"IS_PUNCT": True}, {"LOWER": "world"}, { "TEXT": {"REGEX": ".*"}, "OP": "*"}, {"TEXT": "world"}]
#     # match_pattern(text, pattern)

#     dsl_pattern = "NOUN + * + [price]"
#     with open("converted_sample_dataset.json", "r") as f:
#         patterns = parse_pattern(dsl_pattern)
#         data = json.load(f)
#         matched = search(data, patterns)
#         pprint(matched)