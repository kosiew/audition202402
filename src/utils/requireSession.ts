// utils/requireSession.ts
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import { getSession } from 'next-auth/react';

export async function requireSession(
  context: GetServerSidePropsContext,
  redirectPath: string = '/auth/signin'
): Promise<GetServerSidePropsResult<any>> {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: redirectPath,
        permanent: false,
      },
      props: {},
    };
  }

  return {
    props: { session },
  };
}
