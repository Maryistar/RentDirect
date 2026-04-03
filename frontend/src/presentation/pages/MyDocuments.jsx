import React, { useEffect, useState } from "react";
import { useAuth } from "../../application/context/AuthContext";

const MyDocuments = () => {
  const { token } = useAuth();
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/v1/documents/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setDocs(data.data || []);
    } catch (err) {
      console.error("Error cargando documentos", err);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Sin fecha";
    return new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeLabel = (type) => {
    if (type === "contract") return "Contrato de arrendamiento";
    return type;
  };

  return (
    <div className="container">
      <div className="card">
        <h2 className="title">📂 Mis documentos</h2>

        {docs.length === 0 ? (
          <p className="empty">No tienes documentos aún</p>
        ) : (
          <div className="list">
            {docs.map((doc) => (
              <div key={doc.id} className="docCard">
                <div className="info">
                  <h3>{getTypeLabel(doc.type)}</h3>
                  <p>📅 {formatDate(doc.created_at)}</p>
                </div>

                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="downloadBtn"
                >
                  Descargar 📄
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .container {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: #f4f6f9;
          padding: 40px 20px;
        }

        .card {
          width: 600px;
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }

        .title {
          text-align: center;
          margin-bottom: 25px;
        }

        .empty {
          text-align: center;
          color: gray;
        }

        .list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .docCard {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px;
          border-radius: 12px;
          background: #f9fafc;
        }

        .info h3 {
          margin: 0;
        }

        .info p {
          margin: 5px 0 0;
          font-size: 14px;
          color: gray;
        }

        .downloadBtn {
          padding: 10px 15px;
          background: #4CAF50;
          color: white;
          border-radius: 10px;
          text-decoration: none;
          font-weight: bold;
          transition: 0.2s;
        }

        .downloadBtn:hover {
          background: #43a047;
        }
      `}</style>
    </div>
  );
};

export default MyDocuments;