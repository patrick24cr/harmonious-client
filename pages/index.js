/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../utils/context/authContext';
import EmptyBands from '../components/EmptyBands';
import {
  getSoundscapes, deleteSoundscape, deleteAllChordProgressions,
} from '../api/soundscapes';
import { deleteUser } from '../api/user';
import TopNavigation from '../components/TopNavigation';
import { signOut } from '../utils/auth';

export default function Home() {
  const { user } = useAuth();
  const [soundscapes, setSoundscapes] = useState(null);
  const getSoundscapesDrillable = () => {
    getSoundscapes(user.uid).then(setSoundscapes);
  };

  const deleteAndUpdate = (pk) => {
    if (window.confirm('Delete this soundscape?')) {
      deleteAllChordProgressions(pk).then(() => {
        deleteSoundscape(pk).then(getSoundscapesDrillable);
      });
    }
  };

  const deleteUserAndDataWarn = (uid) => {
    if (window.confirm('Delete user and all data?')) {
      deleteUser(uid).then(() => {
        signOut();
      });
    }
  };

  useEffect(() => {
    getSoundscapesDrillable();
    document.title = 'Harmonious Volt';
  }, []);

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
            Sign Out?
            <button type="button" className="soundButton" onClick={() => signOut()}>Sign Out</button>
            <div className="spacer" />
          </div>
          <div className="homeCard">
            <div className="spacer" />
            Delete User?
            <button type="button" className="soundButton" onClick={() => deleteUserAndDataWarn(user.uid)}>Delete</button>
            <div className="spacer" />
          </div>
        </div>
      </>
    );
  }
  return <EmptyBands displayName={user.fbUser.displayName} />;
}
