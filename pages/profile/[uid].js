import React from 'react';
import { useRouter } from 'next/router';
import TopNavigation from '../../components/TopNavigation';
import { deleteAllScoresById } from '../../api/scores';
import deleteUser from '../../api/user';
import { useAuth } from '../../utils/context/authContext';
import { signOut } from '../../utils/auth';

export default function Profile() {
  const { user } = useAuth();
  const router = useRouter();
  const { uid } = router.query;
  return (
    <div className="container1">
      <TopNavigation />
      <div className="profileInfo">
        <p>User: {uid}</p>
        <button className="button1" type="button" onClick={() => deleteAllScoresById(user.id).then(() => router.push('/'))}>
          Reset User Scores
        </button> <br />
        <button
          className="button1"
          type="button"
          onClick={() => deleteAllScoresById(user.id).then(() => {
            deleteUser(user.id).then(() => {
              signOut();
              router.push('/');
            });
          })}
        >
          Delete User
        </button> <br />
        <button className="button1" type="button" onClick={() => signOut()}>
          Sign Out
        </button>
      </div>
    </div>
  );
}
