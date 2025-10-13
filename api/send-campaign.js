import supabase from "../src/helper/supaBaseClient.js";

export const config = {
  api: {
    bodyParser: true,
  },
};

// Função para validar se um valor é um UUID válido
function isValidUUID(uuid) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

// Função simplificada para criar/buscar conversa sem dependência da tabela conversations
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
      const conversationId = existingConversations[0].conversation_id;
      return conversationId;
    }
  } catch (error) {
  }
  
  // Se não conseguiu encontrar ou criar, gerar um UUID temporário
  // Isso permite que o sistema funcione mesmo sem a tabela conversations  
  const tempUuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
  return tempUuid;
}

// Envia uma campanha (múltiplos templates em sequência)
export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Método não permitido" });
    }

    const {
      from,
      conversationId,
      to, // número no formato E.164, ex: 5599999999999
      campaignId,
      variables = [], // opcional: variáveis para substituir nos templates
    } = req.body;

    if (!to || !campaignId) {
      return res.status(400).json({ error: "Dados incompletos" });
    }

    // Buscar a campanha no banco de dados
    const { data: campaign, error: campaignError } = await supabase
      .from("whatsapp_campaigns")
      .select("*")
      .eq("id", campaignId)
      .single();

    if (campaignError || !campaign) {
      return res.status(404).json({ error: "Campanha não encontrada" });
    }

    const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

    if (!phoneId || !accessToken) {
      return res.status(500).json({
        error: "Variáveis de ambiente ausentes no servidor",
      });
    }

    const results = [];
    const errors = [];


    // Enviar cada template da campanha em sequência
    for (let i = 0; i < campaign.selected_templates.length; i++) {
      const template = campaign.selected_templates[i];
      const templateNum = i + 1;
      
      
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
          // Usar variáveis da campanha, passadas na requisição, ou valores padrão
          let paramValues = [];
          
          // Prioridade: 1) Variáveis da campanha salvas, 2) Variáveis passadas na request, 3) Valores padrão
          const campaignVariables = campaign.variables || [];
          const requestVariables = variables || [];
          
          // Função para processar variáveis dinâmicas
          const processDynamicVariable = (variable, context) => {
            if (typeof variable !== 'string' || !variable.startsWith('{{')) {
              return variable; // Valor estático
            }
            
            // Processar variáveis dinâmicas
            switch (variable) {
              case '{{selectedConversation.title}}':
                return context?.selectedConversation?.title || 'Nome não disponível';
              case '{{selectedConversation.phone_number}}':
                return context?.selectedConversation?.phone_number || context?.to || 'Telefone não disponível';
              case '{{currentDate}}':
                return new Date().toLocaleDateString('pt-BR');
              case '{{currentTime}}':
                return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
              default:
                return variable; // Retorna o próprio valor se não encontrar correspondência
            }
          };
          
          // Criar contexto para variáveis dinâmicas
          const context = {
            selectedConversation: req.body.selectedConversation || null,
            to: to,
            currentRequest: req.body
          };
          
          if (campaignVariables.length > 0) {
            // Processar variáveis da campanha (podem ser dinâmicas ou estáticas)
            paramValues = campaignVariables.slice(0, requiredParams).map(variable => 
              processDynamicVariable(variable, context)
            );
          } else if (requestVariables.length > 0) {
            // Processar variáveis da requisição
            paramValues = requestVariables.slice(0, requiredParams).map(variable => 
              processDynamicVariable(variable, context)
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

          // Salvar a mensagem no Supabase com mais detalhes
          try {
            // Obter um conversation_id válido
            const validConversationId = await getConversationIdForMessage(to, conversationId);
            
            // Montar o corpo da mensagem com mais informações sobre o template
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
              conversation_id: validConversationId, // Usando o UUID válido da conversa
              from_contact: from, // Campo esperado é contact_id (UUID), não número de telefone
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
            } else {
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

    if (errors.length > 0) {
    }

    // Salvar log da campanha enviada
    try {
      // Garantir que temos um conversation_id válido para o log
      const validConversationId = await getConversationIdForMessage(to, conversationId);
      
      await supabase.from("campaign_logs").insert([
        {
          campaign_id: campaignId,
          conversation_id: validConversationId,
          to_number: to,
          sent_at: new Date().toISOString(),
          results: results,
          errors: errors,
          total_sent: results.length,
          total_errors: errors.length,
        },
      ]);
    } catch (logError) {
      console.error("Erro ao salvar log da campanha:", logError);
    }

    const response = {
      success: results.length > 0,
      campaign: {
        id: campaignId,
        name: campaign.name,
      },
      summary: {
        totalTemplates: campaign.selected_templates.length,
        sent: results.length,
        errors: errors.length,
      },
      results,
      errors,
    };

    if (errors.length === campaign.selected_templates.length) {
      return res.status(500).json({
        ...response,
        error: "Todos os templates falharam ao ser enviados",
      });
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error("❌ Erro ao enviar campanha:", error);
    return res.status(500).json({
      error: "Erro interno do servidor",
      details: error.message,
    });
  }
}
