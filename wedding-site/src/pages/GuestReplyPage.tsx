import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import type { Person } from '../types';
import './GuestReplyPage.css';

interface InviteDetails {
  familyName: string;
  persons: string[];
  isResponded: boolean;
}

const GuestReplyPage: React.FC = () => {
  const { inviteId } = useParams<{ inviteId: string }>();
  const [invite, setInvite] = useState<InviteDetails | null>(null);
  const [responses, setResponses] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyResponded, setAlreadyResponded] = useState(false);

  const cpfMask = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const dateMask = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1');
  };

  const fetchInviteDetails = useCallback(async () => {
    try {
      const response = await api.get(`/Guest/invite/${inviteId}`);
      const inviteData = response.data.data;
      if (inviteData.isResponded) {
        setAlreadyResponded(true);
      } else {
        setInvite(inviteData);
        setResponses(inviteData.persons.map((name: string) => ({ name, isAccepted: true, cpf: '', birthDate: '' })));
      }
    } catch (err) {
      setError('Convite não encontrado ou inválido.');
    } finally {
      setLoading(false);
    }
  }, [inviteId]);

  useEffect(() => {
    fetchInviteDetails();
  }, [fetchInviteDetails]);

  const handleResponseChange = (personName: string, field: keyof Person, value: any) => {
    setResponses(prev =>
      prev.map(p => (p.name === personName ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allPersonsPayload = responses.map(p => {
      if (p.isAccepted) {
        const [day, month, year] = p.birthDate.split('/');
        const isoDate = new Date(`${year}-${month}-${day}`).toISOString();
        return {
          name: p.name,
          isAccepted: p.isAccepted,
          cpf: p.cpf.replace(/\D/g, ''),
          birthDate: isoDate,
        };
      } else {
        return {
          name: p.name,
          isAccepted: p.isAccepted,
          cpf: null,
          birthDate: null
        };
      }
    });

    const payload = { inviteId, persons: allPersonsPayload };

    try {
      await api.post('/Guest/invite/reply', payload);
      setSubmitted(true);
    } catch (err) {
      setError('Ocorreu um erro ao enviar a sua resposta.');
    }
  };
  if (loading) {
    return (
      <div className="reply-container">
        <div className="reply-card">
          <p>A carregar detalhes do convite...</p>
        </div>
      </div>
    );
  }

  if (alreadyResponded) {
    return (
      <div className="reply-container">
        <div className="reply-card">
          <img src="/assets/images/logo.png" alt="Monograma E&M" className="reply-logo" />
          <h2>Resposta Recebida!</h2>
          <p className="thank-you-message">Já recebemos a vossa resposta para o nosso casamento.<br />Obrigado!</p>
          <Link to="/" className="button primary-reply gifts-link">Ver a nossa lista de presentes</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="reply-container">
        <div className="reply-card">
          <img src="/assets/images/logo.png" alt="Monograma E&M" className="reply-logo" />
          <h2>Obrigado!</h2>
          <p className="thank-you-message">A sua presença foi registada com sucesso.<br />Mal podemos esperar para celebrar consigo!</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <title>Evelyn & Marccus - Confirme sua presença!</title>
    <meta name="description" content="Confirme sua presença para celebrar conosco!" />

    <div className="reply-container">
      <div className="reply-card">
        {error ? (
          <>
            <h2 style={{ color: '#d93025' }}>Erro</h2>
            <p>{error}</p>
          </>
        ) : (
          <>
            <img src="/assets/images/logo.png" alt="Monograma E&M" className="reply-logo" />
            <h1>Confirmação de Presença</h1>
            <p className="welcome-message">Bem-vinda, <strong>{invite?.familyName}</strong>!</p>
            <p className="instruction-message">Por favor, confirme a presença de cada convidado abaixo.</p>
            <form onSubmit={handleSubmit}>
              {responses.map(person => (
                <div key={person.name} className="person-block">
                  <div className="person-row">
                    <span className="person-name">{person.name}</span>
                    <div className="radio-group">
                      <label className={person.isAccepted ? 'active' : ''}>
                        <input type="radio" name={person.name} checked={person.isAccepted} onChange={() => handleResponseChange(person.name, 'isAccepted', true)} />
                        Sim, irei!
                      </label>
                      <label className={!person.isAccepted ? 'active' : ''}>
                        <input type="radio" name={person.name} checked={!person.isAccepted} onChange={() => handleResponseChange(person.name, 'isAccepted', false)} />
                        Não poderei ir
                      </label>
                    </div>
                  </div>
                  {person.isAccepted && (
                    <div className="person-details">
                      <input
                        type="text"
                        placeholder="CPF"
                        value={person.cpf}
                        onChange={(e) => handleResponseChange(person.name, 'cpf', cpfMask(e.target.value))}
                        required={person.isAccepted}
                      />
                      <input
                        type="text"
                        placeholder="Data de Nascimento (DD/MM/AAAA)"
                        value={person.birthDate}
                        onChange={(e) => handleResponseChange(person.name, 'birthDate', dateMask(e.target.value))}
                        required={person.isAccepted}
                      />
                    </div>
                  )}
                </div>
              ))}
              <button type="submit" className="button primary-reply">Confirmar Presença</button>
            </form>
          </>
        )}
      </div>
    </div>
    </>
  );
};

export default GuestReplyPage;