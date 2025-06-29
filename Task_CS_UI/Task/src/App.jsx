import { useEffect, useState } from "react";
import axios_api from "./axois_api";
import { jwtDecode } from "jwt-decode";

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [editMessage, setEditMessage] = useState("");
  const [editMessageId, setEditMessageId] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await axios_api.get("/api/messages/");
        setMessages(res.data);
      } catch (error) {
        console.log("Error while fetching messages", error);
      }
    };

    loadMessages();
  }, []);

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddSubmit = async () => {
    const access = localStorage.getItem("access_token");
    const decoded = jwtDecode(access);
    const userId = decoded.user_id;

    try {
      const res = await axios_api.post("/api/messages/", {
        message: newMessage,
        user: userId,
      });
      setMessages((prev) => [res.data, ...prev]);
      setNewMessage("");
      setShowAddModal(false);
    } catch (error) {
      console.log("Error while adding message", error);
    }
  };

  const handleEdit = (id, message) => {
    setEditMessageId(id);
    setEditMessage(message);
    setShowEditModal(true);
  };
  const handleEditSubmit = async () => {
    const access = localStorage.getItem("access_token");
    const decoded = jwtDecode(access);
    const userId = decoded.user_id;

    try {
      const res = await axios_api.put(`/api/message/${editMessageId}/`, {
        message: editMessage,
        user: userId,
      });
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg.id === editMessageId ? res.data : msg))
      );
      setEditMessage("");
      setEditMessageId("");
      setShowEditModal(false);
    } catch (error) {
      console.log("Error while adding message", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios_api.delete(`/api/message/${id}/`);
      if (res.status == 204) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-5">
      {/* Add Message Button */}
      <div className="mb-3 text-end">
        <button className="btn btn-primary btn-sm" onClick={handleAddClick}>
          Add Message
        </button>
      </div>
      {showAddModal && (
        <div className="modal fade show d-block" id="addMessageModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Message</h5>
                <button type="button" className="btn-close"></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Enter your message"
                  rows="3"
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowAddModal(false)}
                >
                  Close
                </button>
                <button className="btn btn-success" onClick={handleAddSubmit}>
                  Save Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal fade show d-block" id="editMessageModal" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Message</h5>
                <button type="button" className="btn-close"></button>
              </div>
              <div className="modal-body">
                <input type="hidden" name="" value={editMessageId} />
                <textarea
                  className="form-control"
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                  placeholder="Enter your message"
                  rows="3"
                ></textarea>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Close
                </button>
                <button className="btn btn-success" onClick={handleEditSubmit}>
                  Save Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row g-4">
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={msg.id}>
              <div className="card h-100 shadow rounded">
                <div className="card-body d-flex flex-column">
                  <p className="card-text flex-grow-1">{msg.message}</p>
                  <div className="d-flex justify-content-between mt-3">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEdit(msg.id, msg.message)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(msg.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No messages yet.</div>
        )}
      </div>
    </div>
  );
}

export default App;
