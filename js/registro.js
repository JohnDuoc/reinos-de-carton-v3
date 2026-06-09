/*
  DOMContentLoaded espera a que el HTML esté completamente cargado.
  Esto evita errores al intentar buscar elementos que todavía no existen.
*/
document.addEventListener("DOMContentLoaded", function () {

  /*
    Seleccionamos el formulario completo.
    Usamos const porque esta referencia no será reasignada.
  */
  const formulario = document.getElementById("formRegistro");

  /*
    Seleccionamos cada input.
    Cada constante guarda el elemento HTML completo, no solo el texto.
  */
  const inputNombre = document.getElementById("nombre");
  const inputUsuario = document.getElementById("usuario");
  const inputCorreo = document.getElementById("correo");
  const inputPassword = document.getElementById("password");
  const inputConfirmarPassword = document.getElementById("confirmarPassword");
  const inputFechaNacimiento = document.getElementById("fechaNacimiento");
  const inputDireccion = document.getElementById("direccion");

  /*
    Este contenedor se usará para mostrar mensajes generales.
  */
  const alertaGeneral = document.getElementById("alertaGeneral");

  /*
    Evento submit:
    Se ejecuta cuando el usuario intenta enviar el formulario.
  */
  formulario.addEventListener("submit", function (event) {

    /*
      Evitamos que el formulario recargue la página.
      Primero queremos validar con JavaScript.
    */
    event.preventDefault();

    /*
      Capturamos los valores escritos por el usuario.
      .value obtiene el valor del input.
      .trim() elimina espacios al inicio y al final.
    */
    const nombre = inputNombre.value.trim();
    const usuario = inputUsuario.value.trim();
    const correo = inputCorreo.value.trim();
    const password = inputPassword.value;
    const confirmarPassword = inputConfirmarPassword.value;
    const fechaNacimiento = inputFechaNacimiento.value;
    const direccion = inputDireccion.value.trim();

    /*
      Limpiamos los mensajes anteriores antes de validar nuevamente.
    */
    limpiarAlerta();

    /*
      Variable de control.
      Partimos asumiendo que el formulario es válido.
      Si una validación falla, cambiaremos esta variable a false.
    */
    let formularioValido = true;

    /*
      Validamos campos obligatorios.
      Dirección no se valida como obligatoria porque es opcional.
    */
    if (!validarCampoTexto(inputNombre)) formularioValido = false;
    if (!validarCampoTexto(inputUsuario)) formularioValido = false;

    /*
      Validamos correo.
    */
    if (!validarCorreo(correo)) {
      marcarInvalido(inputCorreo);
      formularioValido = false;
    } else {
      marcarValido(inputCorreo);
    }

    /*
      Validamos contraseña.
    */
    if (!validarPassword(password)) {
      marcarInvalido(inputPassword);
      formularioValido = false;
    } else {
      marcarValido(inputPassword);
    }

    /*
      Validamos confirmación de contraseña.
    */
    if (password === "" || password !== confirmarPassword) {
      marcarInvalido(inputConfirmarPassword);
      formularioValido = false;
    } else {
      marcarValido(inputConfirmarPassword);
    }

    /*
      Validamos edad mínima.
    */
    if (!validarEdadMinima(fechaNacimiento, 13)) {
      marcarInvalido(inputFechaNacimiento);
      formularioValido = false;
    } else {
      marcarValido(inputFechaNacimiento);
    }

    /*
      Si el formulario tiene errores, detenemos el proceso.
    */
    if (!formularioValido) {
      mostrarAlerta(
        "Revisa los campos marcados en rojo antes de enviar el registro.",
        "danger"
      );
      return;
    }
    
    /*
      Si llegamos hasta aquí, el formulario está correcto.
      Creamos un objeto con los datos del usuario.
    */
    const nuevoUsuario = {
      nombre: nombre,
      usuario: usuario,
      password: password,
      correo: correo,
      fechaNacimiento: fechaNacimiento,
      direccion: direccion,
      fechaRegistro: new Date().toLocaleString()
    };

    /*
      PASO CLAVE: Recuperamos el arreglo de usuarios registrados.
      Si no existe nada en el localStorage, iniciamos un arreglo vacío [].
    */
    const listaUsuarios = JSON.parse(localStorage.getItem("usuarioRegistrado")) || [];

    /*
      Agregamos el nuevo usuario a la lista.
    */
    listaUsuarios.push(nuevoUsuario);

    /*
      Guardamos el arreglo completo y actualizado en localStorage.
    */
    localStorage.setItem("usuarioRegistrado", JSON.stringify(listaUsuarios));
    /*
          Mostramos mensaje de éxito.
        */
    alert("✅ Usuario registrado correctamente. Ahora puedes iniciar sesión.");

    // Redirigimos al login para que el usuario pruebe sus credenciales.
    window.location.href = "login.html";


    /*
      Limpiamos el formulario.
    */
    formulario.reset();

    /*
      Quitamos clases visuales después de limpiar.
    */
    limpiarEstadosVisuales();

    /*
      Mostramos en consola el objeto guardado para depuración.
    */
    console.log("Usuario registrado:", usuarioRegistrado);
  });

  /*
    Evento input:
    Permite validar en tiempo real mientras el usuario escribe.
    Esto mejora la experiencia de usuario.
  */
  inputNombre.addEventListener("input", function () {
    validarCampoTexto(inputNombre);
  });

  inputUsuario.addEventListener("input", function () {
    validarCampoTexto(inputUsuario);
  });

  inputCorreo.addEventListener("input", function () {
    if (validarCorreo(inputCorreo.value.trim())) {
      marcarValido(inputCorreo);
    } else {
      marcarInvalido(inputCorreo);
    }
  });

  inputPassword.addEventListener("input", function () {
    if (validarPassword(inputPassword.value)) {
      marcarValido(inputPassword);
    } else {
      marcarInvalido(inputPassword);
    }

    /*
      Si el usuario cambia la contraseña, también conviene volver a validar
      la confirmación.
    */
    validarCoincidenciaPassword();
  });

  inputConfirmarPassword.addEventListener("input", function () {
    validarCoincidenciaPassword();
  });

  inputFechaNacimiento.addEventListener("change", function () {
    if (validarEdadMinima(inputFechaNacimiento.value, 13)) {
      marcarValido(inputFechaNacimiento);
    } else {
      marcarInvalido(inputFechaNacimiento);
    }
  });

  /*
    Evento reset:
    Se ejecuta cuando el usuario presiona el botón Limpiar.
  */
  formulario.addEventListener("reset", function () {
    limpiarAlerta();

    /*
      Usamos setTimeout para esperar a que el navegador limpie los campos
      y luego quitamos las clases visuales.
    */
    setTimeout(function () {
      limpiarEstadosVisuales();
    }, 50);
  });

  /*
    FUNCIÓN: validarCampoTexto
    Revisa si un input de texto tiene contenido real.
  */
  function validarCampoTexto(input) {
    if (input.value.trim() === "") {
      marcarInvalido(input);
      return false;
    }

    marcarValido(input);
    return true;
  }

  /*
    FUNCIÓN: validarCorreo
    Usa una expresión regular sencilla para validar formato de email.
  */
  function validarCorreo(correo) {
    const patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return patronCorreo.test(correo);
  }

  /*
    FUNCIÓN: validarPassword
    Reglas:
    - Debe tener entre 6 y 18 caracteres.
    - Debe contener al menos una mayúscula.
    - Debe contener al menos un número.
  */
  function validarPassword(password) {
    const tieneMayuscula = /[A-Z]/.test(password);
    const tieneNumero = /[0-9]/.test(password);
    const largoValido = password.length >= 6 && password.length <= 18;

    return tieneMayuscula && tieneNumero && largoValido;
  }

  /*
    FUNCIÓN: validarCoincidenciaPassword
    Revisa que password y confirmación sean iguales.
  */
  function validarCoincidenciaPassword() {
    if (
      inputConfirmarPassword.value !== "" &&
      inputPassword.value === inputConfirmarPassword.value
    ) {
      marcarValido(inputConfirmarPassword);
      return true;
    }

    marcarInvalido(inputConfirmarPassword);
    return false;
  }

  /*
    FUNCIÓN: calcularEdad
    Calcula la edad considerando si la persona ya cumplió años este año.
  */
  function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const diferenciaMes = hoy.getMonth() - nacimiento.getMonth();

    if (
      diferenciaMes < 0 ||
      (diferenciaMes === 0 && hoy.getDate() < nacimiento.getDate())
    ) {
      edad--;
    }

    return edad;
  }

  /*
    FUNCIÓN: validarEdadMinima
    Recibe una fecha y una edad mínima.
  */
  function validarEdadMinima(fechaNacimiento, edadMinima) {
    if (fechaNacimiento === "") {
      return false;
    }

    const fechaIngresada = new Date(fechaNacimiento);
    const hoy = new Date();

    /*
      No permitimos fechas futuras.
    */
    if (fechaIngresada > hoy) {
      return false;
    }

    const edad = calcularEdad(fechaNacimiento);
    return edad >= edadMinima;
  }

  /*
    FUNCIÓN: marcarValido
    Agrega clases Bootstrap para marcar un input como correcto.
  */
  function marcarValido(input) {
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
  }

  /*
    FUNCIÓN: marcarInvalido
    Agrega clases Bootstrap para marcar un input como incorrecto.
  */
  function marcarInvalido(input) {
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
  }

  /*
    FUNCIÓN: mostrarAlerta
    Muestra un mensaje general usando alertas de Bootstrap.
  */
  function mostrarAlerta(mensaje, tipo) {
    alertaGeneral.innerHTML = `
      <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button 
          type="button" 
          class="btn-close" 
          data-bs-dismiss="alert" 
          aria-label="Cerrar">
        </button>
      </div>
    `;
  }

  /*
    FUNCIÓN: limpiarAlerta
    Limpia los mensajes generales.
  */
  function limpiarAlerta() {
    alertaGeneral.innerHTML = "";
  }

  /*
    FUNCIÓN: limpiarEstadosVisuales
    Quita clases is-valid e is-invalid de todos los inputs.
  */
  function limpiarEstadosVisuales() {
    const inputs = [
      inputNombre,
      inputUsuario,
      inputCorreo,
      inputPassword,
      inputConfirmarPassword,
      inputFechaNacimiento
    ];

    inputs.forEach(function (input) {
      input.classList.remove("is-valid");
      input.classList.remove("is-invalid");
    });
  }

});
