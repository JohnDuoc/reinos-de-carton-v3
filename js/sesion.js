

document.addEventListener("DOMContentLoaded", () => {
    /*
      DOMContentLoaded asegura que el HTML ya esté cargado antes
      de intentar manipular elementos como #mensaje o #cerrar.
    */

    /*
      Recuperamos la sesión desde sessionStorage.
  
      sessionStorage.getItem("sesion") devuelve texto.
      JSON.parse() transforma ese texto nuevamente en objeto.
    */
  

    const sesion = JSON.parse(sessionStorage.getItem("sesion"));

    /*
      Validamos si hay sesión activa.
  
      Si no existe sesión o logueado no es true,
      enviamos al usuario de vuelta al login.
    */
    if (!sesion || !sesion.logueado) {
        window.location.href = "login.html";
        return;
    }

    /*
      Si la sesión existe, mostramos el nombre del usuario en pantalla.
    */
    document.getElementById("mensaje").innerText =
        `👋 Bienvenido, ${sesion.usuario}!`;

    /*
      2. Obtenemos  DATOS DEL USUARIO
      Buscamos en el localStorage el objeto completo de este usuario en específico.
    */
    const listaUsuarios = JSON.parse(localStorage.getItem("usuarioRegistrado")) || [];

    // ¡Aquí usamos el .find() de nuevo! Buscamos el usuario que coincida con la sesión.
    const miUsuario = listaUsuarios.find(u => u.usuario === sesion.usuario);

    if (miUsuario) {
        // Inyectamos los datos en el HTML
        document.getElementById("perfil-nombre").textContent = miUsuario.nombre;
        document.getElementById("perfil-usuario").textContent = miUsuario.usuario;
        document.getElementById("perfil-correo").textContent = miUsuario.correo;
        document.getElementById("perfil-direccion").textContent = miUsuario.direccion || "No registrada";
        document.getElementById("perfil-fecha").textContent = miUsuario.fechaRegistro;
    }

    /*
      Agregamos funcionalidad al botón "Cerrar sesión".
    */
    document.getElementById("cerrar").addEventListener("click", () => {

        /*
          Eliminamos la sesión actual.
    
          Esto simula cerrar sesión.
          Los usuarios registrados siguen en localStorage,
          pero la sesión activa desaparece.
        */
        sessionStorage.removeItem("sesion");

        // Redirigimos al login.
        window.location.href = "login.html";
    });
});
