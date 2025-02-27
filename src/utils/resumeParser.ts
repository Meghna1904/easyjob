import { TokenizerEn, StopwordsEn } from '@nlpjs/lang-en';

interface ParsedResume {
  name: string;
  email: string;
  mobile: string;
  parsedText: string;
  skills: string[];
  predicted_field?: string;
}

// Tokenize and remove stopwords using nlp.js
function tokenizeAndRemoveStopwords(text: string): string[] {
  const tokenizer = new TokenizerEn();
  const stopwords = new StopwordsEn();

  const tokens = tokenizer.tokenize(text, true); // Tokenize
  return stopwords.removeStopwords(tokens); // Remove stopwords
}

// Extract skills from text
function extractSkillsFromText(text: string, tokens: string[]): string[] {
  const commonSkills = [
    'javascript', 'python', 'react', 'node', 'typescript', 'html', 'css',
    'java', 'c++', 'sql', 'mongodb', 'aws', 'docker', 'kubernetes',
    'machine learning', 'data analysis', 'git', 'rest api', 'graphql',
  ];

  return tokens.filter(token =>
    commonSkills.includes(token.toLowerCase())
  );
}

// Predict job field (placeholder logic)
function predictJobField(text: string): string {
  if (text.toLowerCase().includes('software')) {
    return 'Software Engineering';
  } else if (text.toLowerCase().includes('data')) {
    return 'Data Science';
  } else if (text.toLowerCase().includes('devops')) {
    return 'DevOps';
  } else {
    return 'General';
  }
}

// Extract name from text (improved logic)
function extractName(text: string): string {
  // Placeholder logic - replace with actual name extraction
  const nameMatch = text.match(/[A-Z][a-z]+ [A-Z][a-z]+/);
  return nameMatch ? nameMatch[0] : 'Unknown';
}

// Extract email from text
function extractEmail(text: string): string {
  const emailRegex = /[\w.-]+@[\w.-]+\.\w+/;
  const emailMatch = text.match(emailRegex);
  return emailMatch ? emailMatch[0] : '';
}

// Extract mobile number from text
function extractMobile(text: string): string {
  const mobileRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const mobileMatch = text.match(mobileRegex);
  return mobileMatch ? mobileMatch[0] : '';
}

// Process resume text to extract relevant information
export function processResumeText(text: string): ParsedResume {
  const filteredTokens = tokenizeAndRemoveStopwords(text);

  // Extract name, email, and mobile number
  const name = extractName(text);
  const email = extractEmail(text);
  const mobile = extractMobile(text);

  // Extract skills
  const skills = extractSkillsFromText(text, filteredTokens);

  // Predict job field
  const predicted_field = predictJobField(text);

  return {
    name,
    email,
    mobile,
    parsedText: filteredTokens.join(' '),
    skills,
    predicted_field,
  };
}

// Extract text from PDF (placeholder - use pdfjs-dist)
async function extractPdfText(file: File): Promise<string> {
  // Placeholder - replace with actual PDF text extraction
  return 'Sample PDF text';
}

// Extract text from DOCX (placeholder - use mammoth)
async function extractDocxText(file: File): Promise<string> {
  // Placeholder - replace with actual DOCX text extraction
  return 'Sample DOCX text';
}

// Main function to parse resume
export async function parseResume(file: File): Promise<ParsedResume> {
  let text = '';

  try {
    if (file.name.endsWith('.pdf')) {
      text = await extractPdfText(file);
    } else if (file.name.endsWith('.docx')) {
      text = await extractDocxText(file);
    } else {
      throw new Error('Unsupported file format');
    }

    return processResumeText(text);
  } catch (error) {
    console.error('Error parsing resume:', error);
    throw new Error('Failed to parse resume');
  }
}

export default parseResume;