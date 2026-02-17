import pandas as pd
import os

DATA_FILE = "scripts/contacts.xlsx"
LOG_FILE = "scripts/sent_log.txt"

def main():
    if not os.path.exists(DATA_FILE):
        print(f"Error: {DATA_FILE} not found")
        return

    # Load sent emails
    sent_emails = set()
    if os.path.exists(LOG_FILE):
        with open(LOG_FILE, "r") as f:
            sent_emails = set(line.strip() for line in f)

    # Load contacts
    try:
        df = pd.read_excel(DATA_FILE)
    except Exception as e:
        print(f"Error reading Excel: {e}")
        return

    # Filter
    pending_gmail = 0
    total_pending = 0
    
    for index, row in df.iterrows():
        email = str(row['Email']).strip()
        
        if email in sent_emails:
            continue
            
        total_pending += 1
        
        if email.lower().endswith("@gmail.com"):
            pending_gmail += 1
            
    print(f"PENDING_GMAIL_COUNT: {pending_gmail}")
    print(f"TOTAL_PENDING_COUNT: {total_pending}")

if __name__ == "__main__":
    main()
