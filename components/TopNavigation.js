import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../utils/context/authContext';

function TopNavigation() {
  const { user } = useAuth();
  const router = useRouter();
  const isProfile = router.pathname.includes('profile');
  return (
    <div className="navigationButtonsContainer">
      <Link passHref href="/">
        <div role="button" className="logo">Mosaica</div>
      </Link>
      <div className="navBarSpacer" />
      <button className={`button1${isProfile ? ' buttonSelected' : ''}`} type="button" onClick={() => router.push(`/profile/${user.uid}`)}>
        Profile
      </button>
      {/* <button className="button1" type="button" onClick={() => console.warn('groups')}>
        Groups
      </button> */}
    </div>
  );
}

export default TopNavigation;
