document.getElementById("form-recuperar").addEventListener("submit", (e) => {

    e.preventDefault();

    const correoIngresado = document.getElementById("correo-recuperar").value.trim();
    const nuevaPassword = document.getElementById("nueva-password").value;
    
    // Capturamos el valor de la confirmación 
    const confirmarPassword = document.getElementById("confirmar-password").value;

    // Validamos que las contraseñas coincidan antes de continuar

    if (nuevaPassword !== confirmarPassword) {
        alert("❌ Las contraseñas no coinciden. Revisa e inténtalo de nuevo.");
        return; // Detenemos la ejecución aquí mismo
    }

    // 1. Obtenemos la lista de usuarios
    const listaUsuarios = JSON.parse(localStorage.getItem("usuarioRegistrado")) || [];

    // 2. Buscamos la posición del usuario por su correo

    const indiceUsuario = listaUsuarios.findIndex(
        (u) => u.correo === correoIngresado
    );

    // 3. Validamos si el usuario existe

    if (indiceUsuario === -1) {
        alert("❌ No hay ninguna cuenta registrada con este correo.");
        return;
    }

    // 4. Si existe y las contraseñas coinciden, actualizamos su clave

    listaUsuarios[indiceUsuario].password = nuevaPassword;

    // 5. Guardamos la lista actualizada en localStorage
    localStorage.setItem("usuarioRegistrado", JSON.stringify(listaUsuarios));

    // 6. Mensaje de éxito, limpiamos el formulario y redirigimos
    alert("✅ Contraseña actualizada con éxito. Ya puedes iniciar sesión con tu nueva clave.");

    document.getElementById("form-recuperar").reset();
    window.location.href = "login.html";
});