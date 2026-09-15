function obtenerUsuarioActual() {
    try {
        const datos = localStorage.getItem('usuarioActual');
        return datos ? JSON.parse(datos) : null;
    } catch (e) {
        console.error('Error al obtener usuario:', e);
        return null;
    }
}

function guardarUsuarioActual(usuario) {
    localStorage.setItem('usuarioActual', JSON.stringify(usuario));
    let usuarios = JSON.parse(localStorage.getItem('usuariosAgenda')) || [];
    let index = usuarios.findIndex(u => u.correo === usuario.correo);
    if (index !== -1) {
        usuarios[index] = usuario;
        localStorage.setItem('usuariosAgenda', JSON.stringify(usuarios));
    }
}

function cambiarContrasena(nuevaPassword) {
    let usuario = obtenerUsuarioActual();
    if (!usuario) {
        alert('Error: No hay una sesión activa.');
        return;
    }
    usuario.contrasena = nuevaPassword;
    guardarUsuarioActual(usuario);
    alert('¡Contraseña actualizada con éxito!');
}

function eliminarCuenta() {
    if (confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
        let usuario = obtenerUsuarioActual();
        if (!usuario) return;
        let usuarios = JSON.parse(localStorage.getItem('usuariosAgenda')) || [];
        usuarios = usuarios.filter(u => u.correo !== usuario.correo);
        localStorage.setItem('usuariosAgenda', JSON.stringify(usuarios));
        localStorage.removeItem('usuarioActual');
        window.location.href = 'index.html';
    }
}

function enviarMensaje(destinatarioCorreo, asunto, contenido) {
    let usuario = obtenerUsuarioActual();
    if (!usuario) return alert('Debes iniciar sesión para enviar mensajes.');
    
    let mensajes = JSON.parse(localStorage.getItem('mensajesAgenda')) || [];
    mensajes.push({
        id: Date.now(),
        remitente: usuario.nombre || 'Usuario',
        remitenteCorreo: usuario.correo,
        destinatarioCorreo: destinatarioCorreo,
        asunto: asunto,
        contenido: contenido,
        fecha: new Date().toLocaleString()
    });
    localStorage.setItem('mensajesAgenda', JSON.stringify(mensajes));
    alert('¡Mensaje enviado con éxito!');
}

function convertirArchivoBase64(file) {
    return new Promise((resolve, reject) => {
        if (file.size > 2 * 1024 * 1024) {
            reject(new Error('El archivo supera el límite de 2MB. Por favor sube uno más pequeño.'));
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}