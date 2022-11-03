import { AdminRoles, Genders } from "./enums";

export class Admin {

    constructor(
        _id?: string, 
        _accessToken?: string, 
        _fullName?: string, 
        _role?: AdminRoles, 
        _isSuperAdmin?: boolean,
        _isAdmin?: boolean,
        _isCorporateAdmin?: boolean,
        _isAnalystAdmin?: boolean,
    ) {
        this._id = _id;
        this.accessToken = _accessToken;
        this.fullName= _fullName;
        this.role = _role;
        this.isSuperAdmin = _isSuperAdmin || false;
        this.isAdmin = _isAdmin || false;
        this.isCorporateAdmin = _isCorporateAdmin || false;
        this.isAnalystAdmin = _isAnalystAdmin || false;
    }

    _id: string;
    fullName: string;
    avatarUrl: string;
    email: string;
    phone: string;
    password: string;
    accessToken: string;
    role: AdminRoles;
    gender: Genders;
    dateOfBirth: string;
    createAt: Date;
    isSuperAdmin: boolean;
    isAdmin: boolean;
    isCorporateAdmin: boolean;
    isAnalystAdmin: boolean;
}