from passlib.hash import pbkdf2_sha256
import sqlite3, os
password = os.getenv("VERIFY_PASSWORD")
if not password:
    raise RuntimeError("Set VERIFY_PASSWORD before running this script.")
path = os.path.join(os.getcwd(), 'ethara.db')
print('using db', path, 'exists', os.path.exists(path))
conn = sqlite3.connect(path)
conn.row_factory = sqlite3.Row
cur = conn.cursor()
for row in cur.execute('SELECT email, hashed_password FROM users'):
    email = row[0]
    hashed = row[1]
    print(email, pbkdf2_sha256.verify(password, hashed))
conn.close()
