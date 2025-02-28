from flask import Flask, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
from database import obtener_cursor, db
from flask_cors import CORS  # Importar CORS

app = Flask(__name__)
CORS(app) # Habilitar CORS para todas las rutas


#  Ruta para registrar usuario desde el frontend
@app.route('/usuarios', methods=['POST'])
def agregar_usuario():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No se enviaron datos"}), 400
        
        cursor = obtener_cursor()

        # Encriptar la contraseña antes de guardarla
        password_hash = generate_password_hash(data['password'])

        sql = "INSERT INTO usuarios (username, password, role, curso) VALUES (%s, %s, %s, %s)"
        valores = (data['username'], password_hash, data['role'], data['curso'])
        
        cursor.execute(sql, valores)
        db.commit()
        
        return jsonify({"mensaje": "Usuario registrado correctamente"}), 201

    except Exception as e:
        print(f"Error en el servidor: {e}")  # Esto imprimirá el error en la terminal de Flask
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500


# Ruta para iniciar sesión
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    cursor = obtener_cursor()

    sql = "SELECT id, username, password, role, curso FROM usuarios WHERE username = %s"
    cursor.execute(sql, (data['username'],))
    usuario = cursor.fetchone()

    if usuario and check_password_hash(usuario['password'], data['password']):
        return jsonify({
            "mensaje": "Inicio de sesión exitoso",
            "usuario": {
                "id": usuario['id'],  #  Incluir el ID en la respuesta
                "username": usuario['username'],
                "role": usuario['role'],
                "curso": usuario['curso']
            }
        })
    else:
        return jsonify({"error": "Credenciales incorrectas"}), 401



# Ruta para guardar las tareas en base de datos
@app.route('/tareas', methods=['POST'])
def agregar_tarea():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "No se enviaron datos"}), 400

        cursor = obtener_cursor()

        sql = "INSERT INTO tareas (titulo, descripcion, fecha_entrega, grupo, profesor_id) VALUES (%s, %s, %s, %s, %s)"
        valores = (data['titulo'], data['descripcion'], data['fecha_entrega'], data['grupo'], data['profesor_id'])
        
        cursor.execute(sql, valores)
        db.commit()

        return jsonify({"mensaje": "Tarea agregada correctamente"}), 201

    except Exception as e:
        print(f"Error en el servidor: {e}")
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500

#  Ruta para obtener todas las tareas
@app.route('/tareas', methods=['GET'])
def obtener_tareas():
    try:
        cursor = obtener_cursor()
        cursor.execute("SELECT * FROM tareas")
        tareas = cursor.fetchall()
        return jsonify(tareas)

    except Exception as e:
        print(f"Error en el servidor: {e}")
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500
    

    # Eliminar tarea
@app.route("/tareas/<int:id>", methods=["DELETE"])
def eliminar_tarea(id):
    try:
        cur = obtener_cursor()
        cur.execute("DELETE FROM tareas WHERE id = %s", (id,))
        db.commit()
        return jsonify({"mensaje": "Tarea eliminada"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cur.close()

#  Actualizar tarea
@app.route("/tareas/<int:id>", methods=["PUT"])
def actualizar_tarea(id):
    datos = request.json
    titulo = datos.get("titulo")
    descripcion = datos.get("descripcion")
    fecha_entrega = datos.get("fecha_entrega")
    grupo = datos.get("grupo")

    cursor = obtener_cursor()
    sql = "UPDATE tareas SET titulo=%s, descripcion=%s, fecha_entrega=%s, grupo=%s WHERE id=%s"
    cursor.execute(sql, (titulo, descripcion, fecha_entrega, grupo, id))
    db.commit()

    return jsonify({"mensaje": "Tarea actualizada correctamente"}), 200

 #entregar tareas
@app.route('/tareas/<int:id>/entregar', methods=['PUT'])
def entregar_tarea(id):
    try:
        cursor = obtener_cursor()

        # Verificar si la tarea existe
        cursor.execute("SELECT * FROM tareas WHERE id = %s", (id,))
        tarea = cursor.fetchone()

        if not tarea:
            return jsonify({"error": "Tarea no encontrada"}), 404

        # Actualizar el estado de la tarea a "Entregado"
        cursor.execute("UPDATE tareas SET estado = 'Entregado' WHERE id = %s", (id,))
        db.commit()

        return jsonify({"mensaje": "Tarea entregada con éxito"}), 200

    except Exception as e:
        print(f"Error en el servidor: {e}")
        return jsonify({"error": "Error interno del servidor", "detalle": str(e)}), 500

    finally:
        cursor.close()



if __name__ == '__main__':
    app.run(debug=True)
