import sqlite3

conn = sqlite3.connect('ethara.db')
cursor = conn.cursor()
cursor.execute('SELECT id, name, email, role FROM users')
print('Users in database:')
for row in cursor.fetchall():
    print(f'ID: {row[0]}, Name: {row[1]}, Email: {row[2]}, Role: {row[3]}')
conn.close()
