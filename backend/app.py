from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
import os
import PyPDF2
from docx import Document
import re
import spacy
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from datetime import date

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")

# Configure upload folder
UPLOAD_FOLDER = 'easyjob/backend/uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Predefined skill list (expand with JD analysis)
skill_db = set(["HTML", "CSS", "JavaScript", "Python", "SQL", "Java", "AWS", "React", "Node.js", "Excel"])

# Load pre-scraped jobs
try:
    with open("easyjob/backend/jobs.json", "r") as f:
        jobs = json.load(f)
except FileNotFoundError:
    jobs = []

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def extract_contact_info(text):
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    email = re.findall(email_pattern, text)
    phone_pattern = r'\b(?:\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b'
    phone = re.findall(phone_pattern, text)
    return email, phone

def parse_pdf(file_path):
    with open(file_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""
    return text

def parse_docx(file_path):
    doc = Document(file_path)
    text = ""
    for paragraph in doc.paragraphs:
        text += paragraph.text + "\n"
    return text

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['resume']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            # Extract text based on file type
            if filename.endswith('.pdf'):
                text = parse_pdf(file_path)
            elif filename.endswith('.docx'):
                text = parse_docx(file_path)
            
            # Extract contact info
            emails, phones = extract_contact_info(text)

            # NLP Parsing with SpaCy
            doc = nlp(text)

            # Section Detection with Regex
            sections = {}
            current_section = None
            for line in text.split("\n"):
                line = line.strip()
                if not line:
                    continue
                if re.match(r"^(Skills|Experience|Education|Work History|Projects)\b", line, re.IGNORECASE):
                    current_section = line.split(":")[0].lower()
                    sections[current_section] = []
                elif current_section:
                    sections[current_section].append(line)

            # Extract Skills
            skills_text = " ".join(sections.get("skills", []))
            skills_doc = nlp(skills_text)
            skills = [token.text for token in skills_doc if token.text in skill_db]
            if not skills:  # Fallback
                skills = [token.text for token in doc if token.text in skill_db]

            # Extract Experience
            experience = sections.get("experience", []) or sections.get("work history", [])
            if not experience:
                experience = [sent.text.strip() for sent in doc.sents if re.search(r"experience|intern|worked|employed", sent.text.lower())]

            # Extract Education
            education = sections.get("education", [])
            if not education:
                education = [sent.text.strip() for sent in doc.sents if re.search(r"university|college|degree|bachelor|master", sent.text.lower())]

            # Match with Jobs
            resume_text = " ".join(skills)
            matches = []
            for job in jobs:
                vectors = TfidfVectorizer().fit_transform([resume_text, job["desc"]])
                match = cosine_similarity(vectors[0], vectors[1])[0] * 100
                if match > 50:
                    matches.append({"title": job["title"], "match": round(match, 2), "link": job["link"]})

            # Clean up
            os.remove(file_path)

            # Return JSON for API and render template for UI
            return jsonify({
                'success': True,
                'data': {
                    'emails': emails,
                    'phone_numbers': phones,
                    'skills': skills,
                    'experience': experience,
                    'education': education,
                    'matches': matches
                }
            })
        
        except Exception as e:
            if os.path.exists(file_path):
                os.remove(file_path)
            return jsonify({'error': str(e)}), 500
    
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)