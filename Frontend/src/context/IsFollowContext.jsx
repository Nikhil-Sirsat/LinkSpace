import { createContext, useState } from 'react';

export const FollowContext = createContext();

export const FollowProvider = ({ children }) => {
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    return (
        <FollowContext.Provider value={{ followersCount, setFollowersCount, followingCount, setFollowingCount }}>
            {children}
        </FollowContext.Provider>
    );
};
