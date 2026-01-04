import { useEffect, useMemo, useState } from 'react';
import MessageCard from '../components/MessageCard.jsx';
import MessageModal from '../components/MessageModal.jsx';
import { fetchMessages, fetchTags } from '../services/api.js';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const [tags, setTags] = useState([]);
  const [activeTag, setActiveTag] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchMessages(''), fetchTags()])
      .then(([messageData, tagData]) => {
        setMessages(messageData.messages || []);
        setTags(tagData.tags || []);
      })
      .catch(() => {
        setMessages([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleMessages = useMemo(() => {
    if (!activeTag) {
      return messages;
    }
    return messages.filter((message) => message.tag === activeTag);
  }, [messages, activeTag]);

  return (
    <section className="panel">
      <div className="panel__header">
        <h1>留言展示</h1>
        <p>点击卡片可全屏查看完整内容。</p>
      </div>
      <div className="tag-filter">
        <button
          type="button"
          className={`tag-filter__item ${activeTag === '' ? 'is-active' : ''}`}
          onClick={() => setActiveTag('')}
        >
          全部
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`tag-filter__item ${activeTag === tag ? 'is-active' : ''}`}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      {loading ? (
        <div className="status">加载中…</div>
      ) : (
        <div className="message-grid">
          {visibleMessages.map((message) => (
            <MessageCard key={message.message_id} message={message} onOpen={setActiveMessage} />
          ))}
          {visibleMessages.length === 0 && <div className="status">暂无内容</div>}
        </div>
      )}
      <MessageModal message={activeMessage} onClose={() => setActiveMessage(null)} />
    </section>
  );
}
