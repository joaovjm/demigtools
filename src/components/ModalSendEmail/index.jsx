import React, { useState, useEffect } from 'react'
import styles from './modalsendemail.module.css'
import { FaEnvelope, FaTimes, FaPaperPlane, FaImage, FaTrash } from 'react-icons/fa';

const ModalSendEmail = ({ donor_email, setModalSendEmail }) => {
  const [emailTo, setEmailTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Preenche o email automaticamente se vier do prop
  useEffect(() => {
    if (donor_email) {
      setEmailTo(donor_email);
    }
  }, [donor_email]);

  // Função para lidar com seleção de imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        setStatus({ type: 'error', message: 'Por favor, selecione apenas arquivos de imagem.' });
        return;
      }
      
      // Validar tamanho (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB em bytes
      if (file.size > maxSize) {
        setStatus({ type: 'error', message: 'A imagem deve ter no máximo 5MB.' });
        return;
      }

      setImage(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setStatus({ type: '', message: '' });
    }
  };

  // Função para remover imagem
  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

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

      // Preparar o body com a imagem se existir
      const emailData = {
        emailTo,
        subject,
        text: message,
      };

      // Se houver imagem, adicionar ao payload
      if (image && imagePreview) {
        emailData.image = {
          filename: image.name,
          content: imagePreview.split(',')[1], // Remove o prefixo "data:image/...;base64,"
          contentType: image.type,
        };
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(emailData),
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
          setImage(null);
          setImagePreview(null);
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
                        <small style={{ color: '#666', fontSize: '0.85em', marginTop: '5px', display: 'block' }}>
                            💡 Dica: Use <strong>[IMAGEM]</strong> no texto para posicionar a imagem onde desejar
                        </small>
                    </div>

                    <div className={styles.searchInputGroup}>
                        <label>Anexar Imagem (opcional)</label>
                        <div className={styles.imageUploadContainer}>
                            <input 
                                type="file" 
                                id="image-upload"
                                accept="image/*"
                                onChange={handleImageChange}
                                className={styles.imageInput}
                            />
                            <label htmlFor="image-upload" className={styles.imageUploadLabel}>
                                <FaImage /> Escolher Imagem
                            </label>
                            {imagePreview && (
                                <div className={styles.imagePreviewContainer}>
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        className={styles.imagePreview}
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className={styles.removeImageButton}
                                        title="Remover imagem"
                                    >
                                        <FaTrash />
                                    </button>
                                    <span className={styles.imageName}>{image?.name}</span>
                                </div>
                            )}
                        </div>
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