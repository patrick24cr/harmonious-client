// import { signOut } from '../utils/auth';
import { useState } from 'react';
// import { useAuth } from '../utils/context/authContext';
// import { getScoresById } from '../api/scores';
import TopNavigation from '../components/TopNavigation';
import GridInteractable from '../components/GridInteractable';
import BottomParameters from '../components/BottomParameters';

function Home() {
  // const { user } = useAuth();
  const scores = {};
  // const [scores, setScores] = useState({});
  const [selected, setSelected] = useState('initial');
  // useEffect(() => {
  //   getScoresById(user.id).then(setScores);
  // }, [user.id]);

  return (
    <div className="container1">
      <TopNavigation />
      <GridInteractable scores={scores} selected={selected} setSelected={setSelected} />
      <BottomParameters selected={selected} />
    </div>
  );
}

export default Home;
