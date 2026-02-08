const bgColors = [
  'bg-red-500',
  'bg-green-500',
  'bg-blue-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-orange-500'
];

function getDeterministicColor(username) {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % bgColors.length;
  return bgColors[index];
}

// import { UserIcon } from '@heroicons/react/24/solid';
import { API_BASE_URL } from '@/config/api';

export default function UserAvatar({ username, imageUrl, className = "w-8 h-8" }) {
  const initial = username?.charAt(0)?.toUpperCase() || '?';
  const bgColor = getDeterministicColor(username || 'default');

  if (imageUrl) {
    const src = imageUrl.startsWith('http') ? imageUrl : `${API_BASE_URL}${imageUrl}`;
    return (
      <img
        className={`${className} rounded-full object-cover`}
        src={src}
        alt="user photo"
      />
    );
  }

  return (
    // <div className={`${className} rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-400`}>
    //   <UserIcon className="w-3/5 h-3/5" />
    // </div>

    <div className={`w-full h-full min-w-8 min-h-8 rounded-full flex items-center justify-center text-white font-bold ${bgColor}`}>
      {initial}
    </div>
  );
}