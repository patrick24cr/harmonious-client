/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../utils/context/authContext';
import EmptyBands from '../components/EmptyBands';
import { getSoundscapes, deleteSoundscape } from '../api/soundscapes';
import TopNavigation from '../components/TopNavigation';

export default function Home() {
  const { user } = useAuth();
  const [soundscapes, setSoundscapes] = useState(null);
  const getSoundscapesDrillable = () => {
    getSoundscapes(user.uid).then(setSoundscapes);
  };
  const deleteAndUpdate = (pk) => {
    if (window.confirm('Delete this soundscape?')) {
      deleteSoundscape(pk).then(getSoundscapesDrillable);
    }
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
            <div key={soundscape.id} className="homeCard">
              <button type="button" className="soundButton2" onClick={() => deleteAndUpdate(soundscape.id)}>X</button>
              {soundscape.title}
              <Link href={`/soundscape/${soundscape.title}--${soundscape.melodyNotes}--${soundscape.melodyTexture}--${soundscape.chordTexture}--${soundscape.id}`} passHref>
                <button type="button" className="soundButton">Load</button>
              </Link>
              <div className="spacer" />
            </div>
          ))}
          <div className="homeCard">
            <div className="spacer" />
            Create New Soundscape?
            <Link href="/soundscape/new" passHref>
              <button type="button" className="soundButton">Create</button>
            </Link>
            <div className="spacer" />
          </div>
          <div className="homeCard">
            <div className="spacer" />
            Delete User?
            <button type="button" className="soundButton">Delete</button>
            <div className="spacer" />
          </div>
        </div>
      </>
    );
  }
  return <EmptyBands displayName={user.fbUser.displayName} />;
}
