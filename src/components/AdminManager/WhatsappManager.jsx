import React, { useEffect, useState } from "react";
import { getOperators } from "../../helper/getOperators";
import supabase from "../../helper/supaBaseClient";

const WhatsappManager = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    category: "utility",
    language: "pt_BR",
    bodyText: "",
    headerText: "",
    footerText: "",
    buttons: [],
  });
  const [templateStatus, setTemplateStatus] = useState("");
  const [searchTemplate, setSearchTemplate] = useState("");
  
  // Estados para Mensagens de Campanha
  const [campaigns, setCampaigns] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    selectedTemplates: [],
    variables: [], // Array de strings para os parâmetros
  });
  const [campaignLoading, setCampaignLoading] = useState(false);

  // Estados para Gerenciar Contatos
  const [contacts, setContacts] = useState([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [editOperatorCode, setEditOperatorCode] = useState("");
  const [operators, setOperators] = useState([]);
  const [operatorsLoading, setOperatorsLoading] = useState(false);

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
        setTemplateStatus("Template não encontrado");
        setTemplates([]);
      }
    } catch (error) {
      console.error("Erro ao consultar template:", error);
      setTemplateStatus("Erro ao consultar template");
    }
    setLoading(false);
  };

  // Função para criar novo template
  const createTemplate = async () => {
    if (!newTemplate.name || !newTemplate.category) {
      alert("Nome e categoria são obrigatórios");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/submit-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTemplate),
      });

      const data = await response.json();

      if (data.success) {
        alert("Template enviado para aprovação com sucesso!");
        setNewTemplate({
          name: "",
          category: "utility",
          language: "pt_BR",
          bodyText: "",
          headerText: "",
          footerText: "",
          buttons: [],
        });
      } else {
        alert(`Erro ao criar template: ${data.error}`);
      }
    } catch (error) {
      console.error("Erro ao criar template:", error);
      alert("Erro ao criar template");
    }
    setLoading(false);
  };

  // Função para adicionar botão
  const addButton = () => {
    setNewTemplate((prev) => ({
      ...prev,
      buttons: [...prev.buttons, { type: "QUICK_REPLY", text: "" }],
    }));
  };

  // Função para remover botão
  const removeButton = (index) => {
    setNewTemplate((prev) => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index),
    }));
  };

  // Função para atualizar botão
  const updateButton = (index, text) => {
    setNewTemplate((prev) => ({
      ...prev,
      buttons: prev.buttons.map((button, i) =>
        i === index ? { ...button, text } : button
      ),
    }));
  };

  const formatTemplateStatus = (status) => {
    const statusMap = {
      APPROVED: "Aprovado",
      PENDING: "Pendente",
      REJECTED: "Rejeitado",
      DISABLED: "Desabilitado",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "#4CAF50";
      case "PENDING":
        return "#FF9800";
      case "REJECTED":
        return "#F44336";
      case "DISABLED":
        return "#9E9E9E";
      default:
        return "#FFF";
    }
  };

  // Função para carregar todos os templates aprovados
  const loadAllTemplates = async () => {
    setCampaignLoading(true);
    try {
      const response = await fetch("/api/templates/approved");
      const data = await response.json();
      
      if (data.success) {
        setAllTemplates(data.templates);
      } else {
        alert("Erro ao carregar templates aprovados");
      }
    } catch (error) {
      console.error("Erro ao carregar templates:", error);
      alert("Erro ao carregar templates aprovados");
    }
    setCampaignLoading(false);
  };

  // Função para carregar campanhas salvas
  const loadCampaigns = async () => {
    try {
      const response = await fetch("/api/campaigns");
      const data = await response.json();
      
      if (data.success) {
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error("Erro ao carregar campanhas:", error);
    }
  };

  // Função para criar nova campanha
  const createCampaign = async () => {
    if (!newCampaign.name || newCampaign.selectedTemplates.length === 0) {
      alert("Nome da campanha e pelo menos um template são obrigatórios");
      return;
    }

    setCampaignLoading(true);
    try {
      
      const response = await fetch("/api/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCampaign),
      });

      
      const data = await response.json();

      if (response.ok && data.success) {
        alert("Campanha criada com sucesso!");
        setNewCampaign({
          name: "",
          description: "",
          selectedTemplates: [],
          variables: [],
        });
        loadCampaigns();
      } else {
        console.error("❌ Erro na resposta:", data);
        
        if (data.error?.includes("não encontrada")) {
          alert(`Erro: ${data.error}\n\nVocê precisa executar o script SQL para criar as tabelas primeiro.`);
        } else {
          alert(`Erro ao criar campanha: ${data.error || "Erro desconhecido"}\n\nDetalhes: ${data.details || "Nenhum"}`);
        }
      }
    } catch (error) {
      console.error("❌ Erro ao criar campanha:", error);
      alert(`Erro de rede ao criar campanha: ${error.message}`);
    }
    setCampaignLoading(false);
  };

  // Função para deletar campanha
  const deleteCampaign = async (campaignId) => {
    if (!confirm("Tem certeza que deseja deletar esta campanha?")) {
      return;
    }

    setCampaignLoading(true);
    try {
      
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: "DELETE",
      });


      // Verificar se a resposta contém JSON válido
      let data = null;
      let responseText = "";
      
      try {
        // Primeiro, tentar obter o texto da resposta
        responseText = await response.text();
        
        if (!responseText || responseText.trim() === "") {
          throw new Error("Resposta vazia do servidor");
        }

        // Tentar fazer parse do JSON
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("❌ Erro ao fazer parse do JSON:", parseError);
          console.error("❌ Texto que falhou no parse:", responseText.substring(0, 200));
          throw new Error(`Resposta não é JSON válido. Recebido: ${responseText.substring(0, 100)}...`);
        }
        
      } catch (textError) {
        console.error("❌ Erro ao obter texto da resposta:", textError);
        throw new Error("Erro ao ler resposta do servidor");
      }

      if (response.ok && data?.success) {
        alert("Campanha deletada com sucesso!");
        loadCampaigns();
      } else {
        const errorMessage = data?.error || `Erro HTTP ${response.status}`;
        alert(`Erro ao deletar campanha: ${errorMessage}`);
      }
    } catch (error) {
      console.error("❌ Erro ao deletar campanha:", error);
      alert(`Erro ao deletar campanha: ${error.message}`);
    }
    setCampaignLoading(false);
  };

  // Função para contar parâmetros necessários em um template
  const countTemplateParameters = (template) => {
    const bodyComponent = template.components?.find(c => c.type === 'BODY');
    if (bodyComponent && bodyComponent.text) {
      const matches = bodyComponent.text.match(/\{\{\d+\}\}/g);
      return matches ? matches.length : 0;
    }
    return 0;
  };

  // Função para calcular total de parâmetros necessários
  const calculateTotalParameters = (templates) => {
    return Math.max(...templates.map(t => countTemplateParameters(t)), 0);
  };

  // Função para adicionar/remover template da campanha
  const toggleTemplateSelection = (template) => {
    setNewCampaign(prev => {
      const isSelected = prev.selectedTemplates.find(t => t.name === template.name);
      
      let newSelectedTemplates;
      if (isSelected) {
        newSelectedTemplates = prev.selectedTemplates.filter(t => t.name !== template.name);
      } else {
        newSelectedTemplates = [...prev.selectedTemplates, template];
      }

      // Recalcular variáveis necessárias
      const maxParams = calculateTotalParameters(newSelectedTemplates);
      const currentVariables = prev.variables || [];
      
      // Ajustar array de variáveis para o tamanho necessário
      let newVariables = [...currentVariables];
      if (maxParams > currentVariables.length) {
        // Adicionar variáveis vazias se necessário
        while (newVariables.length < maxParams) {
          newVariables.push('');
        }
      } else if (maxParams < currentVariables.length) {
        // Remover variáveis excedentes
        newVariables = newVariables.slice(0, maxParams);
      }

      return {
        ...prev,
        selectedTemplates: newSelectedTemplates,
        variables: newVariables
      };
    });
  };

  // Função para atualizar variável
  const updateVariable = (index, value) => {
    setNewCampaign(prev => ({
      ...prev,
      variables: prev.variables.map((v, i) => i === index ? value : v)
    }));
  };

  // Função para testar a configuração
  const testConfiguration = async () => {
    setCampaignLoading(true);
    try {
      const response = await fetch("/api/campaigns/test");
      const data = await response.json();
      
      if (data.success) {
        alert("✅ Configuração OK! Todas as tabelas estão funcionando.");
      } else {
        alert(`❌ Problema de configuração:\n\n${data.error}\n\nSolução: ${data.solution || "Verifique os logs"}`);
      }
    } catch (error) {
      alert(`❌ Erro ao testar: ${error.message}`);
    }
    setCampaignLoading(false);
  };

  // Função para testar template individual
  const testTemplate = async (templateName) => {
    setCampaignLoading(true);
    try {
      const response = await fetch("/api/templates/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ templateName }),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ Template "${templateName}" está funcionando corretamente!`);
      } else {
        alert(`❌ Problema com o template "${templateName}":\n\nErro: ${data.error.error}\nCódigo: ${data.error.errorCode}\n\nInterpretação: ${data.interpretation}\n\nRecomendação: ${data.recommendation}`);
      }
    } catch (error) {
      alert(`❌ Erro ao testar template: ${error.message}`);
    }
    setCampaignLoading(false);
  };

  // Função para testar deleção
  const testDeletion = async () => {
    setCampaignLoading(true);
    try {
      const response = await fetch("/api/campaigns/test-delete");
      const data = await response.json();
      
      if (data.success) {
        let message = "✅ Teste de deleção realizado!\n\n";
        message += `Campanhas encontradas: ${data.results.totalCampaigns}\n`;
        message += `Estrutura da tabela: OK\n`;
        message += `${data.results.simulationResult}\n\n`;
        message += `Para testar: ${data.instructions.example}`;
        alert(message);
      } else {
        alert(`❌ Erro no teste de deleção:\n\n${data.error}\n\nDetalhes: ${data.details}`);
      }
    } catch (error) {
      alert(`❌ Erro ao testar deleção: ${error.message}`);
    }
    setCampaignLoading(false);
  };

  // Função para testar endpoint de deleção direto
  const testDeleteEndpoint = async () => {
    setCampaignLoading(true);
    try {
      
      const testId = "test-123";
      const response = await fetch(`/api/campaigns/delete-test?campaignId=${testId}`, {
        method: "DELETE",
      });


      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("❌ Erro de parse no teste:", parseError);
        alert(`❌ Erro de parse no teste direto:\n\nTexto recebido: ${responseText.substring(0, 200)}\n\nErro: ${parseError.message}`);
        return;
      }
      
      if (data.success) {
        alert(`✅ Endpoint de teste funcionando!\n\nID testado: ${data.receivedId}\nMétodo: ${data.method}\nTimestamp: ${data.timestamp}`);
      } else {
        alert(`❌ Falha no teste direto:\n\n${data.error}\n\nDetalhes: ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      console.error("❌ Erro no teste direto:", error);
      alert(`❌ Erro no teste direto: ${error.message}`);
    }
    setCampaignLoading(false);
  };

  // Função para carregar contatos
  const loadContacts = async () => {
    setContactsLoading(true);
    try {
      const response = await fetch("/api/contacts");
      const data = await response.json();
      
      if (data.success) {
        // Filtrar apenas os dados necessários: telefone, nome do operador, código do operador
        const filteredContacts = (data.contacts || []).map(contact => ({
          id: contact.id,
          phone_number: contact.phone_number,
          operator_name: contact.operator_name,
          operator_code_id: contact.operator_code_id
        }));
        setContacts(filteredContacts);
      } else {
        alert("Erro ao carregar contatos");
      }
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      alert("Erro ao carregar contatos");
    }
    setContactsLoading(false);
  };

  // Função para carregar operadores ativos
  const loadOperators = async () => {
    setOperatorsLoading(true);
    try {
      const data = await getOperators({ active: true });
      
      if (data && !data.error) {
        setOperators(data || []);
      } else {
        console.error("Erro ao carregar operadores:", data?.error);
        alert("Erro ao carregar operadores");
      }
    } catch (error) {
      console.error("Erro ao carregar operadores:", error);
      alert("Erro ao carregar operadores");
    }
    setOperatorsLoading(false);
  };

  // Função para iniciar edição de contato
  const startEditContact = (contact) => {
    setEditingContact(contact.id);
    setEditOperatorCode(contact.operator_code_id || "");
  };

  // Função para cancelar edição
  const cancelEditContact = () => {
    setEditingContact(null);
    setEditOperatorCode("");
  };

  // Função para salvar edição do código do operador
  const saveOperatorCode = async (contactId) => {
    setContactsLoading(true);
    try {
      console.log("🔄 Tentando atualizar contato:", contactId);
      console.log("📝 Novo código do operador:", editOperatorCode);
      
      // Usar Supabase diretamente em vez da API
      const { data: updatedContact, error } = await supabase
        .from("contacts")
        .update({ operator_code_id: editOperatorCode })
        .eq("contact_id", contactId)
        .select(`
          contact_id,
          phone_number,
          operator_code_id,
          operator!operator_code_id (
            operator_name,
            operator_code_id
          )
        `)
        .single();

      if (error) {
        console.error("❌ Erro ao atualizar contato no Supabase:", error);
        throw new Error(`Erro ao atualizar contato: ${error.message}`);
      }

      if (updatedContact) {
        // Atualizar o contato na lista local
        setContacts(prev => 
          prev.map(contact => 
            contact.id === contactId 
              ? { 
                  ...contact, 
                  operator_code_id: editOperatorCode,
                  operator_name: updatedContact.operator?.operator_name || contact.operator_name
                }
              : contact
          )
        );
        setEditingContact(null);
        setEditOperatorCode("");
        alert("Código do operador atualizado com sucesso!");
      } else {
        throw new Error("Contato não foi atualizado");
      }
    } catch (error) {
      console.error("❌ Erro ao atualizar código do operador:", error);
      alert(`Erro ao atualizar código do operador: ${error.message}`);
    }
    setContactsLoading(false);
  };


  // Carregar dados quando as abas forem ativadas
  useEffect(() => {
    if (activeTab === "campaigns") {
      loadAllTemplates();
      loadCampaigns();
    } else if (activeTab === "contacts") {
      loadContacts();
      loadOperators();
    }
  }, [activeTab]);

  console.log(contacts)

  return (
    <div className="whatsapp-manager-container">
      {/* Menu de Tabs */}
      <div className="whatsapp-manager-tabs">
        <div
          className={`whatsapp-manager-tab ${
            activeTab === "templates" ? "active" : ""
          }`}
          onClick={() => setActiveTab("templates")}
        >
          Consultar Templates
        </div>
        <div
          className={`whatsapp-manager-tab ${
            activeTab === "create" ? "active" : ""
          }`}
          onClick={() => setActiveTab("create")}
        >
          Criar Template
        </div>
        <div
          className={`whatsapp-manager-tab ${
            activeTab === "campaigns" ? "active" : ""
          }`}
          onClick={() => setActiveTab("campaigns")}
        >
          Mensagens de Campanha
        </div>
        <div
          className={`whatsapp-manager-tab ${
            activeTab === "contacts" ? "active" : ""
          }`}
          onClick={() => setActiveTab("contacts")}
        >
          Gerenciar Contatos
        </div>
        <div
          className={`whatsapp-manager-tab ${
            activeTab === "diagnostico" ? "active" : ""
          }`}
          onClick={() => setActiveTab("diagnostico")}
        >
          Diagnóstico
        </div>
      </div>

      {/* Conteúdo das Tabs */}
      <div className="whatsapp-manager-content">
        {activeTab === "templates" && (
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
                {loading ? "Consultando..." : "Consultar"}
              </button>
            </div>

            {templateStatus && (
              <div className="whatsapp-manager-status">{templateStatus}</div>
            )}

            {templates.length > 0 && (
              <div className="whatsapp-manager-templates">
                <h4>Templates Encontrados:</h4>
                {templates.map((template, index) => (
                  <div key={index} className="whatsapp-manager-template-item">
                    <div className="template-info">
                      <strong>{template.name}</strong>
                      <span className="template-category">
                        {template.category}
                      </span>
                      <span className="template-language">
                        {template.language}
                      </span>
                    </div>
                    <div
                      className="template-status"
                      style={{ color: getStatusColor(template.status) }}
                    >
                      {formatTemplateStatus(template.status)}
                    </div>
                    {template.last_updated_time && (
                      <div className="template-updated">
                        Atualizado:{" "}
                        {new Date(
                          template.last_updated_time * 1000
                        ).toLocaleString()}
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

        {activeTab === "create" && (
          <div className="whatsapp-manager-section">
            <h3>Criar Novo Template</h3>

            <div className="whatsapp-manager-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nome do Template *</label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) =>
                      setNewTemplate((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Ex: boas_vindas_cliente"
                    className="whatsapp-manager-input"
                  />
                </div>
                <div className="form-group">
                  <label>Categoria *</label>
                  <select
                    value={newTemplate.category}
                    onChange={(e) =>
                      setNewTemplate((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
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
                    onChange={(e) =>
                      setNewTemplate((prev) => ({
                        ...prev,
                        language: e.target.value,
                      }))
                    }
                    className="whatsapp-manager-select"
                  >
                    <option value="pt_BR">Português (BR)</option>
                    <option value="en_US">English (US)</option>
                    <option value="es_ES">Español</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Cabeçalho (Header)</label>
                  <input
                    type="text"
                    value={newTemplate.headerText}
                    onChange={(e) =>
                      setNewTemplate((prev) => ({
                        ...prev,
                        headerText: e.target.value,
                      }))
                    }
                    placeholder="Texto do cabeçalho (opcional)"
                    className="whatsapp-manager-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Corpo da Mensagem *</label>
                <textarea
                  value={newTemplate.bodyText}
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      bodyText: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setNewTemplate((prev) => ({
                      ...prev,
                      footerText: e.target.value,
                    }))
                  }
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
                  disabled={
                    loading || !newTemplate.name || !newTemplate.category
                  }
                  className="whatsapp-manager-btn primary"
                >
                  {loading ? "Criando..." : "Criar Template"}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "campaigns" && (
          <div className="whatsapp-manager-section">
            <h3>Mensagens de Campanha</h3>

            {/* Seção de Criar Nova Campanha */}
            <div className="campaign-form-section">
              <h4>Criar Nova Campanha</h4>
              
              <div className="whatsapp-manager-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Nome da Campanha *</label>
                    <input
                      type="text"
                      value={newCampaign.name}
                      onChange={(e) =>
                        setNewCampaign((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Ex: Campanha Leite"
                      className="whatsapp-manager-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Descrição</label>
                    <input
                      type="text"
                      value={newCampaign.description}
                      onChange={(e) =>
                        setNewCampaign((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      placeholder="Descrição da campanha (opcional)"
                      className="whatsapp-manager-input"
                    />
                  </div>
                </div>

                {/* Seleção de Templates */}
                <div className="form-group">
                  <label>Selecionar Templates *</label>
                  <div className="templates-selection">
                    {campaignLoading ? (
                      <div className="loading-message">Carregando templates...</div>
                    ) : allTemplates.length > 0 ? (
                      <div className="templates-grid">
                        {allTemplates.map((template, index) => {
                          const isSelected = newCampaign.selectedTemplates.find(t => t.name === template.name);
                          return (
                            <div 
                              key={index} 
                              className={`template-card ${isSelected ? 'selected' : ''}`}
                              onClick={() => toggleTemplateSelection(template)}
                            >
                              <div className="template-card-header">
                                <strong>{template.name}</strong>
                                <span className="template-category">{template.category}</span>
                              </div>
                              <div className="template-card-body">
                                {template.components?.find(c => c.type === 'BODY')?.text || 'Sem texto do corpo'}
                              </div>
                              <div className="template-card-status">
                                <span style={{ color: getStatusColor(template.status) }}>
                                  {formatTemplateStatus(template.status)}
                                </span>
                                <button
                                  className="test-template-btn"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    testTemplate(template.name);
                                  }}
                                  disabled={campaignLoading}
                                  title="Testar este template"
                                >
                                  🔧
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="no-templates-message">
                        Nenhum template aprovado encontrado. Crie e aprove templates primeiro.
                      </div>
                    )}
                  </div>

                  {/* Templates Selecionados */}
                  {newCampaign.selectedTemplates.length > 0 && (
                    <div className="selected-templates">
                      <h5>Templates Selecionados ({newCampaign.selectedTemplates.length}):</h5>
                      <div className="selected-templates-list">
                        {newCampaign.selectedTemplates.map((template, index) => {
                          const paramCount = countTemplateParameters(template);
                          return (
                            <div key={index} className="selected-template-item">
                              <span>
                                {index + 1}. {template.name} 
                                {paramCount > 0 && <small> ({paramCount} parâmetros)</small>}
                              </span>
                              <button
                                onClick={() => toggleTemplateSelection(template)}
                                className="remove-template-btn"
                              >
                                ×
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Seção de Variáveis */}
                  {newCampaign.selectedTemplates.length > 0 && newCampaign.variables.length > 0 && (
                    <div className="campaign-variables">
                      <h5>Variáveis da Campanha:</h5>
                      <p className="variables-help">
                        Configure os valores que serão substituídos nos templates ({"{1}"}, {"{2}"}, etc.)
                      </p>
                      <div className="variables-list">
                        {newCampaign.variables.map((variable, index) => (
                          <div key={index} className="variable-item">
                            <label>Variável {index + 1}:</label>
                            <div className="variable-input-group">
                              <select
                                value={variable.startsWith('{{') ? variable : 'static'}
                                onChange={(e) => {
                                  if (e.target.value === 'static') {
                                    updateVariable(index, '');
                                  } else {
                                    updateVariable(index, e.target.value);
                                  }
                                }}
                                className="whatsapp-manager-select variable-type-select"
                              >
                                <option value="static">Valor Estático</option>
                                <option value="{{selectedConversation.title}}">Nome do Contato</option>
                                <option value="{{selectedConversation.phone_number}}">Telefone do Contato</option>
                                <option value="{{currentDate}}">Data Atual</option>
                                <option value="{{currentTime}}">Hora Atual</option>
                              </select>
                              {!variable.startsWith('{{') && (
                                <input
                                  type="text"
                                  value={variable}
                                  onChange={(e) => updateVariable(index, e.target.value)}
                                  placeholder={`Valor para {${index + 1}}`}
                                  className="whatsapp-manager-input variable-static-input"
                                />
                              )}
                              {variable.startsWith('{{') && (
                                <div className="dynamic-variable-display">
                                  <span className="dynamic-variable-label">
                                    {variable === '{{selectedConversation.title}}' && 'Nome do contato será usado automaticamente'}
                                    {variable === '{{selectedConversation.phone_number}}' && 'Telefone do contato será usado automaticamente'}
                                    {variable === '{{currentDate}}' && 'Data atual será inserida automaticamente'}
                                    {variable === '{{currentTime}}' && 'Hora atual será inserida automaticamente'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="variables-info">
                        <small>
                          💡 Deixe em branco para usar valores padrão ("Valor 1", "Valor 2", etc.)
                        </small>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-actions">
                  <button
                    onClick={createCampaign}
                    disabled={campaignLoading || !newCampaign.name || newCampaign.selectedTemplates.length === 0}
                    className="whatsapp-manager-btn primary"
                  >
                    {campaignLoading ? "Criando..." : "Criar Campanha"}
                  </button>
                </div>
              </div>
            </div>

            {/* Seção de Campanhas Criadas */}
            <div className="campaigns-list-section">
              <h4>Campanhas Criadas</h4>
              {campaigns.length > 0 ? (
                <div className="campaigns-grid">
                  {campaigns.map((campaign, index) => (
                    <div key={index} className="campaign-item">
                      <div className="campaign-header">
                        <h5>{campaign.name}</h5>
                        <button
                          onClick={() => deleteCampaign(campaign.id)}
                          className="delete-campaign-btn"
                        >
                          ×
                        </button>
                      </div>
                      {campaign.description && (
                        <p className="campaign-description">{campaign.description}</p>
                      )}
                      <div className="campaign-templates">
                        <strong>Templates ({campaign.selectedTemplates?.length || 0}):</strong>
                        <ul>
                          {(campaign.selectedTemplates || []).map((template, idx) => (
                            <li key={idx}>{template.name}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="campaign-date">
                        Criada em: {campaign.created_at ? new Date(campaign.created_at).toLocaleString() : 'Data não disponível'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-campaigns-message">
                  Nenhuma campanha criada ainda. Crie sua primeira campanha acima.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "contacts" && (
          <div className="whatsapp-manager-section">
            <h3>Gerenciar Contatos</h3>

            <div className="contacts-section">
              <div className="contacts-header">
                <h4>Lista de Contatos</h4>
                <button
                  onClick={loadContacts}
                  disabled={contactsLoading}
                  className="whatsapp-manager-btn secondary"
                >
                  {contactsLoading ? "Carregando..." : "Atualizar Lista"}
                </button>
              </div>

              {contactsLoading ? (
                <div className="loading-message">Carregando contatos...</div>
              ) : contacts.length > 0 ? (
                <div className="contacts-table">
                  <div className="contacts-table-header">
                    <div className="contact-cell">Telefone</div>
                    <div className="contact-cell">Nome do Operador</div>
                    <div className="contact-cell">Código do Operador</div>
                    <div className="contact-cell">Ações</div>
                  </div>
                  {contacts.map((contact) => (
                    <div key={contact.id} className="contacts-table-row">
                      <div className="contact-cell" data-label="Telefone">
                        <strong>{contact.phone_number || "Sem telefone"}</strong>
                      </div>
                      <div className="contact-cell" data-label="Nome do Operador">
                        {contact.operator_name || "Sem operador"}
                      </div>
                      <div className="contact-cell" data-label="Código do Operador">
                        {editingContact === contact.id ? (
                          <select
                            value={editOperatorCode}
                            onChange={(e) => setEditOperatorCode(e.target.value)}
                            className="whatsapp-manager-select small"
                            style={{ width: "100%", fontSize: "12px" }}
                          >
                            <option value="">Selecione um operador</option>
                            {operators.map((operator) => (
                              <option key={operator.operator_code_id} value={operator.operator_code_id}>
                                {operator.operator_name} ({operator.operator_code_id})
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="operator-code-display">
                            {contact.operator_code_id || "Sem código"}
                          </span>
                        )}
                      </div>
                      <div className="contact-cell" data-label="Ações">
                        {editingContact === contact.id ? (
                          <div className="edit-actions">
                            <button
                              onClick={() => saveOperatorCode(contact.id)}
                              disabled={contactsLoading}
                              className="whatsapp-manager-btn primary small"
                              style={{ fontSize: "11px", padding: "4px 8px" }}
                            >
                              Salvar
                            </button>
                            <button
                              onClick={cancelEditContact}
                              disabled={contactsLoading}
                              className="whatsapp-manager-btn secondary small"
                              style={{ fontSize: "11px", padding: "4px 8px" }}
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEditContact(contact)}
                            className="whatsapp-manager-btn secondary small"
                            style={{ fontSize: "11px", padding: "4px 8px" }}
                          >
                            Editar
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-contacts-message">
                  Nenhum contato encontrado. Verifique se a tabela 'contacts' existe e possui dados.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "diagnostico" && (
          <div className="whatsapp-manager-section">
            <h3>Diagnóstico do Sistema</h3>

            {/* Seção de Diagnóstico */}
            <div className="test-section" style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#363a3d", borderRadius: "8px", border: "2px solid #2f2d2d" }}>
              <h4 style={{ color: "#faa01c", marginBottom: "12px", fontSize: "14px" }}>Testes Disponíveis</h4>
              <p style={{ color: "#ccc", fontSize: "13px", marginBottom: "12px" }}>
                <strong>🔍 Testar Configuração:</strong> Verifica tabelas e conexões<br/>
                <strong>🗑️ Testar Deleção:</strong> Simula deleção sem executar<br/>
                <strong>🔧 Teste Direto:</strong> Testa endpoint simplificado (para debug)
              </p>
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <button
                  onClick={testConfiguration}
                  disabled={campaignLoading}
                  className="whatsapp-manager-btn secondary"
                  style={{ fontSize: "12px", padding: "8px 16px" }}
                >
                  {campaignLoading ? "Testando..." : "🔍 Testar Configuração"}
                </button>
                <button
                  onClick={testDeletion}
                  disabled={campaignLoading}
                  className="whatsapp-manager-btn secondary"
                  style={{ fontSize: "12px", padding: "8px 16px" }}
                >
                  {campaignLoading ? "Testando..." : "🗑️ Testar Deleção"}
                </button>
                <button
                  onClick={testDeleteEndpoint}
                  disabled={campaignLoading}
                  className="whatsapp-manager-btn secondary"
                  style={{ fontSize: "12px", padding: "8px 16px" }}
                >
                  {campaignLoading ? "Testando..." : "🔧 Teste Direto"}
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
