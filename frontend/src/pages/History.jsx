import { useEffect, useState } from 'react';
import MessageCard from '../components/MessageCard.jsx';
import MessageModal from '../components/MessageModal.jsx';
import { fetchMessages } from '../services/api.js';

export default function History() {
  const [messages, setMessages] = useState([]);
  const [activeMessage, setActiveMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages('?status=archived')
      .then((data) => setMessages(data.messages || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="panel">
      <div className="panel__header">
        <h1>历史提问箱</h1>
        <p>按照时间从旧到新展示。</p>
      </div>
      {loading ? (
        <div className="status">加载中…</div>
      ) : (
        <div className="message-grid">
          {messages.map((message) => (
            <MessageCard key={message.message_id} message={message} onOpen={setActiveMessage} />
          ))}
          {messages.length === 0 && <div className="status">暂无历史内容</div>}
        </div>
      )}
      <MessageModal message={activeMessage} onClose={() => setActiveMessage(null)} />
    </section>
  );
}
