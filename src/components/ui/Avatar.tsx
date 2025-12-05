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
  status?: string;
};

const Avatar = ({
  name,
  avatarStyle,
  avatarUrl,
  status
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

  const statusSize = Math.min(height, width) * 0.4; 
  const statusStyle = {
    height: `${statusSize}px`,
    width: `${statusSize}px`,
    backgroundColor: status === 'away' ? '#10b981' : 'gray',
    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
  };

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
        flexShrink: 0,
        position: 'relative'
      }}
    >
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          style={{
            height: '100%',
            width: '100%',
            objectFit: 'cover',
            borderRadius: '50%'
          }}
        />
      ) : (
        initials
      )}
      
       {status && <div
          style={{
            position: 'absolute',
            right: -statusSize * 0.1,
            bottom: -statusSize * 0.1,
            borderRadius: '50%',
            ...statusStyle
          }}
        />}
    </div>
  );
};

export default Avatar;
