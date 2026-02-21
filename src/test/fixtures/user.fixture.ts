export const mockUser = {
    id: 1,
    email: 'test@test.com',
    password: 'hashedPassword',
    name: 'Mario',
    surname: 'Rossi',
    sex: null,
    birthDate: null,
    imageUrl: '',
    acceptedTerms: true,
    token: null,
    createdDate: new Date('2026-01-01'),
    updateDate: new Date('2026-01-01'),
};

export const mockUserWithoutPassword = (() => {
    const { password, ...rest } = mockUser;
    return rest;
})();

export const registerDto = {
    email: 'test@test.com',
    password: 'password123',
    name: 'Mario',
    surname: 'Rossi',
    sex: undefined,
    acceptedTerms: true,
};

export const loginDto = {
    email: 'test@test.com',
    password: 'password123',
};
