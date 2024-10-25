from mistralai import Mistral
import os
import sys
import json
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("MISTRAL_API_KEY")

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

        prompt = f'''Based on the following information about a medical literature review, generate a list of relevant synonyms for the main concepts in the PubMed query. Provide 5-10 synonyms that could be useful for expanding the search.

        Description: {description}

        Questions: {json.dumps(questions)}

        Answers: {json.dumps(answers)}

        PubMed Query: {query}

        Please provide the synonyms as a list of strings. Strictly do not include any other text than the list.
        
        Example: ["synonym1", "synonym2", "synonym3"]'''  # Remove the extra single quote at the end

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
            # If the response is not valid JSON, try to extract synonyms from the text
            synonyms = [s.strip() for s in synonyms_text.split(',') if s.strip()]

        print(json.dumps({"synonyms": synonyms}))

    except Exception as e:
        print(json.dumps({"error": str(e), "synonyms": []}))
        sys.exit(1)

if __name__ == "__main__":
    main()