import os
import subprocess
import sys

def generate_pdf():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    template_path = os.path.join(base_dir, 'scripts', 'cv_template.html')
    output_pdf = os.path.join(base_dir, 'assets', 'cv', 'Samuel_Bekoe_CV.pdf')
    
    os.makedirs(os.path.dirname(output_pdf), exist_ok=True)
    
    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    ]
    
    browser_exe = None
    for p in chrome_paths:
        if os.path.exists(p):
            browser_exe = p
            break
            
    if not browser_exe:
        print("Error: No headless browser found (Chrome or Edge).")
        sys.exit(1)
        
    print(f"Using browser: {browser_exe}")
    cmd = [
        browser_exe,
        "--headless=new",
        "--disable-gpu",
        f"--print-to-pdf={output_pdf}",
        "--no-pdf-header-footer",
        f"file:///{template_path.replace(os.sep, '/')}"
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(output_pdf) and os.path.getsize(output_pdf) > 1000:
        print(f"Success! Generated ATS PDF CV at: {output_pdf} ({os.path.getsize(output_pdf)} bytes)")
    else:
        print(f"Failed to generate PDF. Return code: {result.returncode}")
        print("Stderr:", result.stderr)

if __name__ == '__main__':
    generate_pdf()
