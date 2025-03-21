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
from flask_cors import CORS

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")
CORS(app)
# Configure upload folder
UPLOAD_FOLDER = 'easyjob/backend/uploads'
ALLOWED_EXTENSIONS = {'pdf', 'docx'}

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Predefined skill list (expand with JD analysis)
skill_db = set([
    "Microsoft Office", "Product Management", "Roadmap Planning", "Agile Methodologies",
    "Data Analysis", "Market Research", "Business Analytics", "Wireframing",
    "Prototyping", "SQL", "Python", "Strategic Thinking", "Stakeholder Management",
    "Leadership", "Problem Solving", "Critical Thinking", "Adaptability", "Java",
    "HTML", "CSS", "JavaScript", "Next.js", "MySQL", "MongoDB", "Git", "GitHub",
    "Figma", "Koha", "PostgreSQL", "Firebase", "Unit Testing", "TypeScript", "SSR",
    "Vercel"
])

# Load pre-scraped jobs
try:
    with open("easyjob/backend/jobs.json", "r") as f:
        jobs = json.load(f)
except FileNotFoundError:
    jobs = []

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
def parse_resume(text):
    doc = nlp(text)
    sections = {}
    current_section = None
    for line in text.split("\n"):
        line = line.strip()
        if not line:
            continue
        if re.match(r"^(Skills|Experience|Education|Certifications|Projects|Professional Experience)\b", line, re.IGNORECASE):
            current_section = line.split(":")[0].lower().replace("professional experience", "experience")
            sections[current_section] = []
        elif current_section:
            sections[current_section].append(line)

    skills_text = " ".join(sections.get("skills", [])) or text  # Use full text if skills section is empty
    skills_doc = nlp(skills_text)
    skills = list(dict.fromkeys([token.text for token in skills_doc if token.text in skill_db and len(token.text) > 2]))  # Deduplicate, filter short tokens
    if not skills:
        skills = list(dict.fromkeys([token.text for token in doc if token.text in skill_db and len(token.text) > 2]))  # Deduplicate

    experience = sections.get("experience", [])
    if not experience:
        experience = [sent.text.strip() for sent in doc.sents if re.search(r"intern|experience|worked|employed", sent.text.lower())]

    education = sections.get("education", [])
    if not education:
        education = [sent.text.strip() for sent in doc.sents if re.search(r"university|college|degree|bachelor|master|grade|institute", sent.text.lower())]

    certifications = sections.get("certifications", [])
    if not certifications and any("certification" in sent.text.lower() or "issued" in sent.text.lower() for sent in doc.sents):
        certifications = [sent.text.strip() for sent in doc.sents if re.search(r"certification|issued", sent.text.lower())]

    return skills, experience, education, certifications 

def extract_name(text):
    """Extracts the name from the resume text using multiple strategies."""
    # Strategy 1: Look at the very first line or two, which often contains the name
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if lines and len(lines[0].split()) <= 4:  # Most names are 1-4 words
        # Check if the first line doesn't contain common non-name words
        first_line = lines[0]
        non_name_words = ["resume", "cv", "curriculum", "vitae", "profile", "application"]
        if not any(word.lower() in first_line.lower() for word in non_name_words):
            return first_line
    
    # Strategy 2: Extract from email if present
    # Many people use name patterns in their email addresses
    email_pattern = r'\b([A-Za-z0-9._%+-]+)@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}\b'
    email_matches = re.findall(email_pattern, text)
    if email_matches:
        email_username = email_matches[0]
        # Extract potential name parts from email
        name_parts = re.findall(r'[A-Za-z]{3,}', email_username)
        if name_parts:
            # If we find parts that look like names in the email (3+ letters)
            # Look for these parts in the text to validate they're likely names
            for part in name_parts:
                if part.lower() not in ['mail', 'email', 'contact', 'work', 'job', 'careers', 'admin']:
                    # Search for this name part in the first few lines
                    first_text = ' '.join(lines[:5])
                    name_regex = re.compile(r'\b' + re.escape(part) + r'\b', re.IGNORECASE)
                    if name_regex.search(first_text):
                        # Find the complete name containing this part
                        for line in lines[:5]:
                            if name_regex.search(line) and len(line.split()) <= 4:
                                return line
    
    # Strategy 3: Use NER but with more context
    doc = nlp(' '.join(lines[:10]))  # Analyze first 10 lines
    
    # Look for PERSON entities
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            # Avoid misidentifying section headers as names
            if ent.text.lower() not in ["skills", "experience", "education", "algorithms", 
                                        "certifications", "projects", "work experience", 
                                        "professional experience"]:
                return ent.text
    
    # Strategy 4: Look for capitalized words in the beginning that might be a name
    for line in lines[:3]:
        words = line.split()
        if len(words) <= 4 and all(word[0].isupper() for word in words if word):
            # Check that this isn't a header
            if not any(header.lower() in line.lower() for header in 
                      ["resume", "cv", "curriculum", "vitae", "profile", "application"]):
                return line
    
    # If all strategies fail, return None
    return None
def extract_contact_info(text):
    email_pattern = r'\b[A-Za-z0-9._%+-]+@(?:[A-Za-z0-9-]+\.)+[A-Za-z]{2,}\b'
    email = re.findall(email_pattern, text)
    phone_pattern = r'(?<!\d)(?:\+?\d{1,3}[-.\s]?)?\d{6,10}(?!\d)'
    phone = [p for p in re.findall(phone_pattern, text) if len(p) in [10, 11] and p.isdigit()]  # Filter for 10-11 digit numbers
    print(f"Extracted emails: {email}, phones: {phone}")  # Debug print
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
            if filename.endswith('.pdf'):
                text = parse_pdf(file_path)
            elif filename.endswith('.docx'):
                text = parse_docx(file_path)
            print(f"Extracted text: {text}")  # Debug print
            name = extract_name(text)
            emails, phones = extract_contact_info(text)
            skills, experience, education, certifications = parse_resume(text)

            os.remove(file_path)

            return jsonify({
                'success': True,
                'data': {
                    'name': name ,
                    'emails': emails,
                    'phone_numbers': phones,
                    'skills': skills,
                    'experience': experience,
                    'education': education,
                    'certifications': certifications
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