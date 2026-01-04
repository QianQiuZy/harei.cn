import { useEffect } from 'react';

export default function MessageModal({ message, onClose }) {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__content">
        <button type="button" className="modal__close" onClick={onClose}>
          退出
        </button>
        <div className="modal__body">
          <h2>{message.tag || '未分类'}</h2>
          <p>{message.message_text}</p>
          {message.image_url && (
            <img className="modal__image" src={message.image_url} alt="留言图片" />
          )}
          <div className="modal__meta">提交时间：{message.created_at_display}</div>
        </div>
      </div>
    </div>
  );
}
