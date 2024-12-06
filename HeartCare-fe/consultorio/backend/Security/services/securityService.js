
class SecurityService {
    constructor(user) {
        this.user = user;
    }

    hasPermission(resource, allowedRoles) {
        // Validar que el usuario tenga el rol permitido
        if (!this.user || !this.user.role) {
            return false;
        }
        return allowedRoles.includes(this.user.role);
    }
}

module.exports = SecurityService;
