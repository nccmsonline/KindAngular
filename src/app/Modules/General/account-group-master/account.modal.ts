export interface Account {
    account_head: string;
    undergroup: string;
    pos: string;
}
export interface GithubApi {
    items: Account[];
    total_count: number;
  }