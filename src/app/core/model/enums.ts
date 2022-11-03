export enum ResponseActionType{
    Added = 1,
    Updated = 2,
    Deleted = 3,
    Sent = 4,
    Done = 5,
}

export enum Genders{
    Male = 'male',
    Female = 'female'
}

export enum TripTypes{
    Daily = 'daily',
    Private = 'private',
    Pooling = 'pooling',
    Tour = 'tour',
}

export enum TripStatus{
    // NotStarted = 'notStarted',
    Ready = 'ready', //created by admin (not yet accepted by any pilot)
    AcceptedByPilot = 'acceptedByPilot',
    Started = 'started', // pilot started the trip
    Completed = 'completed', // pilot ended/completed the trip
    Cancelled = 'cancelled', // pilot cancelled the trip
}

export enum RequestedTripStatus{
    Pending = 'pending',
    Accepted = 'accepted',
    Rejected = 'rejected',
}

export enum PaymentMethods{
    Cash = 'cash',
}

export enum BoatStatus{
    Ready = 'ready',
    NeedMaintenance = 'needMaintenance',
    InMaintenance = 'inMaintenance',
}

export enum UserType{
    Admin = 'admin',
    Pilot = 'pilot',
    Passenger = 'passenger',
    CorporateAdmin = 'corporateAdmin',
    FamilyAdmin = 'familyAdmin',
    Dependent = 'dependent',
    Student = 'student',
}

export enum FuelType{
    Diesel = 'diesel',
    Gasoline = 'gasoline',
    Electric = 'electric',
}

export enum PromocodeType{
    PerUserTimely = 'perUserTimely',
    PerUser = 'perUserPerUsage',
    // SpecificUser = 'specificUsers',
}

export enum EmergencyType{
    Maintenance = 'maintenance',
    Emergency = 'emergency',
}

export enum AdminRoles{
    SuperAdmin = 'superAdmin',
    Admin = 'admin',
    CorporateAdmin = 'corporateAdmin',
    Analyst = 'analyst',
}

export enum StationZones{
    Z1 = 'Z1',
    Z2 = 'Z2',
    Z3 = 'Z3',
    Z4 = 'Z4',
    Z5 = 'Z5',
    Z6 = 'Z6',
    Z7 = 'Z7',
    Z8 = 'Z8',
    Z9 = 'Z9',
    Z10 = 'Z10',
    Z11 = 'Z11',
    Z12 = 'Z12',
    Z13 = 'Z13',
    Z14 = 'Z14',
}