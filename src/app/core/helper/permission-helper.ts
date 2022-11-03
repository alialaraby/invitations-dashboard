import { AdminRoles } from "../model/enums";

export class PermissionHelper {

    constructor() { }

    public static isSuperAdmin(role: AdminRoles) {
        return role == AdminRoles.SuperAdmin;
    }
}
