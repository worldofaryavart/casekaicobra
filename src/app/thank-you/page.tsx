import { Suspense } from 'react';
import ThankYou from './ThankYou';

const Page = () => {
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThankYou/>
    </Suspense>
  );
};

export default Page;
