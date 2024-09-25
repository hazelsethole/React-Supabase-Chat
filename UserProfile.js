import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const UserProfile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = supabase.auth.user();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error) console.error('Error fetching profile:', error);
        else setProfile(data);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      {profile ? (
        <div>
          <h2>{profile.username}</h2>
          <p>{profile.bio}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
