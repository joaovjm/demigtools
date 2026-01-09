import React, { useState, useEffect } from 'react'
import styles from './modalsendemail.module.css'
import { FaEnvelope, FaTimes, FaPaperPlane, FaImage, FaTrash, FaVideo } from 'react-icons/fa';
import { getCampains } from '../../helper/getCampains';
import { getCampainTexts } from '../../helper/getCampainTexts';

const ModalSendEmail = ({ donor_email, donor_name, setModalSendEmail }) => {
  const [emailTo, setEmailTo] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null); // 'image' ou 'video'
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  // Estados para campanhas e textos
  const [campains, setCampains] = useState([]);
  const [campainTexts, setCampainTexts] = useState([]);
  const [selectedCampainId, setSelectedCampainId] = useState('');
  const [selectedTextId, setSelectedTextId] = useState('');
  const [campainsWithTexts, setCampainsWithTexts] = useState([]);

  // Preenche o email automaticamente se vier do prop
  useEffect(() => {
    if (donor_email) {
      setEmailTo(donor_email);
    }
  }, [donor_email]);

  // Buscar campanhas e textos ao carregar o componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campainsData, textsData] = await Promise.all([
          getCampains(),
          getCampainTexts()
        ]);
        
        setCampains(campainsData || []);
        setCampainTexts(textsData || []);
        
        // Filtrar campanhas que têm textos
        const campainsWithTextsIds = [...new Set(textsData.map(text => text.campain_id))];
        const filtered = campainsData.filter(camp => campainsWithTextsIds.includes(camp.id));
        setCampainsWithTexts(filtered);
      } catch (error) {
        console.error('Erro ao buscar campanhas:', error);
      }
    };
    
    fetchData();
  }, []);

  // Quando selecionar uma campanha, filtrar os textos dela
  useEffect(() => {
    if (selectedCampainId) {
      const textsForCampain = campainTexts.filter(
        text => text.campain_id === parseInt(selectedCampainId)
      );
      // Se houver apenas um texto, seleciona automaticamente
      if (textsForCampain.length === 1) {
        setSelectedTextId(textsForCampain[0].id.toString());
      }
    } else {
      setSelectedTextId('');
    }
  }, [selectedCampainId, campainTexts]);

  // Quando selecionar um texto, preencher o formulário
  useEffect(() => {
    if (selectedTextId) {
      const selectedText = campainTexts.find(
        text => text.id === parseInt(selectedTextId)
      );
      
      if (selectedText) {
        setSubject(selectedText.title);
        
        // Substituir {{imagem}} e {{video}} por marcadores para compatibilidade
        let content = selectedText.content.replace(/\{\{imagem\}\}/gi, '[IMAGEM]');
        content = content.replace(/\{\{video\}\}/gi, '[VIDEO]');
        setMessage(content);
        
        // Se o texto tem imagem anexada, carregar a imagem
        if (selectedText.image) {
          setMediaPreview(selectedText.image);
          setMediaType('image');
          setMedia({ name: 'imagem_campanha.jpg', type: 'image/jpeg' });
        }
        // Se o texto tem vídeo anexado, carregar o vídeo
        else if (selectedText.video) {
          setMediaPreview(selectedText.video);
          setMediaType('video');
          setMedia({ name: 'video_campanha.mp4', type: 'video/mp4' });
        }
      }
    }
  }, [selectedTextId, campainTexts]);

  // Função para lidar com seleção de mídia (imagem ou vídeo)
  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      // Validar tipo de arquivo
      if (!isImage && !isVideo) {
        setStatus({ type: 'error', message: 'Por favor, selecione apenas arquivos de imagem ou vídeo.' });
        return;
      }
      
      // Validar tamanho
      const maxImageSize = 5 * 1024 * 1024; // 5MB para imagens
      const maxVideoSize = 25 * 1024 * 1024; // 25MB para vídeos
      const maxSize = isVideo ? maxVideoSize : maxImageSize;
      
      if (file.size > maxSize) {
        const sizeLabel = isVideo ? '25MB' : '5MB';
        const typeLabel = isVideo ? 'vídeo' : 'imagem';
        setStatus({ type: 'error', message: `O ${typeLabel} deve ter no máximo ${sizeLabel}.` });
        return;
      }

      setMedia(file);
      setMediaType(isVideo ? 'video' : 'image');
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setStatus({ type: '', message: '' });
    }
  };

  // Função para remover mídia
  const handleRemoveMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    setMediaType(null);
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

      // Substituir {{nome_doador}} pelo nome real do doador
      let processedMessage = message;
      if (donor_name) {
        processedMessage = processedMessage.replace(/\{\{nome_doador\}\}/gi, donor_name);
      }

      // Preparar o body com a mídia se existir
      const emailData = {
        emailTo,
        subject,
        text: processedMessage,
      };

      // Se houver mídia, adicionar ao payload
      if (media && mediaPreview) {
        const mediaData = {
          filename: media.name,
          content: mediaPreview.split(',')[1], // Remove o prefixo "data:...;base64,"
          contentType: media.type,
        };
        
        if (mediaType === 'video') {
          emailData.video = mediaData;
        } else {
          emailData.image = mediaData;
        }
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
          setMedia(null);
          setMediaPreview(null);
          setMediaType(null);
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

                    {/* Seleção de Campanha */}
                    <div className={styles.searchInputGroup}>
                        <label>📋 Usar Mensagem de Campanha (opcional)</label>
                        <select
                            className={styles.searchInput}
                            value={selectedCampainId}
                            onChange={(e) => {
                              setSelectedCampainId(e.target.value);
                              setSelectedTextId(''); // Limpa o texto selecionado
                            }}
                        >
                            <option value="">Selecione uma campanha...</option>
                            {campainsWithTexts.map((camp) => (
                                <option key={camp.id} value={camp.id}>
                                    {camp.campain_name}
                                </option>
                            ))}
                        </select>
                        {campainsWithTexts.length === 0 && (
                            <small style={{ color: '#999', fontSize: '0.85em', marginTop: '5px', display: 'block' }}>
                                ℹ️ Nenhuma campanha com textos cadastrados ainda
                            </small>
                        )}
                    </div>

                    {/* Seleção de Texto da Campanha */}
                    {selectedCampainId && (
                        <div className={styles.searchInputGroup}>
                            <label>📝 Selecione o Texto</label>
                            <select
                                className={styles.searchInput}
                                value={selectedTextId}
                                onChange={(e) => setSelectedTextId(e.target.value)}
                            >
                                <option value="">Escolha um texto...</option>
                                {campainTexts
                                    .filter(text => text.campain_id === parseInt(selectedCampainId))
                                    .map((text) => (
                                        <option key={text.id} value={text.id}>
                                            {text.title}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}

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
                            💡 Dica: Use <strong>[IMAGEM]</strong> ou <strong>[VIDEO]</strong> no texto para posicionar a mídia onde desejar
                        </small>
                    </div>

                    <div className={styles.searchInputGroup}>
                        <label>Anexar Imagem ou Vídeo (opcional)</label>
                        <div className={styles.imageUploadContainer}>
                            <input 
                                type="file" 
                                id="media-upload"
                                accept="image/*,video/*"
                                onChange={handleMediaChange}
                                className={styles.imageInput}
                            />
                            <label htmlFor="media-upload" className={styles.imageUploadLabel}>
                                <FaImage /> <FaVideo /> Escolher Mídia
                            </label>
                            {mediaPreview && (
                                <div className={styles.imagePreviewContainer}>
                                    {mediaType === 'video' ? (
                                        <video 
                                            src={mediaPreview} 
                                            controls
                                            className={styles.videoPreview}
                                        >
                                            Seu navegador não suporta vídeos.
                                        </video>
                                    ) : (
                                        <img 
                                            src={mediaPreview} 
                                            alt="Preview" 
                                            className={styles.imagePreview}
                                        />
                                    )}
                                    <button 
                                        type="button"
                                        onClick={handleRemoveMedia}
                                        className={styles.removeImageButton}
                                        title="Remover mídia"
                                    >
                                        <FaTrash />
                                    </button>
                                    <span className={styles.imageName}>
                                        {mediaType === 'video' ? '🎬' : '📷'} {media?.name}
                                    </span>
                                </div>
                            )}
                        </div>
                        <small style={{ color: '#888', fontSize: '0.8em', marginTop: '5px', display: 'block' }}>
                            📷 Imagens: máx. 5MB | 🎬 Vídeos: máx. 25MB
                        </small>
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