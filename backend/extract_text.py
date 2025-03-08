import PyPDF2
with open(r'C:\Users\meghn\Downloads\Resume (3).pdf', 'rb') as f:
    print(PyPDF2.PdfReader(f).pages[0].extract_text())