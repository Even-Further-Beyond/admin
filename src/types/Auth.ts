interface Identity {
  user_id: string;
  provider: string;
  connection: string;
  isSocial: boolean;
}

interface Profile {
  clientID: string;
  created_at: string;
  email: string;
  email_verified: boolean;
  identity: Identity[];
  last_password_reset: string;
  name: string;
  nickname: string;
  picture: string;
  roles: string[];
  sub: string;
  update_at: string;
  user_id: string;
  user_metadata: {};
}

interface Auth {
  isAuthenticated: boolean;
  isFetching: boolean;
  profile: Profile;
  error: { description: string };
}

export default Auth;
