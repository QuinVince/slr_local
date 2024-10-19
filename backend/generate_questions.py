# scripts/generate_questions.py

from mistralai import Mistral
import os
import sys
import json
from dotenv import load_dotenv
import os

# Charge les variables d'environnement depuis le fichier .env
load_dotenv()

# Vous pouvez maintenant accéder à la variable d'environnement comme ceci :
api_key = os.getenv("MISTRAL_API_KEY")

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Not enough arguments. Usage: python generate_questions.py <description>"}))
        sys.exit(1)

    description = sys.argv[1]

    api_key = os.getenv("MISTRAL_API_KEY")
    if not api_key:
        print(json.dumps({"error": "MISTRAL_API_KEY environment variable not set."}))
        sys.exit(1)

    try:
        client = Mistral(api_key=api_key)
        model = "open-mistral-7b"

        prompt = '''You are an assistant for a medical reviewer conducting a systematic literature review. Based on the following description, generate a list of follow-up questions that will help you better understand the research needs and generate a more accurate PubMed query. The questions should be clear, concise, and aimed at clarifying the research scope. Ask maximum 3 questions, that cannot exceed 30 words each

        Description:
        '''

        full_prompt = prompt + description + "\nQuestions:"

        chat_response = client.chat.complete(
            model=model,
            messages=[{"role": "user", "content": full_prompt}],
            temperature=0.5,
            max_tokens=500,
            random_seed=0
        )
        questions_text = chat_response.choices[0].message.content.strip()

        # Convert the LLM output to a JSON array of questions
        questions = []
        for line in questions_text.split('\n'):
            line = line.strip()
            if line.startswith('- ') or line.startswith('* ') or line[0].isdigit() or line.startswith('Q:'):
                # Remove bullet points, numbering, or prefixes like 'Q:'
                if line[0].isdigit():
                    question = line.split('.', 1)[1].strip()
                elif line.startswith('Q:'):
                    question = line.split(':', 1)[1].strip()
                else:
                    question = line[2:].strip()
                questions.append(question)
            elif line:
                questions.append(line)

        # Output as JSON
        print(json.dumps({"questions": questions}))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    main()
