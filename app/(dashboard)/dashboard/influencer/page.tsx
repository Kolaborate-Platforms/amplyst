import { Suspense } from 'react';
import InfluencerDashboard from '../../../_components/influencer/influencerDashboard';
// import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Page() {
  return (

      // <InfluencerDashboard />
    <Suspense fallback="/">
      <InfluencerDashboard />
    </Suspense>
  );
}