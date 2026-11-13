// Centralized Avatar Utility for AgriConnect
// Provides cartoon avatars (DiceBear Adventurer) and canonical verified Indian farmer portraits

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
 * Canonical 1-to-1 Farmer Avatar Mappings.
 * Guarantees every person has ONE and ONLY ONE consistent profile photo across the entire site.
 */
export const CANONICAL_FARMER_AVATARS = {
  'Ramesh Patel': '/avatars/ramesh-patel.jpg',
  'Rameshwar Patil': '/avatars/ramesh-patel.jpg',
  'Lakshmi Devi': '/avatars/lakshmi-devi.jpg',
  'Lakshmi Narayanan': '/avatars/lakshmi-devi.jpg',
  'Gurpreet Singh': '/avatars/gurpreet-singh.jpg',
  'Suresh Kumar': '/avatars/suresh-kumar.jpg',
  'Ananya Sharma': '/avatars/ananya-sharma.jpg',
};

/**
 * Curated authentic Indian farmer portraits
 */
export const INDIAN_FARMER_PHOTOS = [
  '/avatars/ramesh-patel.jpg',
  '/avatars/lakshmi-devi.jpg',
  '/avatars/gurpreet-singh.jpg',
  '/avatars/suresh-kumar.jpg',
  '/avatars/ananya-sharma.jpg',
];

/**
 * Returns a valid avatar for a user:
 * 1. Checks canonical farmer mapping by name.
 * 2. Checks custom uploaded photo or non-western avatar if present.
 * 3. Falls back to consistent cartoon avatar.
 */
export function getUserAvatar(user, fallbackRole = 'farmer') {
  const name = user?.name || (typeof user === 'string' ? user : '');

  if (name && CANONICAL_FARMER_AVATARS[name]) {
    return CANONICAL_FARMER_AVATARS[name];
  }

  if (user?.avatar && typeof user.avatar === 'string' && user.avatar.trim()) {
    const av = user.avatar.trim();
    // Replace old western placeholders or legacy misidentified photos
    if (
      av.includes('photo-1595273670150-bd0c3c392e46') || 
      av.includes('photo-1534528741775-53994a69daeb') ||
      av.includes('photo-1544717305-2782549b5136') ||
      av.includes('photo-1507003211169-0a1dd7228f2d') ||
      av.includes('photo-1544005313-94ddf0286df2') ||
      av.includes('photo-1500648767791-00dcc994a43e') ||
      av.includes('photo-1573496359142-b8d87734a5a2') ||
      av.includes('photo-1595475207225-428b62bda831') ||
      av.includes('photo-1567427017947-545c5f8d16ad') ||
      av.includes('photo-1607604276583-eef5d076aa5f')
    ) {
      if (name && CANONICAL_FARMER_AVATARS[name]) {
        return CANONICAL_FARMER_AVATARS[name];
      }
      return getCartoonAvatar(name || 'AgriUser', user.role || fallbackRole);
    }
    return av;
  }

  return getCartoonAvatar(name || 'AgriUser', user?.role || fallbackRole);
}
