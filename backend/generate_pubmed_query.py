# scripts/generate_pubmed_query.py

from mistralai import Mistral
import os
import sys
import json
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Access the MISTRAL_API_KEY
api_key = os.getenv("MISTRAL_API_KEY")

def main():
    if len(sys.argv) < 3:
        print(json.dumps({"error": "Not enough arguments. Usage: python generate_pubmed_query.py <description> <answers_json>"}))
        sys.exit(1)

    description = sys.argv[1]
    answers_json = sys.argv[2]

    try:
        answers = json.loads(answers_json)
    except json.JSONDecodeError:
        print(json.dumps({"error": "Answers must be a valid JSON string."}))
        sys.exit(1)

    if not api_key:
        print(json.dumps({"error": "MISTRAL_API_KEY environment variable not set."}))
        sys.exit(1)

    try:
        client = Mistral(api_key=api_key)
        model = "mistral-large-latest"

        prompt = '''Work as an assistant for a medical reviewer doing a literature review. Using the following description and answers to follow-up questions, please generate a relevant PubMed query
        for the topic. Don't only use basic keywords, include synonyms. Please strictly provide a query that can be used in a PubMed search.
        An example is '''

        examples='''
        Please strictly provide a query that can be used in a PubMed search, with AND and OR operators. Limit your answer to the query only as shown in the example
        Output example and format:

        (Physical Activity OR exercise OR physical activity) AND (Type 2 Diabetes Mellitus OR type 2 diabetes OR T2DM) AND (Adult OR middle-aged OR aged)
        '''

        full_prompt = prompt + "\n\nDescription:\n" + description + "\n\nAnswers:\n" + examples + json.dumps(answers)

        chat_response = client.chat.complete(
            model=model,
            messages=[{"role": "user", "content": full_prompt}],
            temperature=0,
            max_tokens=1000,
            random_seed=0
        )
        generated_query = chat_response.choices[0].message.content

        print(generated_query)

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
