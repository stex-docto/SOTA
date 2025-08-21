import { useState, useEffect } from 'react';
import { useAuthWithProfile } from '../hooks/useAuthWithProfile';
import { useDependencies } from '../context/DependencyContext';
import { ProfileEntity } from '@domain';

export function ProfileSection() {
  const { currentUser, currentProfile } = useAuthWithProfile();
  const { profileRepository } = useDependencies();
  const [displayName, setDisplayName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentProfile) {
      setDisplayName(currentProfile.displayName);
    } else if (currentUser && !currentProfile) {
      // No profile exists, auto-enable editing
      setIsEditing(true);
    }
  }, [currentProfile, currentUser]);

  const handleSave = async () => {
    if (!currentUser || !displayName.trim()) return;

    setIsSaving(true);
    try {
      const profile = ProfileEntity.create(displayName.trim(), currentUser.id);
      await profileRepository.save(profile);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    if (currentProfile) {
      setDisplayName(currentProfile.displayName);
      setIsEditing(false);
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="profile-section">
      <h3>Your Profile</h3>
      
      <div className="profile-form">
        <div className="form-group">
          <label htmlFor="displayName">Display Name</label>
          {isEditing ? (
            <div className="edit-mode">
              <input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                disabled={isSaving}
                maxLength={50}
              />
              <div className="form-actions">
                <button 
                  onClick={handleSave} 
                  disabled={isSaving || !displayName.trim()}
                  className="save-btn"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                {currentProfile && (
                  <button 
                    onClick={handleCancel} 
                    disabled={isSaving}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="display-mode">
              <span className="display-value">
                {currentProfile?.displayName || 'No display name set'}
              </span>
              <button onClick={handleEdit} className="edit-btn">
                Edit
              </button>
            </div>
          )}
        </div>

        {!currentProfile && (
          <p className="help-text">
            Set your display name to be shown to other users in events.
          </p>
        )}
      </div>
    </div>
  );
}