export default function MessagesTab({ messages, onRead }) {
    return (
        <div className="messages-view">
            <div className="messages-section">
                <h2>Bandeja de mensajes</h2>
                {messages.length === 0 ? (
                    <p className="admin-empty-state">No hay mensajes recibidos.</p>
                ) : (
                    <div className="messages-list">
                        {messages.map((message) => (
                            <div
                                key={message._id}
                                className={`message-item ${message.isRead ? "read" : "unread"}`}
                            >
                                <div className="message-header">
                                    <strong>{message.name}</strong>
                                    <span>{message.email}</span>
                                    <small>{new Date(message.createdAt).toLocaleString("es-AR")}</small>
                                </div>
                                <p>{message.message}</p>
                                {!message.isRead && (
                                    <button className="btn-read-confirm" onClick={() => onRead(message._id)}>
                                        Marcar como leído
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}