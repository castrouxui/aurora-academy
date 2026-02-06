import pandas as pd
import smtplib
import time
import random
import os
import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr

# --- CONFIGURACIÓN ---
SMTP_SERVER = "smtp.hostinger.com"
SMTP_PORT = 465
SMTP_USER = input("Ingrese su correo (ej: info@auroracademy.net): ")  # Se pide al ejecutar por seguridad
SMTP_PASSWORD = input("Ingrese su contraseña SMTP: ")

SENDER_NAME = "Aurora Academy"
SENDER_EMAIL = SMTP_USER # Debe coincidir con el user autenticado

# Rate Limiting
EMAILS_PER_HOUR = 150
DELAY_MIN = 18 # Segundos
DELAY_MAX = 25 # Segundos

# Archivos
TEMPLATE_FILE = "scripts/template.html"
DATA_FILE = "scripts/contacts.xlsx" # Debe existir
LOG_FILE = "scripts/sent_log.txt"

# Modo Dry Run (True = No envía, solo simula)
DRY_RUN = False 

def load_template():
    with open(TEMPLATE_FILE, "r", encoding="utf-8") as f:
        return f.read()

def load_log():
    try:
        with open(LOG_FILE, "r") as f:
            return set(line.strip() for line in f)
    except FileNotFoundError:
        return set()

def append_to_log(email):
    with open(LOG_FILE, "a") as f:
        f.write(f"{email}\n")

def clean_name(full_name):
    if not isinstance(full_name, str):
        return "Inversor" # Fallback si no hay nombre
    
    # Tomar primer nombre y hacerlo Title Case
    first_name = full_name.strip().split()[0]
    return first_name.title()

def send_email(server, to_email, name, template_content):
    msg = MIMEMultipart()
    msg['From'] = formataddr((SENDER_NAME, SENDER_EMAIL))
    msg['To'] = to_email
    msg['Subject'] = f"{name}, es momento de elevar el estándar de tus finanzas."

    # Reemplazar variables
    body = template_content.replace("{{Nombre}}", name)
    body = body.replace("{{Email}}", to_email) # Para el link de baja

    msg.attach(MIMEText(body, 'html'))

    if DRY_RUN:
        print(f"[DRY RUN] Would send to: {to_email} (Name: {name})")
        return True
    
    try:
        server.sendmail(SENDER_EMAIL, to_email, msg.as_string())
        return True
    except Exception as e:
        print(f"[ERROR] Failed to send to {to_email}: {e}")
        return False

def main():
    print("--- INICIANDO OPERATIVO AURORA ACADEMY ---")
    if DRY_RUN:
        print("!!! MODO DRY_RUN ACTIVADO - NO SE ENVIARÁN CORREOS REALES !!!")
    
    # 1. Cargar Datos
    if not os.path.exists(DATA_FILE):
        print(f"Error: No se encuentra el archivo {DATA_FILE}")
        return

    try:
        df = pd.read_excel(DATA_FILE)
    except Exception as e:
        print(f"Error leyendo Excel: {e}")
        return

    # Normalizar columnas (Asumiendo que existen 'Nombre' y 'Email')
    # Ajustar nombres de columnas según el Excel real si es necesario
    required_cols = ['Nombre', 'Email']
    if not all(col in df.columns for col in required_cols):
        print(f"Error: El Excel debe tener columnas {required_cols}")
        print(f"Columnas encontradas: {df.columns}")
        return

    # 2. Cargar Log y Template
    sent_emails = load_log()
    template = load_template()
    
    print(f"Total contactos en base: {len(df)}")
    print(f"Correos ya enviados previamente: {len(sent_emails)}")

def connect_smtp():
    if DRY_RUN:
        return None
    try:
        print("   Conectando a SMTP Hostinger...")
        server = smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT)
        server.login(SMTP_USER, SMTP_PASSWORD)
        return server
    except Exception as e:
        print(f"   Error conectando SMTP: {e}")
        return None

def main():
    print("--- INICIANDO OPERATIVO AURORA ACADEMY ---")
    if DRY_RUN:
        print("!!! MODO DRY_RUN ACTIVADO - NO SE ENVIARÁN CORREOS REALES !!!")
    
    # 1. Cargar Datos
    if not os.path.exists(DATA_FILE):
        print(f"Error: No se encuentra el archivo {DATA_FILE}")
        return

    try:
        df = pd.read_excel(DATA_FILE)
    except Exception as e:
        print(f"Error leyendo Excel: {e}")
        return

    # Normalizar columnas
    required_cols = ['Nombre', 'Email']
    if not all(col in df.columns for col in required_cols):
        print(f"Error: El Excel debe tener columnas {required_cols}")
        print(f"Columnas encontradas: {df.columns}")
        return

    # 2. Cargar Log y Template
    sent_emails = load_log()
    template = load_template()
    
    print(f"Total contactos en base: {len(df)}")
    print(f"Correos ya enviados previamente: {len(sent_emails)}")

    # 3. Conectar Inicialmente
    server = connect_smtp()

    # 4. Iterar y Enviar
    count_session = 0
    
    try:
        for index, row in df.iterrows():
            email = str(row['Email']).strip()
            raw_name = row['Nombre']
            
            if email in sent_emails:
                continue # Ya enviado
            
            # Limpieza
            name = clean_name(raw_name)

            # Intentar enviar con reintentos de conexión
            max_retries = 3
            sent_ok = False
            
            for attempt in range(max_retries):
                # Asegurar conexión
                if server is None:
                    server = connect_smtp()
                    if server is None:
                        print("   No se pudo reconectar. Esperando 10s...")
                        time.sleep(10)
                        continue

                print(f"[{count_session+1}] Enviando a {name} <{email}>... (Intento {attempt+1})")
                
                # Check if connection is alive (noop)
                try:
                    if not DRY_RUN:
                        status = server.noop()[0]
                        if status != 250:
                            raise ConnectionError("Connection lost")
                except:
                    print("   Conexión perdida, reconectando...")
                    try: 
                        server.close() 
                    except: 
                        pass
                    server = connect_smtp()
                    if server is None: continue

                success = send_email(server, email, name, template)
                
                if success:
                    if not DRY_RUN:
                        append_to_log(email)
                        sent_emails.add(email) # Update local memory set too
                    count_session += 1
                    sent_ok = True
                    break # Salir del loop de reintentos
                else:
                    print("   Fallo al enviar. Reintentando conexión...")
                    try: server.quit() 
                    except: pass
                    server = None
                    time.sleep(2)
            
            if not sent_ok:
                print(f"   [ERROR FATAL] No se pudo enviar a {email} tras {max_retries} intentos. Saltando.")
            
            # Delay Humano
            delay = random.uniform(DELAY_MIN, DELAY_MAX)
            print(f"   Esperando {delay:.2f}s...")
            time.sleep(delay)

            # Pausa extra cada 50 correos
            if count_session % 50 == 0 and count_session > 0:
                print("   --- Pausa de seguridad de 2 minutos ---")
                time.sleep(120)

    except KeyboardInterrupt:
        print("\nOperación detenida por el usuario.")
    
    finally:
        if server:
            try: server.quit()
            except: pass
        print(f"\n--- Sesión finalizada. Correos enviados hoy: {count_session} ---")

if __name__ == "__main__":
    main()
