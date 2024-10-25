from mistralai import Mistral
import os
import sys
import json
import re
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")

def extract_concepts(query):
    return re.findall(r'\(([^()]+)\)', query)

def generate_concept_abstraction(client, model, concept):
    prompt = f'''Given the following group of related terms, provide a single word or short phrase (maximum 3 words) that best represents the overall concept:

    Terms: {concept}

    Concept abstraction:'''

    chat_response = client.chat.complete(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=10,
        random_seed=0
    )
    return chat_response.choices[0].message.content.strip()

def main():
    if len(sys.argv) < 5:
        print(json.dumps({"error": "Not enough arguments. Usage: python generate_synonyms.py <description> <questions_json> <answers_json> <query>"}))
        sys.exit(1)

    description = sys.argv[1]
    questions = json.loads(sys.argv[2])
    answers = json.loads(sys.argv[3])
    query = sys.argv[4]

    if not api_key:
        print(json.dumps({"error": "MISTRAL_API_KEY environment variable not set."}))
        sys.exit(1)

    try:
        client = Mistral(api_key=api_key)
        model = "mistral-small-latest"

        concepts = extract_concepts(query)
        synonym_groups = []

        for concept in concepts:
            # Generate concept abstraction
            abstraction = generate_concept_abstraction(client, model, concept)

            # Generate synonyms
            prompt = f'''Based on the following information about a medical literature review, generate a list of relevant synonyms for the following concept from the PubMed query. Provide 3-5 synonyms that could be useful for expanding the search.

            Description: {description}

            Questions: {json.dumps(questions)}

            Answers: {json.dumps(answers)}

            Concept: {concept}

            Please provide the synonyms as a list of strings. Strictly do not include any other text than the list.
            
            Example: ["synonym1", "synonym2", "synonym3"]'''

            chat_response = client.chat.complete(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                max_tokens=500,
                random_seed=0
            )
            synonyms_text = chat_response.choices[0].message.content
            try:
                synonyms = json.loads(synonyms_text)
                if not isinstance(synonyms, list):
                    synonyms = []
            except json.JSONDecodeError:
                synonyms = [s.strip() for s in synonyms_text.split(',') if s.strip()]

            synonym_groups.append({
                "concept": concept,
                "abstraction": abstraction,
                "synonyms": synonyms
            })

        print(json.dumps({"synonym_groups": synonym_groups}))

    except Exception as e:
        print(json.dumps({"error": str(e), "synonym_groups": []}))
        sys.exit(1)

if __name__ == "__main__":
    main()
