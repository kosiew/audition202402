import { prismaMock } from '@/__mocks__/@prisma/client';
import handleRoles from '@/pages/api/roles/index';
import { getSession } from 'next-auth/react';

jest.mock('next-auth/react');

describe('/api/roles', () => {
  test('creates a new role with valid session', async () => {
    getSession.mockResolvedValueOnce({ user: { email: 'user@example.com', name: 'User' } }); // Mocking getSession to return a valid session
    prismaMock.role.create.mockResolvedValueOnce({ id: 1, name: 'Admin' }); // Mocking Prisma role.create

    const { req, res } = createMocks({
      method: 'POST',
      body: {
        name: 'Admin',
      },
    });

    await handleRoles(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        id: 1,
        name: 'Admin',
      })
    );
  });

  // Add more tests for different scenarios: invalid session, invalid data, etc.
});
