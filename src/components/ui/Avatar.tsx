type IAvatarProps = {
  name: string;
  avatarStyle?: {
    height?: number;
    width?: number;
    backgroundColor?: string;
    textColor?: string;
    font?: string;
  };
  avatarUrl?: string;
};

const Avatar = ({ 
  name, 
  avatarStyle, 
  avatarUrl 
}: IAvatarProps) => {
  const {
    height = 40,
    width = 40,
    backgroundColor = "#f3f4f6",
    textColor = "#374151",
    font = "system-ui, sans-serif"
  } = avatarStyle || {};

  const words = name.trim().split(/\s+/);
  const initials = words
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);

  return (
    <div 
      style={{
        height: `${height}px`,
        width: `${width}px`,
        backgroundColor,
        color: textColor,
        fontFamily: font,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: `${Math.min(height, width) * 0.4}px`,
        fontWeight: 'bold',
        overflow: 'hidden',
        flexShrink: 0 
      }}
    >
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={name}
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover'
          }}
        />
      ) : (
        initials
      )}
    </div>
  );
};

export default Avatar;
