import { signIn } from '../utils/auth';
import TopNavigation from './TopNavigation';

function Signin2() {
  return (
    <>
      <TopNavigation />
      <div className="homeCard">
        <div className="spacer" />
        Ready to make some soundscapes?
        <button type="button" className="soundButton" onClick={signIn}>Sign In</button>
        <div className="spacer" />
      </div>
    </>
  );
}

export default Signin2;
