export interface AuthResponse {
    user: UserWithoutPassword;
    accessToken: string;
}

export interface UserWithoutPassword {
    id: number;
    email: string;
    name: string | null;
    surname: string | null;
    birthDate: Date | null;
    sex: string | null;
    imageUrl: string | null;
    acceptedTerms: boolean;
    token: string | null;
    updateDate: Date;
    createdDate: Date;
}

export interface MessageResponse {
    message: string;
}
