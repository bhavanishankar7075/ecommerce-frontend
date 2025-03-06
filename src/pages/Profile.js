import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="container py-5 my-5">
      <h1 className="mb-4">Profile</h1>
      <div className="form-container">
        <h3>Username: {user.username}</h3>
        <p>Email: Not set (add backend support)</p>
        <button className="btn btn-primary">Edit Profile (Coming Soon)</button>
      </div>
    </div>
  );
}

export default Profile;

