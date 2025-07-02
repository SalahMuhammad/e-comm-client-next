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

export default function UserAvatar({ username, imageUrl }) {
  const initial = username?.charAt(0)?.toUpperCase() || '?';
  const bgColor = getDeterministicColor(username || 'default');

  if (imageUrl) {
    return (
      <img
        className="w-8 h-8 rounded-full object-cover"
        src={imageUrl}
        alt="user photo"
      />
    );
  }

  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${bgColor}`}>
      {initial}
    </div>
  );
}