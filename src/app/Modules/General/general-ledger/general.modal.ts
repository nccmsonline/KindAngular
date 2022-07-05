export interface General {
  account_head: string;
  undergroup: string;
  year_open: string;
  drcr: string;
  }

  export interface GithubApi {
    items: General[];
    total_count: number;
  }