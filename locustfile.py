from locust import HttpUser, task, between
import random
import string

def generar_usuario():
    username = 'user_' + ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
    password = 'pass_' + ''.join(random.choices(string.ascii_letters + string.digits, k=8))
    role = random.choice(["profesor", "estudiante"])
    curso = random.choice(["Grupo A", "Grupo B"])
    return {
        "username": username,
        "password": password,
        "role": role,
        "curso": curso
    }

class UsuarioVirtual(HttpUser):
    wait_time = between(1, 3)
    host = "http://127.0.0.1:5000"  # <<<<< ESTA LÍNEA SOLUCIONA EL ERROR

    @task
    def registrar_usuario(self):
        usuario = generar_usuario()
        self.client.post(
            "/usuarios",
            json=usuario,
            headers={"Content-Type": "application/json"}
        )
