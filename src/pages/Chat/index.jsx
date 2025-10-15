import { useEffect, useState, Fragment, useRef, useMemo, useContext } from "react";
import { IoCheckmarkDoneSharp, IoCheckmarkSharp } from "react-icons/io5";
import { MdAccessTime, MdCampaign } from "react-icons/md";
import { FaAngleRight } from "react-icons/fa";
import { BiMessageRoundedDetail } from "react-icons/bi";
import { FiUserPlus, FiX } from "react-icons/fi";

import "./index.css";
import {
  FiSearch,
  FiMoreVertical,
  FiPaperclip,
  FiSend,
  FiSmile,
} from "react-icons/fi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoMdCall, IoMdVideocam } from "react-icons/io";
import { useConversations } from "../../hooks/useConversations";
import { getUnreadMessagesCount } from "../../helper/unreadMessages";
import Avatar from "../../components/forms/Avatar";
import supabase from "../../helper/superBaseClient";
import { UserContext } from "../../context/UserContext";
import deleteConversation from "../../helper/deleteConversation";

// Função para validar se um valor é um UUID válido
function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Função para gerar UUID temporário
function generateTempUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Função simplificada para criar/buscar conversa
async function getConversationIdForMessage(phoneNumber, providedConversationId = null) {
  // Se temos um conversationId válido, usá-lo
  if (providedConversationId && isValidUUID(providedConversationId)) {
    return providedConversationId;
  }
  
  try {
    // Tentar buscar uma conversa existente pelo telefone
    const { data: existingConversations, error: searchError } = await supabase
      .from("conversations")
      .select("conversation_id")
      .eq("phone_number", phoneNumber)
      .limit(1);
    
    if (!searchError && existingConversations && existingConversations.length > 0) {
      return existingConversations[0].conversation_id;
    }
  } catch (error) {
    console.error("Erro ao buscar conversa:", error);
  }
  
  // Se não conseguiu encontrar, gerar um UUID temporário
  return generateTempUUID();
}

const Chat = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const messsageRef = useRef(null);
  const { conversations, messages, markAsRead, addOptimisticMessage, removeOptimisticMessage, replaceOptimisticMessage, reloadConversations } = useConversations();
  const [isMenuMediaOpen, setIsMenuMediaOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState();
  const [sendingMessage, setSendingMessage] = useState(false);
  
  // Estados para campanhas
  const [campaigns, setCampaigns] = useState([]);
  const [campaignsLoading, setCampaignsLoading] = useState(false);
  const [sendingCampaignId, setSendingCampaignId] = useState(null);

  // Estados para dropdown e modal de adicionar contato
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone_number: "",
    avatar_url: ""
  });

  // Estados para buscar contatos salvos
  const [isSearchContactModalOpen, setIsSearchContactModalOpen] = useState(false);
  const [savedContacts, setSavedContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  const [creatingConversationFor, setCreatingConversationFor] = useState(null);
  const { operatorData } = useContext(UserContext);

  const menuMediaRef = useRef(null);
  const subMenuMediaRef = useRef(null);
  const dropdownRef = useRef(null);
  const addContactModalRef = useRef(null);
  const searchContactModalRef = useRef(null);
  const contextMenuRef = useRef(null);

  // Context menu (right-click) para conversas
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    conversation: null,
  });

  // Memoiza as mensagens filtradas para evitar re-renderizações desnecessárias
  const filteredMessages = useMemo(() => {
    if (!selectedConversation || !messages) return [];
    return messages.filter(
      (msg) => msg.conversation_id === selectedConversation.conversation_id
    );
  }, [selectedConversation, messages]);

  useEffect(() => {
    const el = messsageRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [selectedConversation]);

  // Scroll para baixo quando novas mensagens chegam
  useEffect(() => {
    const el = messsageRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [filteredMessages.length]);

  const handleSendMessage = async () => {
    if (message.trim() && selectedConversation && !sendingMessage) {
      setSendingMessage(true);
      
      // Cria a mensagem otimista para aparecer imediatamente
      const optimisticMessage = {
        conversation_id: selectedConversation.conversation_id,
        from_contact: selectedConversation.from_contact,
        body: message,
        message_type: "text",
      };

      // Adiciona a mensagem otimista
      const tempId = addOptimisticMessage(optimisticMessage);
      
      const payload = {
        conversationId: selectedConversation.conversation_id,
        from: selectedConversation.from_contact,
        to: selectedConversation.phone_number,
        message: message,
        type: "text",
      };
      console.log(selectedConversation)
      // Limpa o campo de input imediatamente para melhor UX
      const messageToSend = message;
      setMessage("");

      try {
        const response = await fetch("/api/send-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
        const data = await response.json();

        if (data.success && data.supabase && data.supabase.length > 0) {
          // Substitui a mensagem otimista pela real quando chegar via realtime
          // A mensagem real chegará via realtime e será automaticamente mesclada
        } else if (data.success) {
        } else {
          // Se houver erro, remove a mensagem otimista
          removeOptimisticMessage(tempId);
          setMessage(messageToSend); // Restaura a mensagem no campo
          console.error("❌ Erro ao enviar mensagem:", data.error);
          alert("Erro ao enviar mensagem: " + (data.error || "Erro desconhecido"));
        }
      } catch (error) {
        // Remove a mensagem otimista em caso de erro
        removeOptimisticMessage(tempId);
        setMessage(messageToSend); // Restaura a mensagem no campo
        console.error("❌ Erro de rede:", error);
        alert("Erro de conexão. Tente novamente.");
      } finally {
        setSendingMessage(false);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Função para carregar campanhas diretamente do Supabase
  const loadCampaigns = async () => {
    setCampaignsLoading(true);
    try {
      const { data: campaigns, error } = await supabase
        .from("whatsapp_campaigns")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Erro ao carregar campanhas:", error);
        alert("Erro ao carregar campanhas: " + error.message);
      } else {
        setCampaigns(campaigns || []);
      }
    } catch (error) {
      console.error("Erro ao carregar campanhas:", error);
      alert("Erro ao carregar campanhas: " + error.message);
    }
    setCampaignsLoading(false);
  };

  // Função para enviar campanha diretamente via Supabase
  const handleSendCampaign = async (campaignId, event) => {
    // Prevenir que o clique feche o menu
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    if (!selectedConversation) {
      alert("Selecione uma conversa primeiro");
      return;
    }

    const confirmed = confirm("Tem certeza que deseja enviar esta campanha? Todos os templates serão enviados em sequência.");
    
    if (!confirmed) return;

    setSendingCampaignId(campaignId);
    
    try {
      // Buscar a campanha no banco de dados
      const { data: campaign, error: campaignError } = await supabase
        .from("whatsapp_campaigns")
        .select("*")
        .eq("id", campaignId)
        .single();

      if (campaignError || !campaign) {
        alert("Campanha não encontrada");
        return;
      }

      const phoneId = import.meta.env.VITE_WHATSAPP_PHONE_NUMBER_ID;
      const accessToken = import.meta.env.VITE_WHATSAPP_ACCESS_TOKEN;

      if (!phoneId || !accessToken) {
        alert("Configurações do WhatsApp não encontradas. Verifique as variáveis de ambiente.");
        return;
      }

      const results = [];
      const errors = [];
      const to = selectedConversation.phone_number;
      const from = selectedConversation.from_contact;
      const conversationId = selectedConversation.conversation_id;

      // Enviar cada template da campanha em sequência
      for (let i = 0; i < campaign.selected_templates.length; i++) {
        const template = campaign.selected_templates[i];
        
        try {
          // Delay progressivo entre os envios (2s, 3s, 4s, etc.)
          if (i > 0) {
            const delay = 2000 + (i * 1000); // 2s, 3s, 4s...
            await new Promise(resolve => setTimeout(resolve, delay));
          }

          // Detectar quantos parâmetros o template precisa
          let requiredParams = 0;
          const bodyComponent = template.components?.find(c => c.type === 'BODY');
          if (bodyComponent && bodyComponent.text) {
            // Contar placeholders {{1}}, {{2}}, etc.
            const matches = bodyComponent.text.match(/\{\{\d+\}\}/g);
            requiredParams = matches ? matches.length : 0;
          }

          // Preparar componentes do template
          let templateComponents = null;
          if (requiredParams > 0) {
            // Usar variáveis da campanha ou valores padrão
            let paramValues = [];
            
            const campaignVariables = campaign.variables || [];
            
            // Função para processar variáveis dinâmicas
            const processDynamicVariable = (variable) => {
              if (typeof variable !== 'string' || !variable.startsWith('{{')) {
                return variable; // Valor estático
              }
              
              // Processar variáveis dinâmicas
              switch (variable) {
                case '{{selectedConversation.title}}':
                  return selectedConversation?.title || 'Nome não disponível';
                case '{{selectedConversation.phone_number}}':
                  return selectedConversation?.phone_number || 'Telefone não disponível';
                case '{{currentDate}}':
                  return new Date().toLocaleDateString('pt-BR');
                case '{{currentTime}}':
                  return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
                default:
                  return variable; // Retorna o próprio valor se não encontrar correspondência
              }
            };
            
            if (campaignVariables.length > 0) {
              // Processar variáveis da campanha (podem ser dinâmicas ou estáticas)
              paramValues = campaignVariables.slice(0, requiredParams).map(variable => 
                processDynamicVariable(variable)
              );
            } else {
              // Valores padrão se não foram fornecidas
              paramValues = Array.from({ length: requiredParams }, (_, i) => `Valor ${i + 1}`);
            }

            // Completar com valores padrão se necessário
            while (paramValues.length < requiredParams) {
              paramValues.push(`Valor ${paramValues.length + 1}`);
            }

            templateComponents = [
              {
                type: "body",
                parameters: paramValues.map((text) => ({ 
                  type: "text", 
                  text: String(text) 
                })),
              },
            ];
          }

          const payload = {
            messaging_product: "whatsapp",
            to,
            type: "template",
            template: {
              name: template.name,
              language: { code: template.language || "pt_BR" },
              ...(templateComponents ? { components: templateComponents } : {}),
            },
          };

          const response = await fetch(
            `https://graph.facebook.com/v23.0/${phoneId}/messages`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            }
          );

          const result = await response.json();

          if (!response.ok) {
            console.error(`❌ Falha no template ${template.name}: ${result.error?.message}`);
            errors.push({
              template: template.name,
              templateIndex: i,
              error: result.error?.message || "Erro desconhecido",
              errorCode: result.error?.code,
              httpStatus: response.status,
              details: result,
            });

            // Se for erro de rate limit, aguardar mais tempo
            if (result.error?.code === 80007 || result.error?.code === 131026) {
              await new Promise(resolve => setTimeout(resolve, 30000));
            }
          } else {
            results.push({
              template: template.name,
              templateIndex: i,
              messageId: result.messages[0]?.id,
              success: true,
              timestamp: new Date().toISOString(),
            });

            // Salvar a mensagem no Supabase
            try {
              // Obter um conversation_id válido
              const validConversationId = await getConversationIdForMessage(to, conversationId);
              
              // Montar o corpo da mensagem
              let messageBody = `📧 Template: ${template.name}`;
              
              // Se o template tem parâmetros, incluir na mensagem
              if (templateComponents && templateComponents[0]?.parameters) {
                const params = templateComponents[0].parameters.map(p => p.text).join(', ');
                messageBody += `\n📝 Parâmetros: ${params}`;
              }
              
              // Se temos o texto original do template, usar ele
              const bodyComponent = template.components?.find(c => c.type === 'BODY');
              if (bodyComponent && bodyComponent.text) {
                let templateText = bodyComponent.text;
                
                // Substituir placeholders se temos parâmetros
                if (templateComponents && templateComponents[0]?.parameters) {
                  templateComponents[0].parameters.forEach((param, index) => {
                    templateText = templateText.replace(`{{${index + 1}}}`, param.text);
                  });
                }
                
                messageBody = templateText;
              }

              const messageData = {
                conversation_id: validConversationId,
                from_contact: from,
                body: messageBody,
                message_type: "template",
                received_at: new Date().toISOString(),
                status: "sent",
                whatsapp_message_id: result.messages[0].id,
                template_name: template.name,
                template_language: template.language || "pt_BR"
              };

              const { error: insertError } = await supabase.from("messages").insert([messageData]);
              
              if (insertError) {
                console.error(`❌ Erro ao salvar mensagem no banco (${template.name}):`, insertError);
              }
            } catch (dbError) {
              console.error(`❌ Erro ao salvar mensagem no banco (${template.name}):`, dbError);
            }
          }
        } catch (error) {
          console.error(`❌ Erro de conexão no template ${template.name}:`, error);
          errors.push({
            template: template.name,
            templateIndex: i,
            error: error.message,
            type: "connection_error",
          });
        }
      }


      // Mostrar resultado para o usuário
      if (results.length > 0) {
        let message = `Resultado do envio da campanha "${campaign.name}":\n\n`;
        message += `✅ Enviados: ${results.length} de ${campaign.selected_templates.length} templates\n`;
        
        if (errors.length > 0) {
          message += `❌ Erros: ${errors.length}\n\n`;
          message += "Templates que falharam:\n";
          errors.forEach((error, index) => {
            message += `${index + 1}. ${error.template}: ${error.error}\n`;
          });
          message += "\nVerifique os templates no WhatsApp Manager ou tente novamente.";
        } else {
          message += "\nTodos os templates foram enviados com sucesso! 🎉";
        }
        
        alert(message);
      } else {
        let errorMessage = "Erro ao enviar campanha: Todos os templates falharam\n\n";
        
        if (errors.length > 0) {
          errorMessage += "Detalhes dos erros:\n";
          errors.forEach((error, index) => {
            errorMessage += `${index + 1}. ${error.template}: ${error.error}\n`;
          });
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Erro ao enviar campanha:", error);
      alert("Erro ao enviar campanha: " + error.message);
    } finally {
      // Sempre fechar os menus após a tentativa de envio (sucesso ou erro)
      setSendingCampaignId(null);
      
      // Pequeno delay para garantir que o usuário veja o alert antes de fechar
      setTimeout(() => {
        setIsMenuMediaOpen(false);
        setSelectedMedia(null);
      }, 100);
    }
  };

  // Função para adicionar novo contato
  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone_number) {
      alert("Nome e telefone são obrigatórios");
      return;
    }

    // Validar formato do telefone
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(newContact.phone_number.replace(/\D/g, ''))) {
      alert("Formato de telefone inválido. Use apenas números (10-15 dígitos)");
      return;
    }

    setIsAddingContact(true);
    try {
      const { data, error } = await supabase
        .from("contacts")
        .insert([{
          name: newContact.name.trim(),
          phone_number: newContact.phone_number.replace(/\D/g, ''),
          avatar_url: newContact.avatar_url || null,
          created_at: new Date().toISOString(),
          operator_code_id: operatorData.operator_code_id
        }])
        .select();

      if (error) {
        console.error("Erro ao adicionar contato:", error);
        alert(`Erro ao adicionar contato: ${error.message}`);
        return;
      }

      alert("Contato adicionado com sucesso!");
      setNewContact({ name: "", phone_number: "", avatar_url: "" });
      setIsAddContactModalOpen(false);
    } catch (error) {
      console.error("Erro ao adicionar contato:", error);
      alert("Erro ao adicionar contato. Tente novamente.");
    } finally {
      setIsAddingContact(false);
    }
  };

  // Função para carregar contatos salvos
  const loadSavedContacts = async () => {
    setIsLoadingContacts(true);
    try {
      const { data, error } = await supabase
        .from("contacts")
        .select("*")
        .eq("operator_code_id", operatorData.operator_code_id)
        .order("name", { ascending: true });

      if (error) {
        console.error("Erro ao carregar contatos:", error);
        alert("Erro ao carregar contatos salvos");
        return;
      }

      setSavedContacts(data || []);
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      alert("Erro ao carregar contatos salvos");
    } finally {
      setIsLoadingContacts(false);
    }
  };

  // Função para iniciar conversa com contato selecionado
  const handleStartConversationWithContact = async (contact) => {
    try {
      console.log("Tentando iniciar conversa com:", contact.name, "Telefone:", contact.phone_number);
      
      // Verifica se já está criando uma conversa para este contato
      if (creatingConversationFor === contact.phone_number) {
        console.log("Já está criando conversa para este contato, aguarde...");
        return;
      }
      
      // Primeira verificação: busca nas conversas já carregadas na memória
      // Verifica por phone_number E por título (nome do contato)
      const existingInMemory = conversations?.find(
        conv => conv.phone_number === contact.phone_number || 
                 conv.title === contact.name
      );
      
      console.log("Conversa encontrada na memória:", existingInMemory);
      
      if (existingInMemory) {
        console.log("Selecionando conversa existente:", existingInMemory.title);
        setSelectedConversation(existingInMemory);
        setIsSearchContactModalOpen(false);
        setSearchTerm("");
        return;
      }

      // Segunda verificação: busca direta na tabela de conversas
      const { data: existingConversations, error: searchError } = await supabase
        .from('conversations')
        .select('conversation_id, title, type, created_at')
        .eq('type', 'individual')
        .eq('title', contact.name)
        .limit(1);

      if (searchError) {
        console.error("Erro ao buscar conversas:", searchError);
      }

      console.log("Conversas encontradas no banco por título:", existingConversations);

      if (existingConversations && existingConversations.length > 0) {
        // Se encontrou, recarrega as conversas e seleciona
        console.log("Conversa existente encontrada por título, recarregando lista...");
        const updatedConversations = await reloadConversations();
        
        const foundConversation = updatedConversations?.find(
          conv => conv.conversation_id === existingConversations[0].conversation_id
        );
        
        if (foundConversation) {
          console.log("Selecionando conversa recarregada:", foundConversation.title);
          setSelectedConversation(foundConversation);
          setIsSearchContactModalOpen(false);
          setSearchTerm("");
          return;
        }
      }

      // Se não existe, cria uma nova conversa
      console.log("Criando nova conversa para:", contact.name);
      setCreatingConversationFor(contact.phone_number);

      const { data: newConversation, error } = await supabase
        .from("conversations")
        .insert([{
          type: "individual",
          title: contact.name,
          avatar_url: contact.avatar_url,
          operator_code_id: operatorData.operator_code_id,
          created_at: new Date().toISOString(),
        }])
        .select()
        .single();

      if (error) {
        console.error("Erro ao criar conversa:", error);
        alert(`Erro ao criar conversa: ${error.message}`);
        setCreatingConversationFor(null);
        return;
      }

      // Cria uma mensagem inicial do sistema para que a conversa apareça na lista
      const { data: systemMessage, error: messageError } = await supabase
        .from("messages")
        .insert([{
          conversation_id: newConversation.conversation_id,
          from_contact: contact.contact_id,
          body: `Conversa iniciada com ${contact.name}`,
          message_type: "system",
          status: "system",
          received_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (messageError) {
        console.error("Erro ao criar mensagem inicial:", messageError);
        // Mesmo com erro na mensagem, continuamos o processo
      }

      setIsSearchContactModalOpen(false);
      setSearchTerm("");
      
      alert(`Conversa iniciada com ${contact.name}!`);
      
      // Recarrega as conversas e seleciona a nova
      setTimeout(async () => {
        const updatedConversations = await reloadConversations();
        
        // Procura a nova conversa na lista atualizada
        const foundConversation = updatedConversations?.find(
          conv => conv.conversation_id === newConversation.conversation_id
        );
        
        if (foundConversation) {
          setSelectedConversation(foundConversation);
          setCreatingConversationFor(null);
        } else {
          // Força um reload adicional se não encontrou
          setTimeout(async () => {
            const finalConversations = await reloadConversations();
            const finalFound = finalConversations?.find(
              conv => conv.conversation_id === newConversation.conversation_id
            );
            if (finalFound) {
              setSelectedConversation(finalFound);
            }
            setCreatingConversationFor(null);
          }, 500);
        }
      }, 1000);
    } catch (error) {
      console.error("Erro ao iniciar conversa:", error);
      alert("Erro ao iniciar conversa");
      setCreatingConversationFor(null);
    }
  };

  // Carregar campanhas quando o menu de campanhas for aberto
  useEffect(() => {
    if (selectedMedia === "campain") {
      loadCampaigns();
    }
  }, [selectedMedia]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Verificar se clicou em uma campanha (não fechar nesse caso)
      const clickedOnCampaign = e.target.closest('.campaign-option');
      
      if (clickedOnCampaign) {
        // Se clicou numa campanha, não fechar o menu ainda
        // O fechamento será feito pela própria função handleSendCampaign
        return;
      }

      // Verifica se clicou fora do dropdown
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setIsDropdownOpen(false);
      }

      // Verifica se clicou fora do modal de adicionar contato
      if (
        isAddContactModalOpen &&
        addContactModalRef.current &&
        !addContactModalRef.current.contains(e.target)
      ) {
        setIsAddContactModalOpen(false);
      }

      // Verifica se clicou fora do modal de buscar contato
      if (
        isSearchContactModalOpen &&
        searchContactModalRef.current &&
        !searchContactModalRef.current.contains(e.target)
      ) {
        setIsSearchContactModalOpen(false);
      }

      // Verifica se clicou fora do submenu
      if (
        selectedMedia &&
        subMenuMediaRef.current &&
        !subMenuMediaRef.current.contains(e.target)
      ) {
        setSelectedMedia(null);
      }
      
      // Verifica se clicou fora do menu principal
      if (
        isMenuMediaOpen &&
        menuMediaRef.current &&
        !menuMediaRef.current.contains(e.target)
      ) {
        setIsMenuMediaOpen(false);
        setSelectedMedia(null); // Fecha o submenu também
      }

      // Fecha context menu ao clicar fora
      if (
        contextMenu.visible &&
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target)
      ) {
        setContextMenu((prev) => ({ ...prev, visible: false }));
      }
    };

    if (isMenuMediaOpen || selectedMedia || isDropdownOpen || isAddContactModalOpen || isSearchContactModalOpen || contextMenu.visible) {
      // Usar um pequeno delay para garantir que o onClick seja processado primeiro
      const timeoutId = setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 10);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("click", handleClickOutside);
      };
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMenuMediaOpen, selectedMedia, isDropdownOpen, isAddContactModalOpen, isSearchContactModalOpen, contextMenu.visible]);

  const handleOpenContextMenu = (e, contact) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      conversation: contact,
    });
  };

  const handleDeleteConversation = async () => {
    if (!contextMenu.conversation) return;
    const convId = contextMenu.conversation.conversation_id;
    const confirmed = confirm("Deseja realmente excluir esta conversa? Esta ação também removerá todas as mensagens relacionadas.");
    if (!confirmed) return;

    const { error } = await deleteConversation(convId);
    if (error) {
      alert(`Erro ao excluir conversa: ${error.message || error}`);
      return;
    }

    // Atualiza lista de conversas
    const updated = await reloadConversations();
    // Se a conversa excluída estava selecionada, limpa a seleção
    if (selectedConversation && selectedConversation.conversation_id === convId) {
      setSelectedConversation(null);
    } else if (updated && updated.length > 0 && !selectedConversation) {
      // Opcional: seleciona a primeira conversa disponível
      setSelectedConversation(updated[0]);
    }
    setContextMenu((prev) => ({ ...prev, visible: false, conversation: null }));
  };

  return (
    <main className="containerChat">
      <div className="chat-content">
        {/* Container principal do chat */}
        <div className="chat-main-container">
          {/* Sidebar com lista de conversas */}
          <div className={`chat-sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        {/* Header da sidebar */}
        <div className="sidebar-header">
          <h2>Conversas</h2>
          <div className="sidebar-actions">
            <div className="dropdown-container">
              <button 
                className="icon-button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <BsThreeDotsVertical />
              </button>
              {isDropdownOpen && (
                <div className="dropdown-menu" ref={dropdownRef}>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      setIsSearchContactModalOpen(true);
                      setIsDropdownOpen(false);
                      loadSavedContacts();
                    }}
                  >
                    <FiSearch /> Buscar Contato
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => {
                      setIsAddContactModalOpen(true);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <FiUserPlus /> Adicionar Contato
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barra de pesquisa */}
        <div className="search-container">
          <div className="search-input-wrapper">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Pesquisar contatos..."
              className="search-input"
            />
          </div>
        </div>

        {/* Lista de contatos */}
        <div className="contacts-list">
          {conversations?.map((contact) => (
            <div
              key={contact.conversation_id}
              className={`contact-item ${
                selectedConversation === contact.conversation_id ? "active" : ""
              }`}
              onClick={() => {
                setSelectedConversation(contact);
                setIsMobileMenuOpen(false);
                // Marcar mensagens como lidas ao selecionar conversa
                markAsRead(contact.conversation_id);
              }}
              onContextMenu={(e) => handleOpenContextMenu(e, contact)}
            >
              <div className="contact-avatar">
                <div className={`avatar ${contact.online ? "online" : ""}`}>
                  <Avatar name={contact.title} />
                </div>
              </div>
              <div className="contact-info">
                <div className="contact-header">
                  <h3 className="contact-name">{contact.title}</h3>
                  <span className="contact-time">
                    {new Date(contact.last_message_time).toLocaleTimeString(
                      "pt-BR",
                      { hour: "2-digit", minute: "2-digit" }
                    )}
                  </span>
                </div>
                <div className="contact-footer">
                  <p className="contact-message">{contact.last_message}</p>
                  {(() => {
                    const unreadCount = getUnreadMessagesCount(messages, contact.conversation_id);
                    return unreadCount > 0 ? (
                      <span className="unread-badge">{unreadCount}</span>
                    ) : null;
                  })()}
                </div>
              </div>
            </div>
          ))}
        </div>
        {contextMenu.visible && (
          <div
            ref={contextMenuRef}
            style={{
              position: "fixed",
              top: contextMenu.y,
              left: contextMenu.x,
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: 8,
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              zIndex: 1000,
              minWidth: 180,
              padding: 8,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              style={{
                width: "100%",
                textAlign: "left",
                padding: "8px 12px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#c1121f",
                fontWeight: 600,
              }}
              onClick={handleDeleteConversation}
            >
              Excluir conversa
            </button>
          </div>
        )}
      </div>

        {/* Modal de Adicionar Contato */}
        {isAddContactModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content add-contact-modal" ref={addContactModalRef}>
              <div className="modal-header">
                <h3>Adicionar Novo Contato</h3>
                <button 
                  className="modal-close-btn"
                  onClick={() => setIsAddContactModalOpen(false)}
                >
                  <FiX />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="contact-name">Nome *</label>
                  <input
                    id="contact-name"
                    type="text"
                    value={newContact.name}
                    onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do contato"
                    className="modal-input"
                    disabled={isAddingContact}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-phone">Telefone *</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={newContact.phone_number}
                    onChange={(e) => setNewContact(prev => ({ ...prev, phone_number: e.target.value }))}
                    placeholder="Ex: 5511999887766"
                    className="modal-input"
                    disabled={isAddingContact}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact-avatar">URL do Avatar (opcional)</label>
                  <input
                    id="contact-avatar"
                    type="url"
                    value={newContact.avatar_url}
                    onChange={(e) => setNewContact(prev => ({ ...prev, avatar_url: e.target.value }))}
                    placeholder="https://exemplo.com/avatar.jpg"
                    className="modal-input"
                    disabled={isAddingContact}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="modal-btn secondary"
                  onClick={() => setIsAddContactModalOpen(false)}
                  disabled={isAddingContact}
                >
                  Cancelar
                </button>
                <button 
                  className="modal-btn primary"
                  onClick={handleAddContact}
                  disabled={isAddingContact || !newContact.name || !newContact.phone_number}
                >
                  {isAddingContact ? "Adicionando..." : "Adicionar Contato"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Buscar Contatos */}
        {isSearchContactModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content search-contact-modal" ref={searchContactModalRef}>
              <div className="modal-header">
                <h3>Buscar Contato Salvo</h3>
                <button 
                  className="modal-close-btn"
                  onClick={() => {
                    setIsSearchContactModalOpen(false);
                    setSearchTerm("");
                  }}
                >
                  <FiX />
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  
                  <input
                    id="search-contact"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Digite o nome ou telefone..."
                    className="modal-input"
                  />
                </div>
                <div className="contacts-search-list">
                  {isLoadingContacts ? (
                    <div className="loading-contacts">Carregando contatos...</div>
                  ) : savedContacts.length > 0 ? (
                    savedContacts
                      .filter(contact => 
                        contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        contact.phone_number?.includes(searchTerm)
                      )
                      .map((contact) => (
                        <div 
                          key={contact.contact_id} 
                          className="contact-search-item"
                          onClick={() => handleStartConversationWithContact(contact)}
                        >
                          <div className="contact-search-avatar">
                            <Avatar name={contact.name} />
                          </div>
                          <div className="contact-search-info">
                            <h4>{contact.name}</h4>
                            <p>{contact.phone_number}</p>
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="no-contacts">
                      {searchTerm ? "Nenhum contato encontrado com esse termo" : "Nenhum contato salvo encontrado"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Área principal do chat */}
        <div className="chat-main">
          {selectedConversation ? (
          <Fragment key={selectedConversation.conversation_id}>
            {/* Header do chat */}
            <div className="chat-header">
              <button
                className="mobile-menu-toggle"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                ☰
              </button>
              <div className="chat-contact-info">
                <div
                  className={`chat-avatar ${
                    selectedConversation.online ? "online" : ""
                  }`}
                >
                  {selectedConversation.avatar}
                </div>
                <div className="chat-contact-details">
                  <h3 className="chat-contact-name">
                    {selectedConversation.title}
                  </h3>
                  <p className="chat-contact-status">
                    {selectedConversation.online
                      ? "Online"
                      : "Visto por último às 13:45"}
                  </p>
                </div>
              </div>
              <div className="chat-actions">
                <button className="icon-button">
                  <IoMdCall />
                </button>
                <button className="icon-button">
                  <IoMdVideocam />
                </button>
                <button className="icon-button">
                  <FiMoreVertical />
                </button>
              </div>
            </div>

            {/* Área de mensagens */}
            <div className="chat-messages" ref={messsageRef}>
              {filteredMessages?.map((msg) => (
                <div
                  key={msg.message_id}
                  className={`message ${
                    msg.message_type === "system" 
                      ? "system" 
                      : msg.status !== "received" 
                        ? "delivered" 
                        : "received"
                  }`}
                >
                  <div className="message-content">
                    {msg.message_type === "system" ? (
                      // Mensagem do sistema - exibição simplificada
                      <div className="system-message-wrapper">
                        <p className="system-message-text">{msg.body}</p>
                        <span className="system-message-time">
                          {new Date(msg.received_at).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ) : (
                      // Mensagem normal
                      <>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 16,
                          }}
                        >
                          <p className="message-text">{msg.body}</p>
                          <p>
                            {msg.status === "sending" ? (
                              <MdAccessTime style={{ color: "#999" }} />
                            ) : msg.status === "sent" ? (
                              <IoCheckmarkSharp />
                            ) : msg.status === "delivered" ||
                              msg.status === "read" ? (
                              <IoCheckmarkDoneSharp
                                style={{
                                  color: msg.status === "read" ? "red" : "",
                                }}
                              />
                            ) : msg.status === "received" ? null : (
                              !msg.status && <MdAccessTime />
                            )}
                          </p>
                        </div>

                        <span className="message-time">
                          {new Date(msg.received_at).toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input de mensagem */}
            <div className="chat-input-container">
              {/* Menu de Media */}
              {isMenuMediaOpen && (
                <div className="menu-media" ref={menuMediaRef}>
                  <button
                    onClick={() => {
                      setSelectedMedia(selectedMedia === "campain" ? null : "campain");
                    }}
                    className={`menu-media-button ${
                      selectedMedia === "campain" ? "active" : ""
                    }`}
                  >
                    <MdCampaign /> Campanhas <FaAngleRight />
                  </button>
                </div>
              )}
              {selectedMedia === "campain" && (
                <div className="sub-menu-media campaigns-submenu" ref={subMenuMediaRef}>
                  <div className="submenu-header">
                    <h4>Campanhas Disponíveis</h4>
                    <button
                      className="close-submenu-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMedia(null);
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <div className="campaigns-list">
                    {campaignsLoading ? (
                      <div className="loading-campaigns">Carregando campanhas...</div>
                    ) : campaigns.length > 0 ? (
                      campaigns.map((campaign) => {
                        const isBeingSent = sendingCampaignId === campaign.id;
                        const isDisabled = sendingCampaignId !== null;
                        
                        return (
                          <div 
                            key={campaign.id} 
                            className={`campaign-option ${isDisabled ? 'disabled' : ''}`}
                            onClick={(event) => !isDisabled && handleSendCampaign(campaign.id, event)}
                            style={{ 
                              opacity: isDisabled && !isBeingSent ? 0.4 : 1,
                              cursor: isDisabled ? 'not-allowed' : 'pointer'
                            }}
                          >
                            <div className="campaign-info">
                              <h5>{campaign.name}</h5>
                              {campaign.description && (
                                <p className="campaign-desc">{campaign.description}</p>
                              )}
                              <span className="templates-count">
                                {campaign.selected_templates?.length || 0} templates
                              </span>
                            </div>
                            {isBeingSent && (
                              <div className="sending-indicator">
                                <span>Enviando...</span>
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-campaigns">
                        <p>Nenhuma campanha disponível.</p>
                        <p>Crie campanhas no WhatsApp Manager.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  setIsMenuMediaOpen(!isMenuMediaOpen);
                  if (isMenuMediaOpen) {
                    setSelectedMedia(null); // Fecha o submenu quando o menu principal é fechado
                  }
                }}
                className="icon-button"
              >
                <FiPaperclip />
              </button>
              <div className="message-input-wrapper">
                <input
                  type="text"
                  placeholder="Digite uma mensagem..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="message-input"
                />
                <button className="icon-button">
                  <FiSmile />
                </button>
              </div>
              <button
                className="send-button"
                onClick={handleSendMessage}
                disabled={!message.trim() || sendingMessage}
              >
                {sendingMessage ? <MdAccessTime /> : <FiSend />}
              </button>
            </div>
          </Fragment>
        ) : (
          <div className="no-chat-selected">
            <div className="no-chat-content">
              <h2>Bem-vindo ao Chat</h2>
              <p>Selecione uma conversa para começar a conversar</p>
            </div>
          </div>
        )}
          </div>

          {/* Overlay para mobile */}
          {isMobileMenuOpen && (
            <div
              className="mobile-overlay"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default Chat;
