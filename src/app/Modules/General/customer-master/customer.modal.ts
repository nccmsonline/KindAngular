export interface Customer {
    categoryname: string;
    name: string;
    address1: string;
    gsTin: string;
}
export interface GithubApi {
    items: Customer[];
    total_count: number;
  }