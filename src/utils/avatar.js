// Centralized Avatar Utility for AgriConnect
// Provides cartoon avatars (DiceBear Adventurer) and authentic Indian farmer defaults

/**
 * Returns a personalized cartoon avatar URL.
 * Generates consistent, high-quality cartoon SVGs based on name and role.
 */
export function getCartoonAvatar(name = 'User', role = 'farmer') {
  const seed = encodeURIComponent((name || 'Farmer').trim());
  // Adventurer style creates cheerful cartoon characters with organic colors
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
}

/**
 * Curated authentic Indian farmer portraits from Unsplash
 */
export const INDIAN_FARMER_PHOTOS = [
  'https://images.unsplash.com/photo-1595475207225-428b62bda831?auto=format&fit=crop&w=400&q=80', // Indian farmer with turban in mustard field
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=400&q=80', // Smiling Indian farmer in lush green farm
  'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?auto=format&fit=crop&w=400&q=80', // Indian woman farmer in traditional attire
  'https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=400&q=80', // Elderly Indian farmer with white mustache and turban
  'https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=400&q=80', // Indian agriculturalist in organic farm
];

/**
 * Returns a valid avatar for a user:
 * 1. Their custom uploaded photo or non-western avatar if present.
 * 2. If it was an old placeholder or empty, returns a friendly cartoon avatar.
 */
export function getUserAvatar(user, fallbackRole = 'farmer') {
  if (user?.avatar && typeof user.avatar === 'string' && user.avatar.trim()) {
    const av = user.avatar.trim();
    // Replace old western placeholders with cartoon avatar
    if (
      av.includes('photo-1595273670150-bd0c3c392e46') || 
      av.includes('photo-1534528741775-53994a69daeb') ||
      av.includes('photo-1544717305-2782549b5136') ||
      av.includes('photo-1507003211169-0a1dd7228f2d') ||
      av.includes('photo-1544005313-94ddf0286df2') ||
      av.includes('photo-1500648767791-00dcc994a43e') ||
      av.includes('photo-1573496359142-b8d87734a5a2')
    ) {
      return getCartoonAvatar(user.name || 'AgriUser', user.role || fallbackRole);
    }
    return av;
  }
  return getCartoonAvatar(user?.name || 'AgriUser', user?.role || fallbackRole);
}

