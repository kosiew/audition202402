import { useRouter } from 'next/router';
import { useEffect } from 'react';

const IndexPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace('/inventory');
  }, [router]);

  return null;
};

export default IndexPage;
