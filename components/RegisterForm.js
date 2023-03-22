import PropTypes from 'prop-types';
import { registerUser } from '../utils/auth'; // Update with path to registerUser
import TopNavigation from './TopNavigation';

function RegisterForm({ user, onUpdate }) {
  const handleClick = () => {
    registerUser(user).then(() => {
      onUpdate(user.uid);
    });
  };
  return (
    // <div className="profileInfo">
    //   <h1>Welcome</h1>
    //   <button type="button" className="button1" onClick={handleClick}>
    //     Create New Sounds?
    //   </button>
    // </div>
    <>
      <TopNavigation />
      <div className="homeCard">
        <div className="spacer" />
        Designed for desktops running Chrome
        <button type="button" className="soundButton" onClick={handleClick}>Proceed...</button>
        <div className="spacer" />
      </div>
    </>
  );
}

RegisterForm.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    valid: PropTypes.bool,
  }).isRequired,
  // updateUser: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default RegisterForm;
