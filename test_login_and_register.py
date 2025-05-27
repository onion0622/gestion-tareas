
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime

# Configuración
options = Options()
options.add_argument("--window-size=1200,800")
driver = webdriver.Chrome(service=Service(), options=options)
wait = WebDriverWait(driver, 10)
FRONTEND_URL = "http://127.0.0.1:5000/"

def cerrar_alerta_si_existe():
    try:
        WebDriverWait(driver, 2).until(EC.alert_is_present())
        alert = driver.switch_to.alert
        print(f"⚠️ Cerrando alerta: {alert.text}")
        alert.accept()
    except:
        pass

def test_login(usuario, clave):
    print(f"🔐 Iniciando sesión como {usuario}")
    driver.get(FRONTEND_URL)
    wait.until(EC.presence_of_element_located((By.ID, "username"))).send_keys(usuario)
    driver.find_element(By.ID, "password").send_keys(clave)
    driver.find_element(By.CSS_SELECTOR, "#loginForm button[type='submit']").click()
    cerrar_alerta_si_existe()
    try:
        wait.until(EC.visibility_of_element_located((By.ID, "taskManager")))
        print("✅ Login exitoso.")
        return True
    except:
        print("❌ Login fallido.")
        return False

def agregar_tarea(titulo):
    print(f"📝 Agregando tarea: {titulo}")
    wait.until(EC.visibility_of_element_located((By.ID, "taskFormSection")))
    driver.find_element(By.ID, "taskTitle").send_keys(titulo)
    driver.find_element(By.ID, "taskDescription").send_keys("Automatización con Selenium")
    driver.execute_script("document.getElementById('taskDueDate').value = '2025-04-24'")
    Select(driver.find_element(By.ID, "taskGroup")).select_by_visible_text("Grupo A")
    driver.find_element(By.ID, "addTaskButton").click()
    cerrar_alerta_si_existe()
    time.sleep(2)

def obtener_id_tarea_por_titulo(titulo):
    print(f"🔎 Buscando tarea con título: {titulo}")
    try:
        span = driver.find_element(By.XPATH, f"//span[contains(text(), '{titulo}')]")
        fila = span.find_element(By.XPATH, "./ancestor::tr")
        fila_id = fila.get_attribute("id")
        id_tarea = fila_id.replace("task-", "")
        print(f"🆔 ID de la tarea encontrada: {id_tarea}")
        return id_tarea
    except Exception as e:
        print(f"❌ No se pudo encontrar la tarea: {e}")
        return None

def eliminar_tarea_por_id(id_tarea):
    print(f"🗑️ Eliminando tarea con ID: {id_tarea}")
    try:
        boton = driver.find_element(By.XPATH, f"//tr[@id='task-{id_tarea}']//button[contains(text(), 'Eliminar')]")
        boton.click()
        cerrar_alerta_si_existe()
        print("✅ Tarea eliminada correctamente.")
    except Exception as e:
        print(f"❌ Error al eliminar la tarea: {e}")

# ---- FLUJO COMPLETO ----
titulo_unico = f"TAREA-{datetime.now().strftime('%H%M%S')}"
try:
    if test_login("a", "abc"):
        agregar_tarea(titulo_unico)
        id_tarea = obtener_id_tarea_por_titulo(titulo_unico)
        if id_tarea:
            eliminar_tarea_por_id(id_tarea)
finally:
    time.sleep(3)
    driver.quit()


"""try:
    # Primer intento (usuario nuevo)
    registrar_usuario("")

    # Segundo intento (usuario ya existe)
    registrar_usuario("")

    #registrar_usuario()

finally:
    driver.quit()


"""