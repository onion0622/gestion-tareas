import pymysql
from pymysql.cursors import DictCursor

# Configuración de la conexión
db = pymysql.connect(
    host="localhost",  # O la IP de tu servidor MySQL
    user="",       # Tu usuario de MySQL
    password="",       # Tu contraseña de MySQL (déjala vacía si no pusiste una y por seguridad no incluir en github)
    database="proyecto",  # Reemplaza con el nombre real de tu base de datos
    cursorclass=DictCursor
)

# Función para obtener un cursor y ejecutar consultas
def obtener_cursor():
    return db.cursor()
