import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

import './ManageLayout.css';
import type { Invite } from '../../types';
import QrCodeModal from './QrCodeModal';
import InviteModal from '../../components/manage/InviteModal';

type FilterType = 'all' | 'pending' | 'responded';

const ManagePage: React.FC = () => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvite, setEditingInvite] = useState<Invite | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [selectedInvite, setSelectedInvite] = useState<Invite | null>(null);

  const fetchInvites = useCallback(async (filter: FilterType) => {
    setLoading(true);
    setError(null);

    const endpointMap = {
      all: '/Guest/invite/get-all',
      pending: '/Guest/invite/get-pending',
      responded: '/Guest/invite/get-responded',
    };

    try {
      const response = await api.get(endpointMap[filter]);

      const invitesWithId = response.data.data.map((invite: any) => {
        const urlParts = invite.inviteUrl.split('/');
        const id = urlParts[urlParts.length - 1];

        return {
          ...invite,
          id: id,
        };
      });

      setInvites(invitesWithId);
    } catch (err) {
      setError('Não foi possível carregar os convites.');
      console.error('Erro ao buscar convites:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvites(activeFilter);
  }, [activeFilter, fetchInvites]);

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const handleOpenCreateModal = () => {
    setEditingInvite(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (invite: Invite) => {
    setEditingInvite(invite);
    setIsModalOpen(true);
  };

  const handleSaveInvite = async (inviteData: { familyName: string; celNumber: string; names: string[] }, id?: string) => {
    try {
      if (id) {
        await api.put(`/Manager/update-invite/${id}`, inviteData);
      } else {
        await api.post('/Manager/generate-invite', inviteData);
      }
      setIsModalOpen(false);
      fetchInvites(activeFilter);
    } catch (err) {
      console.error('Erro ao salvar convite:', err);
    }
  };

  const handleResetReply = async (id: string) => {
    if (window.confirm('Tem certeza que deseja resetar a resposta deste convite?')) {
      try {
        await api.put(`/Manager/reset-reply-invite/${id}`);
        fetchInvites(activeFilter);
      } catch (err) {
        console.error('Erro ao resetar resposta:', err);
      }
    }
  };

  const handleDeleteInvite = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este convite? Esta ação não pode ser desfeita.')) {
      try {
        await api.delete(`/Manager/remove-invite/${id}`);
        fetchInvites(activeFilter);
      } catch (err) {
        console.error('Erro ao remover convite:', err);
        alert('Não foi possível remover o convite. Tente novamente.');
      }
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 2000);
    });
  };

  const handleOpenQrModal = (invite: Invite) => {
    setSelectedInvite(invite);
    setIsQrModalOpen(true);
  };

  const handleSendWhatsApp = (invite: Invite) => {
    const fullNumber = `55${invite.celNumber.replace(/\D/g, '')}`;
    const message = `Olá, Família ${invite.familyName}! Ficaríamos muito felizes com a sua presença no nosso casamento. Para confirmar e ver mais detalhes, acesse o nosso convite online: ${invite.inviteUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${fullNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div className="main-content-header">
        <h1>Gerenciar Convites</h1>
        <button className="button primary" onClick={handleOpenCreateModal}>
          <i className="fas fa-plus"></i>
          Criar Convite
        </button>
      </div>

      <div className="filters">
        <button
          className={`button ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => handleFilterClick('all')}>
          Todos
        </button>
        <button
          className={`button ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => handleFilterClick('pending')}>
          Pendentes
        </button>
        <button
          className={`button ${activeFilter === 'responded' ? 'active' : ''}`}
          onClick={() => handleFilterClick('responded')}>
          Respondidos
        </button>
      </div>

      <div className="table-container">
        {loading && <p>Carregando convites...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <table>
            <thead>
              <tr>
                <th>Família</th>
                <th>Celular</th>
                <th>Convidados</th>
                <th>Status</th>
                <th>Link</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {invites.length > 0 ? (
                invites.map((invite) => (
                  <tr key={invite.id}>
                    <td data-label="Família">{invite.familyName}</td>
                    <td data-label="Celular">{invite.celNumber}</td>
                    <td data-label="Convidados">{invite.persons.length}</td>
                    <td data-label="Status">
                      {invite.isResponded ? (
                        <span className="status responded">Respondido</span>
                      ) : (
                        <span className="status pending">Pendente</span>
                      )}
                    </td>
                    <td data-label="Link">
                      <button className="button copy-link-btn" onClick={() => handleCopyLink(invite.inviteUrl)}>
                        {copiedUrl === invite.inviteUrl ? (
                          <>
                            <i className="fas fa-check"></i>
                            Copiado!
                          </>
                        ) : (
                          <>
                            <i className="fas fa-copy"></i>
                            Copiar Link
                          </>
                        )}
                      </button>
                    </td>
                    <td data-label="Ações">
                      <div className="actions">
                        <button className="action-button whatsapp" title="Enviar via WhatsApp" onClick={() => handleSendWhatsApp(invite)}>
                          <i className="fab fa-whatsapp"></i>
                        </button>
                        <button className="action-button qr" title="Gerar QR Code" onClick={() => handleOpenQrModal(invite)}>
                          <i className="fas fa-qrcode"></i>
                        </button>
                        <button className="action-button edit" title="Editar" onClick={() => handleOpenEditModal(invite)}>
                          <i className="fas fa-pencil-alt"></i>
                        </button>
                        <button className="action-button reset" title="Resetar Resposta" onClick={() => handleResetReply(invite.id)}>
                          <i className="fas fa-undo"></i>
                        </button>
                        <button className="action-button delete" title="Remover Convite" onClick={() => handleDeleteInvite(invite.id)}>
                          <i className="fas fa-trash-alt"></i>
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>Nenhum convite encontrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveInvite}
        inviteToEdit={editingInvite}
      />

      <QrCodeModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
        url={selectedInvite?.inviteUrl || null}
        familyName={selectedInvite?.familyName || null}
      />
    </>
  );
};

export default ManagePage;