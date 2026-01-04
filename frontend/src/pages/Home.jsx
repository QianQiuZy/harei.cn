import { useEffect, useState } from 'react';
import { fetchTags, submitMessage } from '../services/api.js';

export default function Home() {
  const [messageText, setMessageText] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [status, setStatus] = useState({ type: 'idle', message: '' });

  useEffect(() => {
    fetchTags()
      .then((data) => setTags(data.tags || []))
      .catch(() => setTags([]));
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    setStatus({ type: 'loading', message: '提交中…' });

    try {
      const payload = new FormData();
      payload.append('message_text', messageText);
      payload.append('tag', tag);
      if (imageFile) {
        payload.append('image', imageFile);
      }

      await submitMessage(payload);
      setMessageText('');
      setTag('');
      setImageFile(null);
      setStatus({ type: 'success', message: '提交成功，感谢参与！' });
    } catch (error) {
      setStatus({ type: 'error', message: error.message || '提交失败，请稍后重试。' });
    }
  };

  return (
    <section className="panel">
      <div className="panel__header">
        <h1>留下你的提问或留言</h1>
        <p>所有内容将由后台审核后展示在留言区。</p>
      </div>
      <form className="form" onSubmit={onSubmit}>
        <label className="form__field">
          <span>留言内容</span>
          <textarea
            value={messageText}
            onChange={(event) => setMessageText(event.target.value)}
            placeholder="写下你的问题或想说的话"
            required
          />
        </label>
        <label className="form__field">
          <span>标签</span>
          <input
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            placeholder="例如：直播 / 生活 / 互动"
            list="tag-options"
          />
        </label>
        <datalist id="tag-options">
          {tags.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
        <label className="form__field">
          <span>图片（可选）</span>
          <input
            type="file"
            accept="image/*"
            onChange={(event) => setImageFile(event.target.files?.[0] || null)}
          />
        </label>
        <button className="button" type="submit" disabled={status.type === 'loading'}>
          提交到提问箱
        </button>
        {status.type !== 'idle' && <div className={`status status--${status.type}`}>{status.message}</div>}
      </form>
    </section>
  );
}
