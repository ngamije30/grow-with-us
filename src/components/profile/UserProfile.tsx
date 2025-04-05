import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../../store/auth.store';

export const UserProfile = () => {
  const user = useAuthStore((state) => state.user);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.profileImage || '',
  });

  const { mutate: updateProfile } = useMutation(
    async (data: typeof profileData) => {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    },
    {
      onSuccess: () => {
        setEditMode(false);
      },
    }
  );

  return (
    <div className="user-profile">
      <div className="profile-header">
        <img 
          src={profileData.avatar || '/default-avatar.png'} 
          alt="Profile"
          className="profile-avatar"
        />
        {editMode ? (
          <input
            type="text"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
          />
        ) : (
          <h2>{profileData.name}</h2>
        )}
      </div>

      <div className="profile-content">
        {editMode ? (
          <>
            <textarea
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            />
            <button onClick={() => updateProfile(profileData)}>Save</button>
            <button onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <p>{profileData.bio}</p>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </div>
  );
};