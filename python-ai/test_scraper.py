import requests
from bs4 import BeautifulSoup
import fitz  # PyMuPDF
import os

url = 'https://e-thaksalawa.moe.gov.lk/lcms/mod/resource/view.php?id=15671'

# 1. Fetch resource page
print("Fetching resource page...")
res = requests.get(url, verify=False)
soup = BeautifulSoup(res.text, 'html.parser')

# 2. Find PDF link
pdf_a = soup.find('a', href=lambda x: x and x.endswith('.pdf'))
if not pdf_a:
    print("Could not find PDF link on page.")
    exit(1)

pdf_url = pdf_a['href']
print(f"Found PDF URL: {pdf_url}")

# 3. Download PDF
print("Downloading PDF...")
pdf_res = requests.get(pdf_url, verify=False)
pdf_path = "test_doc.pdf"
with open(pdf_path, 'wb') as f:
    f.write(pdf_res.content)
    
# 4. Extract Text
print("Extracting text...")
doc = fitz.open(pdf_path)
text = ""
for page in doc:
    text += page.get_text()
    
print("--- EXTRACTED TEXT ---")
print(text[:1000]) # Print first 1000 chars

# Try translating a snippet using googletrans
try:
    from googletrans import Translator
    translator = Translator()
    # Find a non-empty line
    lines = [l.strip() for l in text.split('\n') if len(l.strip()) > 3]
    if lines:
        sample = "\n".join(lines[:5])
        print(f"\n--- TRANSLATING SAMPLE ---\n{sample}")
        out = translator.translate(sample, src='si', dest='en')
        print(f"\n--- TRANSLATION ---\n{out.text}")
except Exception as e:
    print(f"Translation failed: {e}")
