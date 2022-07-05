export interface StoreRequisition {
  reqnno: string;
  deptid: string;
  reqndate:string;
  costcentreid: string;
  storeid: string;
  manualslipno: string;
}

export interface GithubApi {
  items: Account[];
  total_count: number;
}