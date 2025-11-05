import React, { useEffect, useState } from "react";
import { getCampains } from "../../helper/getCampains";
import { ICONS } from "../../constants/constants";
import { FaImage, FaTrash } from "react-icons/fa";
import { updateCampains } from "../../helper/updateCampains";
import { deleteCampain } from "../../helper/deleteCampain";
import { insertNewCampain } from "../../helper/insertNewCampain";
import { getCampainTexts } from "../../helper/getCampainTexts";
import { insertCampainText } from "../../helper/insertCampainText";
import { updateCampainText } from "../../helper/updateCampainText";
import { deleteCampainText } from "../../helper/deleteCampainText";
import { toast } from "react-toastify";
import styles from "../../pages/AdminManager/adminmanager.module.css";

const Campain = () => {
  const [campains, setCampains] = useState([]);
  const [newCampain, setNewCampain] = useState();
  const [inEdit, setInEdit] = useState();
  const [reload, setReload] = useState(false);

  // Estados para gerenciar textos das campanhas
  const [campainTexts, setCampainTexts] = useState([]);
  const [selectedCampainId, setSelectedCampainId] = useState("");
  const [textTitle, setTextTitle] = useState("");
  const [textContent, setTextContent] = useState("");
  const [editingTextId, setEditingTextId] = useState(null);
  const [reloadTexts, setReloadTexts] = useState(false);
  
  // Estados para gerenciar imagens
  const [textImage, setTextImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const campain = async () => {
      const response = await getCampains();
      setCampains(response);
    };
    campain();
  }, [inEdit, reload]);

  // Buscar textos quando uma campanha é selecionada
  useEffect(() => {
    const fetchTexts = async () => {
      if (selectedCampainId) {
        const texts = await getCampainTexts(selectedCampainId);
        setCampainTexts(texts);
      } else {
        const texts = await getCampainTexts();
        setCampainTexts(texts);
      }
    };
    fetchTexts();
  }, [selectedCampainId, reloadTexts]);

  const handleChange = (id, field, value) => {
    const update = campains.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setCampains(update);
  };

  const handleEdit = async (id) => {
    if (inEdit) {
      const updateCampain = campains.find((c) => c.id === id);
      await updateCampains(updateCampain);
      setInEdit();
    } else {
      setInEdit(id);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Deseja mesmo deletar esta campanha?")) {
      await deleteCampain(id);
      setReload((prev) => !prev);
    }
  };

  const handleNewCampain = async () => {
    if (newCampain === "") {
      toast.warning("Preencha o campo 'Nova Campanha' corretamente...");
      return;
    }
    await insertNewCampain(newCampain);
    setReload((prev) => !prev);
    setNewCampain("");
  };

  // Função para lidar com seleção de imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      // Validar tamanho (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB em bytes
      if (file.size > maxSize) {
        toast.error('A imagem deve ter no máximo 5MB.');
        return;
      }

      setTextImage(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para remover imagem
  const handleRemoveImage = () => {
    setTextImage(null);
    setImagePreview(null);
  };

  // Funções para gerenciar textos das campanhas
  const handleSaveText = async () => {
    if (!selectedCampainId) {
      toast.warning("Selecione uma campanha!");
      return;
    }
    if (!textTitle.trim()) {
      toast.warning("Digite um título para o texto!");
      return;
    }
    if (!textContent.trim()) {
      toast.warning("Digite o conteúdo do texto!");
      return;
    }

    // Preparar dados do texto
    const textData = {
      campain_id: parseInt(selectedCampainId),
      title: textTitle,
      content: textContent,
    };

    // Adicionar imagem se existir
    if (imagePreview) {
      textData.image = imagePreview; // base64
    }

    if (editingTextId) {
      // Atualizar texto existente
      await updateCampainText(editingTextId, textData);
    } else {
      // Inserir novo texto
      await insertCampainText(textData);
    }

    // Limpar formulário
    setTextTitle("");
    setTextContent("");
    setTextImage(null);
    setImagePreview(null);
    setEditingTextId(null);
    setReloadTexts((prev) => !prev);
  };

  const handleEditText = (text) => {
    setEditingTextId(text.id);
    setTextTitle(text.title);
    setTextContent(text.content);
    setSelectedCampainId(text.campain_id.toString());
    
    // Carregar imagem se existir
    if (text.image) {
      setImagePreview(text.image);
      setTextImage({ name: "imagem_salva.jpg" }); // Placeholder para indicar que há imagem
    }
    
    // Scroll para o formulário
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteText = async (id) => {
    if (window.confirm("Deseja mesmo deletar este texto?")) {
      await deleteCampainText(id);
      setReloadTexts((prev) => !prev);
    }
  };

  const handleCancelEdit = () => {
    setEditingTextId(null);
    setTextTitle("");
    setTextContent("");
    setSelectedCampainId("");
    setTextImage(null);
    setImagePreview(null);
  };

  const applyTextFormat = (format) => {
    const textarea = document.getElementById("textContentArea");
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textContent.substring(start, end);

    let formattedText = "";
    switch (format) {
      case "bold":
        formattedText = `<strong>${selectedText}</strong>`;
        break;
      case "italic":
        formattedText = `<em>${selectedText}</em>`;
        break;
      case "underline":
        formattedText = `<u>${selectedText}</u>`;
        break;
      case "h1":
        formattedText = `<h1>${selectedText}</h1>`;
        break;
      case "h2":
        formattedText = `<h2>${selectedText}</h2>`;
        break;
      case "p":
        formattedText = `<p>${selectedText}</p>`;
        break;
      case "br":
        formattedText = `${selectedText}<br/>`;
        break;
      case "image":
        formattedText = "{{imagem}}";
        break;
      default:
        formattedText = selectedText;
    }

    const newContent =
      textContent.substring(0, start) +
      formattedText +
      textContent.substring(end);
    setTextContent(newContent);
  };

  // Função para gerar preview com imagem substituída
  const getPreviewContent = () => {
    if (!textContent) return "";
    
    let preview = textContent;
    
    // Substituir marcador {{imagem}} pela imagem real
    if (imagePreview) {
      const imageTag = `<img src="${imagePreview}" alt="Imagem da campanha" style="max-width: 100%; height: auto; border-radius: 6px; margin: 12px 0;" />`;
      preview = preview.replace(/\{\{imagem\}\}/gi, imageTag);
    } else {
      // Se não há imagem, mostrar placeholder
      preview = preview.replace(/\{\{imagem\}\}/gi, '<div style="padding: 20px; background: #2f2d2d; border: 2px dashed #faa01c; border-radius: 6px; text-align: center; color: #9e9e9e; margin: 12px 0;">📷 Imagem será inserida aqui</div>');
    }
    
    return preview;
  };

  return (
    <div className={styles.campainContainer}>
      {/* Header com Título */}
      <div className={styles.campainHeader}>
        <h2 className={styles.campainTitle}>{ICONS.MEGAPHONE} Gerenciamento de Campanhas</h2>
      </div>

      {/* Seção: Gerenciar Campanhas */}
      <div className={styles.campainSection}>
        <div className={styles.campainSectionHeader}>
          <h3>📋 Campanhas Cadastradas</h3>
          <span className={styles.campainCount}>
            {campains?.length || 0} {campains?.length === 1 ? 'campanha' : 'campanhas'}
          </span>
        </div>

        <div className={styles.campainList}>
          {campains && campains.length > 0 ? (
            campains.map((cp) => (
              <div key={cp.id} className={styles.campainItem}>
                <div className={styles.campainItemContent}>
                  <input
                    type="text"
                    value={cp.campain_name || ""}
                    onChange={(e) =>
                      handleChange(cp.id, "campain_name", e.target.value)
                    }
                    readOnly={inEdit !== cp.id}
                    className={styles.campainInput}
                  />
                </div>
                <div className={styles.campainItemActions}>
                  <button 
                    onClick={() => handleEdit(cp.id)}
                    className={`${styles.campainBtn} ${styles.iconBtn} ${inEdit === cp.id ? styles.success : styles.secondary}`}
                    title={inEdit !== cp.id ? "Editar" : "Salvar"}
                  >
                    {inEdit !== cp.id ? ICONS.EDIT : ICONS.CONFIRMED}
                  </button>
                  <button 
                    onClick={() => handleDelete(cp.id)}
                    className={`${styles.campainBtn} ${styles.iconBtn} ${styles.danger}`}
                    title="Deletar"
                  >
                    {ICONS.TRASH}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>Nenhuma campanha cadastrada ainda.</p>
              <p className={styles.emptyStateHint}>Crie sua primeira campanha abaixo!</p>
            </div>
          )}
        </div>

        <div className={styles.campainAddNew}>
          <h4>Adicionar Nova Campanha</h4>
          <div className={styles.campainAddNewForm}>
            <div className={styles.formGroup}>
              <label>Nome da Campanha</label>
              <input
                value={newCampain}
                type="text"
                onChange={(e) => setNewCampain(e.target.value)}
                placeholder="Ex: Natal Solidário 2023"
                className={styles.campainInput}
              />
            </div>
            <button 
              onClick={handleNewCampain}
              className={`${styles.campainBtn} ${styles.primary}`}
            >
              {ICONS.ADD} Adicionar Campanha
            </button>
          </div>
        </div>
      </div>

      {/* Seção: Textos Estilizados */}
      <div className={styles.campainSection}>
        <div className={styles.campainSectionHeader}>
          <h3>
            {editingTextId ? "✏️ Editar Texto da Campanha" : "📝 Novo Texto Para Campanha"}
          </h3>
          {editingTextId && (
            <span className={styles.campainBadge}>Modo Edição</span>
          )}
        </div>

        <div className={styles.campainForm}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Campanha Associada *</label>
              <select
                value={selectedCampainId}
                onChange={(e) => setSelectedCampainId(e.target.value)}
                className={styles.campainSelect}
              >
                <option value="">Selecione uma campanha...</option>
                {campains?.map((cp) => (
                  <option key={cp.id} value={cp.id}>
                    {cp.campain_name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Título do Texto *</label>
              <input
                type="text"
                value={textTitle}
                onChange={(e) => setTextTitle(e.target.value)}
                placeholder="Ex: Mensagem de Boas-Vindas"
                className={styles.campainInput}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Conteúdo (HTML Suportado) *</label>
            <div className={styles.formatToolbar}>
              <button
                type="button"
                onClick={() => applyTextFormat("bold")}
                className={`${styles.formatBtn} ${styles.bold}`}
                title="Negrito"
              >
                <strong>B</strong>
              </button>
              <button
                type="button"
                onClick={() => applyTextFormat("italic")}
                className={`${styles.formatBtn} ${styles.italic}`}
                title="Itálico"
              >
                <em>I</em>
              </button>
              <button
                type="button"
                onClick={() => applyTextFormat("underline")}
                className={`${styles.formatBtn} ${styles.underline}`}
                title="Sublinhado"
              >
                <u>U</u>
              </button>
              <div className={styles.formatDivider}></div>
              <button
                type="button"
                onClick={() => applyTextFormat("h1")}
                className={styles.formatBtn}
                title="Título H1"
              >
                H1
              </button>
              <button
                type="button"
                onClick={() => applyTextFormat("h2")}
                className={styles.formatBtn}
                title="Título H2"
              >
                H2
              </button>
              <button
                type="button"
                onClick={() => applyTextFormat("p")}
                className={styles.formatBtn}
                title="Parágrafo"
              >
                P
              </button>
              <button
                type="button"
                onClick={() => applyTextFormat("br")}
                className={styles.formatBtn}
                title="Quebra de linha"
              >
                BR
              </button>
              <div className={styles.formatDivider}></div>
              <button
                type="button"
                onClick={() => applyTextFormat("image")}
                className={`${styles.formatBtn} ${styles.imageBtn}`}
                title="Inserir marcador de imagem"
              >
                <FaImage /> IMG
              </button>
            </div>
            <textarea
              id="textContentArea"
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Digite o conteúdo... Pode usar HTML: <strong>negrito</strong>, <em>itálico</em>, {{variavel}}, etc."
              className={styles.campainTextarea}
              rows="6"
            />
            <div className={styles.textareaHint}>
              💡 Dicas: 
              <br />• Use variáveis como <code>{"{{nome_doador}}"}</code>, <code>{"{{valor_doacao}}"}</code> para personalização
              <br />• Use <code>{"{{imagem}}"}</code> para posicionar a imagem onde desejar no texto
            </div>
          </div>

          {/* Upload de Imagem */}
          <div className={styles.formGroup}>
            <label>Anexar Imagem (opcional)</label>
            <div className={styles.imageUploadContainer}>
              <input 
                type="file" 
                id="campain-image-upload"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.imageInput}
              />
              <label htmlFor="campain-image-upload" className={styles.imageUploadLabel}>
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
                  {textImage && (
                    <span className={styles.imageName}>{textImage.name}</span>
                  )}
                </div>
              )}
            </div>
            {imagePreview && (
              <div className={styles.imageHint}>
                ✅ Imagem carregada! Use <code>{"{{imagem}}"}</code> no texto para posicioná-la
              </div>
            )}
          </div>

          {textContent && (
            <div className={styles.formGroup}>
              <label>Pré-visualização:</label>
              <div
                className={styles.textPreview}
                dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
              />
            </div>
          )}

          <div className={styles.formActions}>
            <button 
              onClick={handleSaveText}
              className={`${styles.campainBtn} ${styles.primary}`}
            >
              {editingTextId ? ICONS.CONFIRMED + " Atualizar Texto" : ICONS.ADD + " Salvar Texto"}
            </button>
            {editingTextId && (
              <button
                onClick={handleCancelEdit}
                className={`${styles.campainBtn} ${styles.secondary}`}
              >
                {ICONS.CANCEL} Cancelar Edição
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Lista de textos existentes */}
      <div className={styles.campainSection}>
        <div className={styles.campainSectionHeader}>
          <h3>📚 Textos Cadastrados</h3>
          <span className={styles.campainCount}>
            {campainTexts.length} {campainTexts.length === 1 ? 'texto' : 'textos'}
          </span>
        </div>

        <div className={styles.campainFilterContainer}>
          <div className={styles.formGroup}>
            <label>Filtrar por Campanha:</label>
            <select
              value={selectedCampainId}
              onChange={(e) => setSelectedCampainId(e.target.value)}
              className={styles.campainSelect}
            >
              <option value="">Todas as campanhas</option>
              {campains?.map((cp) => (
                <option key={cp.id} value={cp.id}>
                  {cp.campain_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.textsList}>
          {campainTexts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhum texto cadastrado {selectedCampainId ? 'para esta campanha' : 'ainda'}.</p>
              <p className={styles.emptyStateHint}>Crie seu primeiro texto acima!</p>
            </div>
          ) : (
            campainTexts.map((text) => {
              const campain = campains.find((c) => c.id === text.campain_id);
              return (
                <div key={text.id} className={styles.textCard}>
                  <div className={styles.textCardHeader}>
                    <div className={styles.textCardInfo}>
                      <h4 className={styles.textCardTitle}>{text.title}</h4>
                      <div className={styles.textCardMeta}>
                        <span className={styles.textCardBadge}>
                          📋 {campain?.campain_name || "N/A"}
                        </span>
                        <span className={styles.textCardDate}>
                          🕒 {new Date(text.created_at).toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </div>
                    <div className={styles.textCardActions}>
                      <button
                        onClick={() => handleEditText(text)}
                        className={`${styles.campainBtn} ${styles.iconBtn} ${styles.secondary}`}
                        title="Editar"
                      >
                        {ICONS.EDIT}
                      </button>
                      <button
                        onClick={() => handleDeleteText(text.id)}
                        className={`${styles.campainBtn} ${styles.iconBtn} ${styles.danger}`}
                        title="Deletar"
                      >
                        {ICONS.TRASH}
                      </button>
                    </div>
                  </div>
                  
                  <div className={styles.textCardBody}>
                    <label className={styles.textCardLabel}>Conteúdo:</label>
                    <div
                      className={styles.textCardContent}
                      dangerouslySetInnerHTML={{ 
                        __html: text.image 
                          ? text.content.replace(
                              /\{\{imagem\}\}/gi, 
                              `<img src="${text.image}" alt="Imagem da campanha" style="max-width: 100%; height: auto; border-radius: 6px; margin: 12px 0;" />`
                            )
                          : text.content.replace(
                              /\{\{imagem\}\}/gi, 
                              '<div style="padding: 20px; background: #2f2d2d; border: 2px dashed #faa01c; border-radius: 6px; text-align: center; color: #9e9e9e; margin: 12px 0;">📷 Imagem não anexada</div>'
                            )
                      }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Campain;
