import React, { createContext, useContext } from 'react';
import { Profile } from '../types/finance';

interface ProfileContextType {
  profile: Profile;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}

export const ProfileProvider = ProfileContext.Provider;