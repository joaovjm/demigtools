import React, { useState, useEffect } from 'react'
import styles from './modalsendemail.module.css'
import { FaEnvelope, FaTimes, FaPaperPlane } from 'react-icons/fa';

const ModalSendEmail = ({ donor_email, setModalSendEmail }) => {
  const [emailTo, setEmailTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Preenche o email automaticamente se vier do prop
  useEffect(() => {
    if (donor_email) {
      setEmailTo(donor_email);
    }
  }, [donor_email]);

  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    // Validações
    if (!emailTo || !subject || !message) {
      setStatus({ type: 'error', message: 'Por favor, preencha todos os campos.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // URL da API - ajustada para funcionar com Vercel
      const apiUrl = '/api/send-email';

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          emailTo,
          subject,
          text: message,
        }),
      });

      // Verifica se a resposta tem conteúdo antes de fazer parse
      const contentType = response.headers.get('content-type');
      let data = {};
      
      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        if (text) {
          data = JSON.parse(text);
        }
      }

      if (response.ok) {
        setStatus({ type: 'success', message: 'Email enviado com sucesso!' });
        // Limpa os campos após 2 segundos
        setTimeout(() => {
          setSubject('');
          setMessage('');
          setStatus({ type: '', message: '' });
        }, 2000);
      } else {
        const errorMessage = data.message || data.error || `Erro ${response.status}: ${response.statusText}`;
        setStatus({ type: 'error', message: errorMessage });
        console.error('Erro na resposta:', { status: response.status, data });
      }
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      setStatus({ 
        type: 'error', 
        message: `Erro ao conectar com o servidor: ${error.message}` 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalSendEmailContainer}>
        <div className={styles.modalSendEmailContent}>
            <div className={styles.modalSendEmailHeader}>
                <h3><FaEnvelope /> Envio de Email</h3>
                <button className={styles.modalSendEmailHeaderButtonExit} onClick={() => setModalSendEmail(false)}>
                    <FaTimes />
                </button>
            </div>
            <div className={styles.modalSendEmailBody}>
                <form onSubmit={handleSendEmail}>
                    <div className={styles.searchInputGroup}>
                        <label>Email do Destinatário</label>
                        <input 
                            className={styles.searchInput} 
                            type="email" 
                            value={emailTo}
                            onChange={(e) => setEmailTo(e.target.value)}
                            placeholder="exemplo@email.com"
                            required
                        />
                    </div>

                    <div className={styles.searchInputGroup}>
                        <label>Assunto</label>
                        <input 
                            className={styles.searchInput} 
                            type="text" 
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Assunto do email"
                            required
                        />
                    </div>

                    <div className={styles.searchInputGroup}>
                        <label>Mensagem</label>
                        <textarea 
                            className={styles.searchTextarea} 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Digite sua mensagem aqui..."
                            rows="10"
                            required
                        />
                    </div>

                    {status.message && (
                        <div className={`${styles.statusMessage} ${styles[status.type]}`}>
                            {status.message}
                        </div>
                    )}

                    <div className={styles.buttonGroup}>
                        <button 
                            type="submit" 
                            className={styles.sendButton}
                            disabled={loading}
                        >
                            {loading ? (
                                <>Enviando...</>
                            ) : (
                                <>
                                    <FaPaperPlane /> Enviar Email
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default ModalSendEmail;