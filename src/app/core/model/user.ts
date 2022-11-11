export interface IUser {
    _id?: string;
    phone: string;
    invitationLink?: string;
    email: string;
    registeredPhone?: string;
    hashedPhone?: string;
    fullName: string;
    company: string;
    title: string;
    sector: string;
    submittedRegistration?: boolean;
    adminSentQR?: boolean;
    attendedEvent?: boolean;
}