
// Capturamos el formulario de login usando su id.
document.getElementById("form-login").addEventListener("submit", (e) => {

    /*
        Evitamos que el formulario recargue la página.
        Así podemos controlar el login con JavaScript.
      */
    e.preventDefault();

    /*
      Obtenemos los datos ingresados por el usuario.
    */
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();
    /*
        Recuperamos la lista de usuarios registrados.
    
        Estos usuarios fueron guardados previamente desde registro.js.
      */
    const usuarioRegistrado = JSON.parse(localStorage.getItem("usuarioRegistrado")) || [];
   

    /*
      Buscamos un usuario que coincida con los datos ingresados.
  
      find() devuelve el primer usuario que cumpla la condición.
      Si no encuentra ninguno, devuelve undefined.
    */

    const encontrado = usuarioRegistrado.find(
        (u) => u.usuario === usuario && u.password === password
    );

    /*
      Si no hay coincidencia, el login falla.
    */
    if (!encontrado) {
        alert("❌ Usuario o contraseña incorrectos. Intenta nuevamente.");
        return;
    }

    /*
      Si el usuario existe, creamos una sesión temporal.
  
      sessionStorage guarda datos solo durante la sesión actual de la pestaña.
      Esto permite saber quién está conectado en este momento.
    */
    sessionStorage.setItem(
        "sesion",
        JSON.stringify({
            logueado: true,
            usuario: usuario
        })
    );

    /*
      Redirigimos al usuario a la página protegida.
    */
    alert(`✅ Bienvenido, ${usuario}! Has iniciado sesión correctamente.`);
    window.location.href = "home.html";

});