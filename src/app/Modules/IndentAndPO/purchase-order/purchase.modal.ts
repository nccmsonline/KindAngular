export interface Purchase {
    po_no: string;
    supplier: string;
    your_ref: string;
    po_date: string;
    Prepared_By: string;
    po_amt: string;
    }

    export interface GithubApi {
        items: Account[];
        total_count: number;
      }