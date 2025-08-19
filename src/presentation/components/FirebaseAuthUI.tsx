import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { getFirebaseUIAuth, getFirebaseUIConfig } from '@infrastructure/auth/FirebaseUIAdapter';

export function FirebaseAuthUI() {
  const uiConfig = getFirebaseUIConfig();
  const firebaseAuth = getFirebaseUIAuth();

  return (
    <div className="firebase-auth-ui">
      <h2>Please Sign In</h2>
      <StyledFirebaseAuth 
        uiConfig={uiConfig} 
        firebaseAuth={firebaseAuth}
      />
    </div>
  );
}