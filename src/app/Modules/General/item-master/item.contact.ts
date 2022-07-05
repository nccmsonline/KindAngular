export class Contact{

    id: number;
    contact_name: string;
    contact_phone_number: string;
    contact_email: string;
    contact_position: string;

    constructor(contact){
        this.id = contact.id;
        this.contact_name = contact.contact_name;
        this.contact_phone_number = contact.contact_phone_number;
        this.contact_email = contact.contact_email;
        this.contact_position = contact.contact_position;
    }
}