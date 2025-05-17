export interface Profile {
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string;
}

export interface ProfileUpdateRequest {
  first_name?: string;
  last_name?: string;
}
