export interface Person {
  name: string;
  isAccepted: boolean;
  birthDate: string;
  cpf: string;
}

export interface Invite {
  id: string;
  familyName: string;
  persons: string[];
  isResponded: boolean;
  inviteUrl: string;
}

export interface GuestPersonResponse {
  name: string;
  birthDate: string | null;
  cpf: string | null;
  isAccepted: boolean;
}

export interface GuestResponse {
  familyName: string;
  persons: GuestPersonResponse[];
}