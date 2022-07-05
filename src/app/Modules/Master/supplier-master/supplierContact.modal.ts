export class Contact {
    id: string;
    name: string;
    mobile: string;
    phone: string;
    fax: string;
    email: string;
    position: string;
    isactive: string;
    
    constructor(id: string, name: string, mobile: string, phone: string, fax: string, email: string, position: string, isactive: string) {
        this.id = id,
        this.name = name,
        this.mobile = mobile,
        this.phone = phone,
        this.fax = fax,
        this.email = email,
        this.position = position,
         this.isactive = isactive
    }
}
