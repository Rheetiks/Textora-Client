import React, { useState, useEffect } from 'react';
import "./styles.scss";

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
};

const getInitials = (name) => {
  const parts = name.split(' ');
  if (parts.length > 1) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const ConnectedUsers = ({ users }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isSmallScreen = useMediaQuery('(max-width: 768px)');

  const maxAvatars = isSmallScreen ? 1 : 3;
  const usersToShow = users.slice(0, maxAvatars);
  const remainingUsers = users.length > maxAvatars ? users.length - maxAvatars : 0;

  return (
    <>
      <div className="connected-users">
        <div className="avatar-stack" onClick={() => setIsModalOpen(true)}>
          {usersToShow.map(user => (
            <div
              key={user.name}
              className="user-avatar"
              style={{ backgroundColor: user.color }}
              title={user.name}
            >
              {getInitials(user.name)}
            </div>
          ))}
          {remainingUsers > 0 && (
            <div className="user-avatar remaining-count" title={`${remainingUsers} more`}>
              +{remainingUsers}
            </div>
          )}
        </div>
      </div>
      
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>All Connected Users ({users.length})</h3>
              <button onClick={() => setIsModalOpen(false)}>&times;</button>
            </div>
            <ul className="modal-user-list">
              {users.map(user => (
                <li key={user.name}>
                  <span className="user-dot" style={{ backgroundColor: user.color }}></span>
                  {user.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default ConnectedUsers;