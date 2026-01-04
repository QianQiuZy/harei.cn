export default function MessageCard({ message, onOpen }) {
  return (
    <button type="button" className="message-card" onClick={() => onOpen(message)}>
      <div className="message-card__tag">{message.tag || '未分类'}</div>
      <p className="message-card__text">{message.message_text}</p>
      {message.image_thumbnail_url && (
        <img
          className="message-card__image"
          src={message.image_thumbnail_url}
          alt="留言图片缩略图"
          loading="lazy"
        />
      )}
      <div className="message-card__meta">
        <span>{message.created_at_display}</span>
      </div>
    </button>
  );
}
