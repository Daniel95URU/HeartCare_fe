
class SessionService {
    constructor(session) {
        this.session = session;
    }

    isValid() {
        // Validar que la sesión exista y no haya expirado
        if (!this.session || !this.session.user) {
            return false;
        }
        // Lógica para verificar expiración (puede basarse en un timestamp)
        const now = Date.now();
        return this.session.expiration && this.session.expiration > now;
    }
}

module.exports = SessionService;
