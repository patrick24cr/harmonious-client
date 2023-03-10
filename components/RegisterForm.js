import PropTypes from 'prop-types';
import { registerUser } from '../utils/auth'; // Update with path to registerUser

function RegisterForm({ user, updateUser, onUpdate }) {
  const handleClick = () => {
    registerUser(user).then(() => {
      updateUser(user).then(() => onUpdate);
    });
  };
  return (
    <div className="profileInfo">
      <h1>Welcome</h1>
      <button type="button" className="button1" onClick={handleClick}>
        Create New Sounds?
      </button>
    </div>
  );
}

RegisterForm.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    valid: PropTypes.bool,
  }).isRequired,
  updateUser: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default RegisterForm;
