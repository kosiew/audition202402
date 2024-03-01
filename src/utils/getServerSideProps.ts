// Example for getServerSideProps
import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
