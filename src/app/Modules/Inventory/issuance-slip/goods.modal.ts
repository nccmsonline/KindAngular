export interface Goods {
  issuanceno: string;
  deptname: string;
  createdon:string;
  costcentre: string;
  manualslipno: string;
  
  }
  export interface GithubApi {
    items: Goods[];
    total_count: number;
  }