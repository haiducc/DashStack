export interface PhoneNumberModal {
  key: string;
  number?: string;
  com?: string;
  notes?: string;
  id?: number;
}

export interface DataPhoneNumber {
  id?: number;
  key: string;
  phone_number: string;
  network_operator: string;
  note?: string;
}