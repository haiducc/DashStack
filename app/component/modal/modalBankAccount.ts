export interface BankAccounts {
  bankId?: number;
  accountNumber?: string;
  fullName?: string;
  phoneId?: number;
  notes?: string;
  TransactionSource?: string;
  typeAccount?: string;
  bank?: {
    fullName?: string;
    code?: string;
    notes?: string;
    id?: number;
  };
  phone: {
    number: string
  }
  typeGroupAccountString?: string[];
  typeAccountDescription?: string;
  id: number;
  SelectedAccountGroups?: number[];
}

// export interface DataAccount {
//   key: number;
//   bank: string;
//   account_number: string;
//   account_holder: string;
//   phone: number;
//   SelectedAccountGroups: number[];
//   type_account: string;
//   note: string;
//   TransactionSource: string;
//   groupSystem: number;
//   branchSystem: number;
//   groupTeam: number;
// }
