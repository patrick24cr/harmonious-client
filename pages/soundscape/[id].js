// import { signOut } from '../utils/auth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
// import { useAuth } from '../../utils/context/authContext';
import TopNavigation from '../../components/TopNavigation';
import GridInteractable from '../../components/GridInteractable';
import BottomParameters from '../../components/BottomParameters';

export default function Home() {
  // const { user } = useAuth();
  const [selected, setSelected] = useState('initial');
  const scores = {};
  const router = useRouter();
  // const { soundscapeId } = router.query;
  useEffect(() => {
    console.warn(router.query);
  });

  return (
    <div className="container1">
      <TopNavigation />
      <GridInteractable scores={scores} selected={selected} setSelected={setSelected} />
      <BottomParameters selected={selected} />
    </div>
  );
}
