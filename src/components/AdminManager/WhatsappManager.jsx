import React, { useState } from 'react';

const WhatsappManager = () => {
  const [activeTab, setActiveTab] = useState('templates');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'utility',
    language: 'pt_BR',
    bodyText: '',
    headerText: '',
    footerText: '',
    buttons: []
  });
  const [templateStatus, setTemplateStatus] = useState('');
  const [searchTemplate, setSearchTemplate] = useState('');

  // Função para consultar status de template
  const checkTemplateStatus = async (templateName) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/submit-template?name=${templateName}`);
      const data = await response.json();
      
      if (data.success && data.result.data && data.result.data.length > 0) {
        setTemplates(data.result.data);
        setTemplateStatus(`Template encontrado: ${data.result.data[0].status}`);
      } else {
        setTemplateStatus('Template não encontrado');
        setTemplates([]);
      }
    } catch (error) {
      console.error('Erro ao consultar template:', error);
      setTemplateStatus('Erro ao consultar template');
    }
    setLoading(false);
  };

  // Função para criar novo template
  const createTemplate = async () => {
    if (!newTemplate.name || !newTemplate.category) {
      alert('Nome e categoria são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/submit-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTemplate),
      });

      const data = await response.json();
      
      if (data.success) {
        alert('Template enviado para aprovação com sucesso!');
        setNewTemplate({
          name: '',
          category: 'utility',
          language: 'pt_BR',
          bodyText: '',
          headerText: '',
          footerText: '',
          buttons: []
        });
      } else {
        alert(`Erro ao criar template: ${data.error}`);
      }
    } catch (error) {
      console.error('Erro ao criar template:', error);
      alert('Erro ao criar template');
    }
    setLoading(false);
  };

  // Função para adicionar botão
  const addButton = () => {
    setNewTemplate(prev => ({
      ...prev,
      buttons: [...prev.buttons, { type: 'QUICK_REPLY', text: '' }]
    }));
  };

  // Função para remover botão
  const removeButton = (index) => {
    setNewTemplate(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };

  // Função para atualizar botão
  const updateButton = (index, text) => {
    setNewTemplate(prev => ({
      ...prev,
      buttons: prev.buttons.map((button, i) => 
        i === index ? { ...button, text } : button
      )
    }));
  };


  const formatTemplateStatus = (status) => {
    const statusMap = {
      'APPROVED': 'Aprovado',
      'PENDING': 'Pendente',
      'REJECTED': 'Rejeitado',
      'DISABLED': 'Desabilitado'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return '#4CAF50';
      case 'PENDING': return '#FF9800';
      case 'REJECTED': return '#F44336';
      case 'DISABLED': return '#9E9E9E';
      default: return '#FFF';
    }
  };

  return (
    <div className="whatsapp-manager-container">
      {/* Menu de Tabs */}
      <div className="whatsapp-manager-tabs">
        <div 
          className={`whatsapp-manager-tab ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          Consultar Templates
        </div>
        <div 
          className={`whatsapp-manager-tab ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          Criar Template
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="whatsapp-manager-content">
        {activeTab === 'templates' && (
          <div className="whatsapp-manager-section">
            <h3>Consultar Status de Templates</h3>
            
            <div className="whatsapp-manager-search">
              <input
                type="text"
                placeholder="Nome do template"
                value={searchTemplate}
                onChange={(e) => setSearchTemplate(e.target.value)}
                className="whatsapp-manager-input"
              />
              <button 
                onClick={() => checkTemplateStatus(searchTemplate)}
                disabled={loading || !searchTemplate}
                className="whatsapp-manager-btn primary"
              >
                {loading ? 'Consultando...' : 'Consultar'}
              </button>
            </div>

            {templateStatus && (
              <div className="whatsapp-manager-status">
                {templateStatus}
              </div>
            )}

            {templates.length > 0 && (
              <div className="whatsapp-manager-templates">
                <h4>Templates Encontrados:</h4>
                {templates.map((template, index) => (
                  <div key={index} className="whatsapp-manager-template-item">
                    <div className="template-info">
                      <strong>{template.name}</strong>
                      <span className="template-category">{template.category}</span>
                      <span className="template-language">{template.language}</span>
                    </div>
                    <div 
                      className="template-status"
                      style={{ color: getStatusColor(template.status) }}
                    >
                      {formatTemplateStatus(template.status)}
                    </div>
                    {template.last_updated_time && (
                      <div className="template-updated">
                        Atualizado: {new Date(template.last_updated_time * 1000).toLocaleString()}
                      </div>
                    )}
                    {template.rejected_reason && (
                      <div className="template-rejection">
                        Motivo da rejeição: {template.rejected_reason}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="whatsapp-manager-section">
            <h3>Criar Novo Template</h3>
            
            <div className="whatsapp-manager-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nome do Template *</label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({...prev, name: e.target.value}))}
                    placeholder="Ex: boas_vindas_cliente"
                    className="whatsapp-manager-input"
                  />
                </div>
                <div className="form-group">
                  <label>Categoria *</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) => setNewTemplate(prev => ({...prev, category: e.target.value}))}
                    className="whatsapp-manager-select"
                  >
                    <option value="utility">Utility</option>
                    <option value="marketing">Marketing</option>
                    <option value="authentication">Authentication</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Idioma</label>
                  <select
                    value={newTemplate.language}
                    onChange={(e) => setNewTemplate(prev => ({...prev, language: e.target.value}))}
                    className="whatsapp-manager-select"
                  >
                    <option value="pt_BR">Português (BR)</option>
                    <option value="en_US">English (US)</option>
                    <option value="es_ES">Español</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Cabeçalho (Header)</label>
                <input
                  type="text"
                  value={newTemplate.headerText}
                  onChange={(e) => setNewTemplate(prev => ({...prev, headerText: e.target.value}))}
                  placeholder="Texto do cabeçalho (opcional)"
                  className="whatsapp-manager-input"
                />
              </div>

              <div className="form-group">
                <label>Corpo da Mensagem *</label>
                <textarea
                  value={newTemplate.bodyText}
                  onChange={(e) => setNewTemplate(prev => ({...prev, bodyText: e.target.value}))}
                  placeholder="Texto principal da mensagem. Use {{1}}, {{2}}, etc. para variáveis"
                  className="whatsapp-manager-textarea"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label>Rodapé (Footer)</label>
                <input
                  type="text"
                  value={newTemplate.footerText}
                  onChange={(e) => setNewTemplate(prev => ({...prev, footerText: e.target.value}))}
                  placeholder="Texto do rodapé (opcional)"
                  className="whatsapp-manager-input"
                />
              </div>

              <div className="form-group">
                <label>Botões</label>
                <div className="buttons-section">
                  {newTemplate.buttons.map((button, index) => (
                    <div key={index} className="button-item">
                      <input
                        type="text"
                        value={button.text}
                        onChange={(e) => updateButton(index, e.target.value)}
                        placeholder="Texto do botão"
                        className="whatsapp-manager-input"
                      />
                      <button 
                        onClick={() => removeButton(index)}
                        className="whatsapp-manager-btn danger small"
                      >
                        Remover
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={addButton}
                    className="whatsapp-manager-btn secondary small"
                  >
                    Adicionar Botão
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  onClick={createTemplate}
                  disabled={loading || !newTemplate.name || !newTemplate.category}
                  className="whatsapp-manager-btn primary"
                >
                  {loading ? 'Criando...' : 'Criar Template'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsappManager;
