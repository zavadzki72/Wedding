import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
// Estilos virão do novo arquivo CSS

const PaymentStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');

  const statusInfo = {
    success: {
      title: 'Obrigado pelo seu presente!',
      message: 'Recebemos a confirmação do seu presente e ele já foi comprado. Sua generosidade enche nossos corações de alegria!',
      icon: 'fa-check-circle',
      color: '#28a745'
    },
    pending: {
      title: 'Pagamento em Processamento',
      message: 'Seu pagamento está sendo processado. Avisaremos assim que for confirmado. Obrigado pelo carinho!',
      icon: 'fa-hourglass-half',
      color: '#ffc107'
    },
    error: {
      title: 'Ocorreu um Erro',
      message: 'Não foi possível processar seu pagamento. Por favor, tente novamente ou entre em contato conosco.',
      icon: 'fa-times-circle',
      color: '#dc3545'
    },
  };

  const currentStatus = status === 'success' || status === 'pending' || status === 'error' ? statusInfo[status] : statusInfo.error;

  return (
    <div className="payment-status-container">
      <div className="payment-status-card">
        <i className={`fas ${currentStatus.icon}`} style={{ color: currentStatus.color }}></i>
        <h2>{currentStatus.title}</h2>
        <p>{currentStatus.message}</p>
        <Link to="/gifts" className="button primary">Voltar para a lista</Link>
      </div>
    </div>
  );
};

export default PaymentStatusPage;