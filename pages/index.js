/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useAuth } from '../utils/context/authContext';
import EmptyBands from '../components/EmptyBands';
import { getSoundscapes } from '../api/soundscapes';
import SoundscapeCard from '../components/SoundscapeCard';
import CreateCard from '../components/CreateCard';
import TopNavigation from '../components/TopNavigation';
import DeleteUserCard from '../components/DeleteUserCard';

function Home() {
  const { user } = useAuth();
  const [soundscapes, setSoundscapes] = useState(null);
  const getSoundscapesDrillable = () => {
    getSoundscapes(user.uid).then(setSoundscapes, console.warn(soundscapes));
  };
  useEffect(() => {
    getSoundscapesDrillable();
    document.title = 'Harmonious Volt';
  }, []);
  // if (bands === null) {
  //   return <></>;
  // }
  if (soundscapes) {
    return (
      <>
        <TopNavigation />
        <div className="d-flex flex-wrap">
          {soundscapes.map((soundscape) => (
            <SoundscapeCard key={soundscape.id} soundscapeObj={soundscape} onUpdate={getSoundscapesDrillable} />
          ))}
          <CreateCard />
          <DeleteUserCard />
        </div>
      </>
    );
  }
  return <EmptyBands displayName={user.fbUser.displayName} />;
}

export default Home;
