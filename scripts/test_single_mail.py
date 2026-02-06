import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr

# --- CONFIGURACIÓN ---
SMTP_SERVER = "smtp.hostinger.com"
SMTP_PORT = 465
SMTP_USER = input("User: ")
SMTP_PASSWORD = input("Pass: ")

SENDER_NAME = "Aurora Academy"
SENDER_EMAIL = SMTP_USER 

TEMPLATE_FILE = "scripts/template.html"

def load_template():
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
        return f.read()

def send_test():
    to_email = "laurasalustro@gmail.com"
    name = "Laura" # Nombre de prueba
    
    server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
    server.login(SMTP_USER, SMTP_PASSWORD)
    
    template = load_template()
    
    msg = MIMEMultipart()
    msg['From'] = formataddr((SENDER_NAME, SENDER_EMAIL))
    msg['To'] = to_email
    msg['Subject'] = f"{name}, es momento de elevar el estándar de tus finanzas."

    body = template.replace("{{Nombre}}", name)
    body = body.replace("{{Email}}", to_email) 

    msg.attach(MIMEText(body, 'html'))
    
    server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
    server.quit()
    print("Test email sent!")

if __name__ == "__main__":
    send_test()
