

export class UserModel {
    id: string  ;
    firstName: string ;
    lastName: string ;
    password: string ;
    email: string ;
    createAt: Date;
}

export class IdentType {
     id: string;
     nombre: string;
     acronimo: string;
 }

export class BasicResponse {
     success: boolean;
     msg: string;
     data: Array< any >;
}
