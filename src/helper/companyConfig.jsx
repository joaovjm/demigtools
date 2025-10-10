// Helper para obter o número da empresa de diferentes fontes
export function getCompanyPhoneNumber() {
  // Verifica se estamos no browser e se localStorage está disponível
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedPhone = localStorage.getItem('companyPhoneNumber');
    if (storedPhone) return storedPhone;
  }
  
  // Verifica se process está disponível (no servidor ou build-time no cliente)
  if (typeof process !== 'undefined' && process.env) {
    return process.env.REACT_APP_WHATSAPP_PHONE_NUMBER || 
           process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ||
           process.env.WHATSAPP_PHONE_NUMBER ||
           null;
  }
  
  // Fallback: buscar diretamente nas variáveis globais (caso tenham sido injetadas)
  if (typeof window !== 'undefined') {
    return window.REACT_APP_WHATSAPP_PHONE_NUMBER || 
           window.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER ||
           null;
  }
  
  return null;
}

// Helper para definir o número da empresa no localStorage
export function setCompanyPhoneNumber(phoneNumber) {
  if (phoneNumber) {
    localStorage.setItem('companyPhoneNumber', phoneNumber);
  }
}

// Helper para limpar configuração armazenada
export function clearCompanyConfig() {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem('companyPhoneNumber');
  }
}

// CONFIGURAÇÃO: Número da empresa para identificar mensagens enviadas
// TODO: Substitua pelo número real da sua empresa WhatsApp
const DEFAULT_COMPANY_PHONE = "5511999999999"; // Formato: código país + DDD + número

// Helper para configurar número da empresa automaticamente
export function initCompanyConfig() {
  if (typeof window !== 'undefined' && !localStorage.getItem('companyPhoneNumber')) {
    setCompanyPhoneNumber(DEFAULT_COMPANY_PHONE);
    console.log('💬 Chat: Número da empresa configurado ->', DEFAULT_COMPANY_PHONE);
    console.log('💡 Para alterar, edite DEFAULT_COMPANY_PHONE em src/helper/companyConfig.jsx');
  }
}
