export class Supplier {
    id: string;
    coid: string;
    boid: string;
    name: string;
    categoryid: string;
    segmentid: string;
    gsTin: string;
    pan: string;
    address1: string;
    address2: string;
    zone: string;
    area: string;
    region: string;
    city: string;
    state: string;
    country: string;
    newCity: string;
    newCountry: string;
    newState: string;
    pin: string;
    mobile_number: string;
    phone_number: string;
    fax: string;
    email: string;
    website: string;
    tds_applicable: string;
    tds_rate: boolean;
    tcs_applicable: string;
    tcs_rate: boolean;
    vat_number: string;
    vat_date: string;
    excise_regn_number: string;
    excise_commissionerate: string;
    excise_division: string;
    excise_range: string;
    isactive: string;
	createdby: string;
	createdon: string;
	modifiedby: string;
	modifiedon: string;
	deactivatedby: string;
	deactivatedon: string;
	credit_days: string;
	credit_limit: string;
	currency_preference: string; 
}

// export class Bank {
//     id: string;
//     bankname: string;
//     bankacno: string;
//     ifsc: string;
//     isactive: string;
// }

export class Contact {
    id: number;
    name: string;
    mobile: string;
    phone: string;
    fax: string;
    email: string;
    position: string;
    isactive: number;
}

export interface GithubApi {
    items: Contact[];
    total_count: number;
  }

// export class License {
//     id: string;
//     licensetype: string;
//     licenseno: string;
//     validtill: string;
//     authentication: string;
//     isactive: string;
// }