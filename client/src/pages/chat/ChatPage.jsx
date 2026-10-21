import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '../../components/layout/AppLayout';
import OnlineIndicator from '../../components/chat/OnlineIndicator';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import {
  getPresenceRoster,
  getConversations,
  createConversation,
  getMessages,
  sendMessage,
  addGroupMembers,
  removeGroupMember,
} from '../../services/chatService';
import { getProjects } from '../../services/projectService';

function ChatPage() {
  const { user, isAdmin, isHR, isAdminOrHR } = useAuth();

  // State
  const [presenceList, setPresenceList] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConv, setLoadingConv] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);

  // Filters & Search
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, GROUPS, DIRECT
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isDirectModalOpen, setIsDirectModalOpen] = useState(false);
  const [directSearch, setDirectSearch] = useState('');
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);
  const [projects, setProjects] = useState([]);

  // New Group Form
  const [groupForm, setGroupForm] = useState({
    title: '',
    description: '',
    category: 'PROJECT',
    project_id: '',
    member_ids: [],
  });
  const [creatingGroup, setCreatingGroup] = useState(false);

  const messagesEndRef = useRef(null);

  // Load initial data
  const loadInitialData = async () => {
    try {
      const [presRes, convRes] = await Promise.all([
        getPresenceRoster(),
        getConversations(),
      ]);

      if (presRes.success) setPresenceList(presRes.data || []);
      if (convRes.success) {
        setConversations(convRes.data || []);
        if (!activeConvId && convRes.data?.length > 0) {
          setActiveConvId(convRes.data[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load chat data:', err);
    } finally {
      setLoadingConv(false);
    }
  };

  useEffect(() => {
    loadInitialData();
    if (isAdminOrHR) {
      getProjects().then((res) => {
        if (res.success) setProjects(res.data || []);
      }).catch(() => {});
    }
  }, []);

  // Poll presence and conversation updates every 4 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const [presRes, convRes] = await Promise.all([
          getPresenceRoster(),
          getConversations(),
        ]);
        if (presRes.success) setPresenceList(presRes.data || []);
        if (convRes.success) setConversations(convRes.data || []);
      } catch (err) {
        // silent background poll
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Load messages when active conversation changes
  const loadMessages = async (convId, silent = false) => {
    if (!convId) return;
    if (!silent) setLoadingMessages(true);
    try {
      const res = await getMessages(convId);
      if (res.success) {
        setMessages(res.data || []);
      }
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      if (!silent) setLoadingMessages(false);
    }
  };

  const { socket, joinConversation, leaveConversation, sendTyping, sendStopTyping, typingMap } = useSocket();
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId);
      joinConversation(activeConvId);
    }
    return () => {
      if (activeConvId) {
        leaveConversation(activeConvId);
      }
    };
  }, [activeConvId, joinConversation, leaveConversation]);

  // Real-time Socket.IO listener for instant message delivery
  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (newMsg) => {
      if (!newMsg || !newMsg.conversation_id) return;

      // If message is for currently open conversation
      if (newMsg.conversation_id === activeConvId) {
        setMessages((prev) => {
          // Avoid duplicate insertion
          if (prev.some((m) => m.id === newMsg.id)) return prev;
          const isMine = newMsg.sender_id === user?.id;
          return [...prev, { ...newMsg, isMine }];
        });
      }

      // Live update conversation preview in sidebar
      setConversations((prev) =>
        prev.map((c) =>
          c.id === newMsg.conversation_id
            ? {
                ...c,
                last_message_text: newMsg.message,
                last_message_at: newMsg.created_at,
              }
            : c
        )
      );
    };

    socket.on('new_message', handleIncomingMessage);
    return () => {
      socket.off('new_message', handleIncomingMessage);
    };
  }, [socket, activeConvId, user?.id]);

  // Fallback Polling (relaxed to 8 seconds since Socket.IO delivers live)
  useEffect(() => {
    if (!activeConvId) return;
    const interval = setInterval(() => {
      loadMessages(activeConvId, true);
    }, 8000);

    return () => clearInterval(interval);
  }, [activeConvId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle input change with real-time typing indicator
  const handleInputChange = (e) => {
    const val = e.target.value;
    setMessageInput(val);

    if (activeConvId && val.trim()) {
      const myName = user?.employeeProfile
        ? `${user.employeeProfile.first_name} ${user.employeeProfile.last_name}`
        : user?.email?.split('@')[0] || 'A colleague';
      sendTyping(activeConvId, myName);

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        sendStopTyping(activeConvId);
      }, 2500);
    } else if (activeConvId && !val.trim()) {
      sendStopTyping(activeConvId);
    }
  };

  // Send message handler
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!messageInput.trim() || !activeConvId || sending) return;

    const content = messageInput.trim();
    setMessageInput('');
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    sendStopTyping(activeConvId);
    setSending(true);

    // Optimistic message rendering
    const tempMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: activeConvId,
      sender_id: user.id,
      message: content,
      message_type: 'TEXT',
      created_at: new Date().toISOString(),
      isMine: true,
      senderName: user.employeeProfile ? `${user.employeeProfile.first_name} ${user.employeeProfile.last_name}` : user.email.split('@')[0],
      senderRole: user.role,
      senderPhoto: user.employeeProfile?.profile_photo || null,
      senderOnline: true,
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await sendMessage(activeConvId, { message: content });
      if (res.success) {
        // Replace temp with real message
        setMessages((prev) => prev.map((m) => (m.id === tempMessage.id ? res.data : m)));
        // Refresh conversation list to show new last_message_text
        getConversations().then((c) => c.success && setConversations(c.data));
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      alert(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  // Start direct chat with user
  const handleStartDirectChat = async (targetUser) => {
    if (!targetUser || targetUser.id === user.id) return;
    try {
      const res = await createConversation({
        type: 'DIRECT',
        recipient_id: targetUser.id,
      });
      if (res.success) {
        const conv = res.data;
        await getConversations().then((c) => {
          if (c.success) setConversations(c.data);
        });
        setActiveConvId(conv.id);
        setIsDirectModalOpen(false);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start direct chat.');
    }
  };

  // Create Group Channel handler
  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupForm.title.trim()) return;

    setCreatingGroup(true);
    try {
      const res = await createConversation({
        type: 'GROUP',
        title: groupForm.title.trim(),
        description: groupForm.description.trim(),
        category: groupForm.category,
        project_id: groupForm.category === 'PROJECT' && groupForm.project_id ? Number(groupForm.project_id) : null,
        member_ids: groupForm.member_ids,
      });

      if (res.success) {
        await getConversations().then((c) => {
          if (c.success) setConversations(c.data);
        });
        setActiveConvId(res.data.id);
        setIsNewGroupModalOpen(false);
        setGroupForm({
          title: '',
          description: '',
          category: 'PROJECT',
          project_id: '',
          member_ids: [],
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create group channel.');
    } finally {
      setCreatingGroup(false);
    }
  };

  // Active conversation details
  const currentConv = conversations.find((c) => c.id === activeConvId);

  // Filter conversations based on tab and search
  const filteredConversations = conversations.filter((c) => {
    const matchTab =
      activeTab === 'ALL'
        ? true
        : activeTab === 'GROUPS'
        ? c.type === 'GROUP'
        : c.type === 'DIRECT';

    const matchSearch =
      !searchQuery ||
      c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.last_message_text?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchTab && matchSearch;
  });

  // Online colleagues (excluding current user)
  const activeColleagues = presenceList.filter((p) => p.id !== user.id);
  const onlineColleagues = activeColleagues.filter((p) => p.is_online);

  return (
    <AppLayout
      pageTitle="Company Workplace Chat & Groups"
      subtitle="Real-time workplace collaboration, project squad groups, intern channels, and active presence"
    >
      {/* 🟢 TOP BAR: Live Active Workforce Carousel (Instagram / Facebook Style) */}
      <div
        style={{
          marginBottom: '1.25rem',
          padding: '0.875rem 1.25rem',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 2px 6px rgba(15, 23, 42, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>⚡</span>
            <span style={{ fontWeight: '800', fontSize: '0.875rem', color: 'var(--text-main)' }}>
              Workforce Live Presence
            </span>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'rgba(16, 185, 129, 0.12)',
                color: '#047857',
                padding: '0.15rem 0.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: '700',
              }}
            >
              🟢 {onlineColleagues.length + 1} Online Now
            </span>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Click on any team member to message directly
          </span>
        </div>

        {/* Scrollable Avatar Strip */}
        <div
          style={{
            display: 'flex',
            gap: '1.25rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
            scrollbarWidth: 'thin',
          }}
        >
          {/* Current User Active Bubble */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '68px', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: '48px', height: '48px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  border: '2px solid #10b981',
                  overflow: 'hidden',
                }}
              >
                {user.employeeProfile?.profile_photo ? (
                  <img src={user.employeeProfile.profile_photo} alt="Me" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.employeeProfile ? `${user.employeeProfile.first_name[0]}${user.employeeProfile.last_name[0]}` : 'ME'
                )}
              </div>
              <span style={{ position: 'absolute', bottom: '0', right: '0' }}>
                <OnlineIndicator isOnline={true} size="sm" />
              </span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '68px' }}>
              You (Active)
            </span>
          </div>

          {/* Team Members */}
          {activeColleagues.map((member) => (
            <div
              key={member.id}
              onClick={() => handleStartDirectChat(member)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '68px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              title={`${member.displayName} (${member.designation}) — ${member.is_online ? 'Active now' : 'Offline'}`}
            >
              <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: member.employment_type === 'INTERN' ? '#e0f2fe' : '#f1f5f9',
                    color: member.employment_type === 'INTERN' ? '#0369a1' : 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '0.875rem',
                    border: member.is_online ? '2.5px solid #10b981' : '1.5px solid var(--border-color)',
                    boxShadow: member.is_online ? '0 0 8px rgba(16, 185, 129, 0.4)' : 'none',
                    overflow: 'hidden',
                  }}
                >
                  {member.profile_photo ? (
                    <img src={member.profile_photo} alt={member.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    member.displayName.slice(0, 2).toUpperCase()
                  )}
                </div>
                <span style={{ position: 'absolute', bottom: '0', right: '0' }}>
                  <OnlineIndicator isOnline={member.is_online} size="sm" />
                </span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', color: member.is_online ? 'var(--text-main)' : 'var(--text-muted)', marginTop: '0.35rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '68px' }}>
                {member.displayName.split(' ')[0]}
              </span>
              <span style={{ fontSize: '0.65rem', color: member.is_online ? '#059669' : '#94a3b8', fontWeight: '600' }}>
                {member.is_online ? 'Active' : 'Away'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 💬 MAIN CHAT WORKSPACE (Split Panel) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '360px 1fr',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
          height: 'calc(100vh - 275px)',
          minHeight: '560px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {/* ================= LEFT PANE: THREADS & CHANNELS ================= */}
        <div
          style={{
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#ffffff',
            height: '100%',
          }}
        >
          {/* Header & New Actions */}
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Chats & Groups
              </h3>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                {isAdminOrHR && (
                  <button
                    type="button"
                    onClick={() => setIsNewGroupModalOpen(true)}
                    className="btn btn-primary"
                    style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', fontWeight: '700' }}
                    title="Create a project team or intern group"
                  >
                    + New Group
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsDirectModalOpen(true)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', fontWeight: '600' }}
                  title="Direct 1-on-1 message"
                >
                  💬 1:1 Chat
                </button>
              </div>
            </div>

            {/* Search Box */}
            <input
              type="text"
              placeholder="🔍 Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8125rem',
                backgroundColor: '#ffffff',
                outline: 'none',
              }}
            />

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.625rem' }}>
              {[
                { id: 'ALL', label: 'All' },
                { id: 'GROUPS', label: 'Groups & Projects' },
                { id: 'DIRECT', label: 'Direct (1:1)' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '0.35rem',
                    borderRadius: 'var(--radius-sm)',
                    border: 'none',
                    fontSize: '0.75rem',
                    fontWeight: activeTab === tab.id ? '700' : '500',
                    backgroundColor: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                    color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingConv ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                Loading conversations...
              </div>
            ) : filteredConversations.length === 0 ? (
              <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>No conversations yet</div>
                <p style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {isAdminOrHR ? 'Create a project or intern group above, or initiate a 1:1 chat.' : 'Start a 1:1 direct chat with a team member.'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = conv.id === activeConvId;
                const isGroup = conv.type === 'GROUP';
                const isDirect = conv.type === 'DIRECT';
                const isOtherOnline = isDirect && conv.otherUser?.is_online;

                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    style={{
                      padding: '0.875rem 1rem',
                      borderBottom: '1px solid var(--border-color)',
                      cursor: 'pointer',
                      backgroundColor: isActive ? 'var(--primary-light)' : '#ffffff',
                      borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      transition: 'background-color 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#ffffff';
                    }}
                  >
                    {/* Avatar with Online Dot */}
                    <div style={{ position: 'relative', width: '42px', height: '42px', flexShrink: 0 }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: isGroup ? 'var(--radius-md)' : '50%',
                          backgroundColor: conv.category === 'PROJECT' ? '#f0fdf4' : conv.category === 'INTERN' ? '#e0f2fe' : 'var(--primary-light)',
                          color: conv.category === 'PROJECT' ? '#166534' : conv.category === 'INTERN' ? '#0369a1' : 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '800',
                          fontSize: isGroup ? '1.25rem' : '0.875rem',
                          border: '1px solid rgba(0,0,0,0.08)',
                          overflow: 'hidden',
                        }}
                      >
                        {isDirect && conv.otherUser?.profile_photo ? (
                          <img src={conv.otherUser.profile_photo} alt={conv.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : isGroup ? (
                          conv.category === 'PROJECT' ? '💼' : conv.category === 'INTERN' ? '🎓' : '🏢'
                        ) : (
                          conv.title.slice(0, 2).toUpperCase()
                        )}
                      </div>

                      {/* Online dot for Direct Chat */}
                      {isDirect && (
                        <span style={{ position: 'absolute', bottom: '-2px', right: '-2px' }}>
                          <OnlineIndicator isOnline={isOtherOnline} size="sm" />
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.2rem' }}>
                        <div
                          style={{
                            fontWeight: isActive ? '700' : '600',
                            fontSize: '0.875rem',
                            color: 'var(--text-main)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {conv.title}
                        </div>
                        {conv.last_message_at && (
                          <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                            {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            margin: 0,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '190px',
                          }}
                        >
                          {conv.last_message_text || 'No messages yet'}
                        </p>

                        {conv.unreadCount > 0 && (
                          <span
                            style={{
                              backgroundColor: 'var(--primary)',
                              color: '#ffffff',
                              fontSize: '0.6875rem',
                              fontWeight: '700',
                              borderRadius: 'var(--radius-full)',
                              padding: '0.1rem 0.45rem',
                              flexShrink: 0,
                            }}
                          >
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>

                      {/* Category Pill */}
                      <div style={{ marginTop: '0.25rem' }}>
                        <span
                          style={{
                            fontSize: '0.625rem',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            backgroundColor:
                              conv.category === 'PROJECT'
                                ? '#dcfce7'
                                : conv.category === 'INTERN'
                                ? '#e0f2fe'
                                : conv.category === 'DIRECT'
                                ? '#f3e8ff'
                                : 'var(--bg-subtle)',
                            color:
                              conv.category === 'PROJECT'
                                ? '#166534'
                                : conv.category === 'INTERN'
                                ? '#0369a1'
                                : conv.category === 'DIRECT'
                                ? '#7e22ce'
                                : '#475569',
                          }}
                        >
                          {conv.category}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT PANE: ACTIVE MESSAGE THREAD ================= */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc' }}>
          {currentConv ? (
            <>
              {/* Active Conversation Header */}
              <div
                style={{
                  padding: '0.875rem 1.5rem',
                  backgroundColor: '#ffffff',
                  borderBottom: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: currentConv.type === 'GROUP' ? 'var(--radius-md)' : '50%',
                        backgroundColor: currentConv.category === 'PROJECT' ? '#f0fdf4' : currentConv.category === 'INTERN' ? '#e0f2fe' : 'var(--primary-light)',
                        color: currentConv.category === 'PROJECT' ? '#166534' : currentConv.category === 'INTERN' ? '#0369a1' : 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '800',
                        fontSize: currentConv.type === 'GROUP' ? '1.2rem' : '0.875rem',
                        overflow: 'hidden',
                        border: '1px solid var(--border-color)',
                      }}
                    >
                      {currentConv.type === 'DIRECT' && currentConv.otherUser?.profile_photo ? (
                        <img src={currentConv.otherUser.profile_photo} alt={currentConv.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : currentConv.type === 'GROUP' ? (
                        currentConv.category === 'PROJECT' ? '💼' : currentConv.category === 'INTERN' ? '🎓' : '🏢'
                      ) : (
                        currentConv.title.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    {currentConv.type === 'DIRECT' && (
                      <span style={{ position: 'absolute', bottom: '-2px', right: '-2px' }}>
                        <OnlineIndicator isOnline={currentConv.otherUser?.is_online} size="sm" />
                      </span>
                    )}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                        {currentConv.title}
                      </h3>
                      <span
                        style={{
                          fontSize: '0.6875rem',
                          fontWeight: '700',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          backgroundColor: currentConv.category === 'PROJECT' ? '#dcfce7' : currentConv.category === 'INTERN' ? '#e0f2fe' : 'var(--bg-subtle)',
                          color: currentConv.category === 'PROJECT' ? '#166534' : currentConv.category === 'INTERN' ? '#0369a1' : '#475569',
                        }}
                      >
                        {currentConv.category}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.15rem' }}>
                      {currentConv.type === 'DIRECT' ? (
                        <OnlineIndicator
                          isOnline={currentConv.otherUser?.is_online}
                          size="xs"
                          showText={true}
                          textLabel={currentConv.otherUser?.is_online ? 'Active now' : 'Offline'}
                        />
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          👥 {currentConv.memberCount} members in channel &bull; {currentConv.description || 'Project & team collaboration'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Header Action Button */}
                {currentConv.type === 'GROUP' && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsGroupInfoOpen(true)}
                    style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', fontWeight: '600' }}
                  >
                    ℹ️ Channel Info ({currentConv.memberCount})
                  </button>
                )}
              </div>

              {/* Message List */}
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.875rem',
                }}
              >
                {loadingMessages ? (
                  <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    Loading conversation messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>💬</div>
                    <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>
                      Start of conversation
                    </div>
                    <p style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                      Send the first message to kick off the discussion!
                    </p>
                  </div>
                ) : (
                  messages.map((msg, index) => {
                    if (msg.message_type === 'SYSTEM') {
                      return (
                        <div key={msg.id || index} style={{ textAlign: 'center', margin: '0.5rem 0' }}>
                          <span
                            style={{
                              padding: '0.25rem 0.75rem',
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              borderRadius: 'var(--radius-full)',
                              fontSize: '0.75rem',
                              color: 'var(--text-muted)',
                              fontWeight: '500',
                            }}
                          >
                            {msg.message}
                          </span>
                        </div>
                      );
                    }

                    const isMine = msg.isMine;

                    return (
                      <div
                        key={msg.id || index}
                        style={{
                          display: 'flex',
                          flexDirection: isMine ? 'row-reverse' : 'row',
                          alignItems: 'flex-end',
                          gap: '0.625rem',
                        }}
                      >
                        {/* Avatar for others */}
                        {!isMine && (
                          <div style={{ position: 'relative', width: '32px', height: '32px', flexShrink: 0 }}>
                            <div
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary-light)',
                                color: 'var(--primary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                overflow: 'hidden',
                              }}
                            >
                              {msg.senderPhoto ? (
                                <img src={msg.senderPhoto} alt={msg.senderName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                (msg.senderName || 'U').slice(0, 2).toUpperCase()
                              )}
                            </div>
                            <span style={{ position: 'absolute', bottom: '-2px', right: '-2px' }}>
                              <OnlineIndicator isOnline={msg.senderOnline} size="xs" />
                            </span>
                          </div>
                        )}

                        {/* Speech Bubble */}
                        <div
                          style={{
                            maxWidth: '65%',
                            padding: '0.75rem 1rem',
                            borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                            backgroundColor: isMine ? 'var(--primary)' : 'var(--bg-card)',
                            color: isMine ? '#ffffff' : 'var(--text-main)',
                            boxShadow: isMine ? '0 2px 4px rgba(15, 118, 110, 0.2)' : '0 1px 3px rgba(0,0,0,0.06)',
                            border: isMine ? 'none' : '1px solid var(--border-color)',
                          }}
                        >
                          {!isMine && currentConv.type === 'GROUP' && (
                            <div style={{ fontSize: '0.6875rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.2rem' }}>
                              {msg.senderName} &bull; <span style={{ opacity: 0.8 }}>{msg.senderDesignation || msg.senderRole}</span>
                            </div>
                          )}

                          <div style={{ fontSize: '0.875rem', lineHeight: '1.45', wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                            {msg.message}
                          </div>

                          <div
                            style={{
                              fontSize: '0.625rem',
                              marginTop: '0.35rem',
                              textAlign: 'right',
                              color: isMine ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)',
                              fontWeight: '500',
                            }}
                          >
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            {isMine && <span style={{ marginLeft: '0.25rem' }}>✓✓</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                {/* Live Typing Indicator */}
                {typingMap[activeConvId]?.length > 0 && (
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.8125rem',
                      color: 'var(--text-muted)',
                      fontStyle: 'italic',
                      padding: '0.4rem 0.875rem',
                      backgroundColor: 'var(--bg-subtle)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-full)',
                      alignSelf: 'flex-start',
                      margin: '0.35rem 0',
                    }}
                  >
                    <span className="pulse-dot online" style={{ width: '6px', height: '6px' }}></span>
                    <span>{typingMap[activeConvId].join(', ')} is typing...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Emoji Reactions */}
              <div
                style={{
                  padding: '0.35rem 1.25rem',
                  backgroundColor: 'var(--bg-card)',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  gap: '0.5rem',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', fontWeight: '600' }}>Quick reactions:</span>
                {['👍', '🎉', '🚀', '✅', '💡', '❤️', '👏'].map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setMessageInput((prev) => prev + emoji)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      padding: '0.1rem 0.25rem',
                      borderRadius: '4px',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-subtle)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Message Composer */}
              <form
                onSubmit={handleSendMessage}
                style={{
                  padding: '0.875rem 1.25rem',
                  backgroundColor: 'var(--bg-card)',
                  borderTop: '1px solid var(--border-color)',
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                }}
              >
                <input
                  type="text"
                  placeholder={`Message ${currentConv.title}... (Press Enter to send)`}
                  value={messageInput}
                  onChange={handleInputChange}
                  disabled={sending}
                  style={{
                    flex: 1,
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.875rem',
                    backgroundColor: 'var(--bg-subtle)',
                    outline: 'none',
                  }}
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || sending}
                  className="btn btn-primary"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    padding: '0.75rem 1.25rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>Send</span> ✈️
                </button>
              </form>
            </>
          ) : (
            <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>💬</div>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Select a channel or colleague
              </h3>
              <p style={{ fontSize: '0.875rem' }}>
                Choose an active group from the left panel or initiate a direct chat.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL: CREATE NEW GROUP CHANNEL ================= */}
      {isNewGroupModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div className="card" style={{ width: '100%', maxWidth: '520px', padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                  ⚙️ Create Group Channel
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                  Create dedicated collaboration squads for Projects, Interns, or Departments
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewGroupModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateGroup}>
              {/* Category Selector */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  Channel Purpose / Category *
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'PROJECT', label: '💼 Project Group' },
                    { id: 'INTERN', label: '🎓 Intern Hub' },
                    { id: 'GENERAL', label: '🏢 General Room' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setGroupForm({ ...groupForm, category: cat.id })}
                      style={{
                        padding: '0.6rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: groupForm.category === cat.id ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                        backgroundColor: groupForm.category === cat.id ? 'var(--primary-light)' : '#ffffff',
                        color: groupForm.category === cat.id ? 'var(--primary)' : 'var(--text-main)',
                        fontWeight: '700',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* If Project Category, select project */}
              {groupForm.category === 'PROJECT' && (
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                    Link to Project (Optional)
                  </label>
                  <select
                    value={groupForm.project_id}
                    onChange={(e) => {
                      const pid = e.target.value;
                      const selectedProj = projects.find((p) => String(p.id) === pid);
                      setGroupForm({
                        ...groupForm,
                        project_id: pid,
                        title: selectedProj ? `💼 ${selectedProj.project_name} Squad` : groupForm.title,
                      });
                    }}
                    style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                  >
                    <option value="">-- Choose Active Project --</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.project_name} ({p.status})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Channel Title */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  Channel Name / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Fintech Mobile Team or 2026 Interns Hub"
                  value={groupForm.title}
                  onChange={(e) => setGroupForm({ ...groupForm, title: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  Channel Description (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Brief description of channel goals and discussion topics"
                  value={groupForm.description}
                  onChange={(e) => setGroupForm({ ...groupForm, description: e.target.value })}
                  style={{ width: '100%', padding: '0.625rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', fontFamily: 'inherit' }}
                />
              </div>

              {/* Member Selection */}
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: '700', marginBottom: '0.35rem' }}>
                  Add Initial Team Members (Employees & Interns)
                </label>
                <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.5rem' }}>
                  {activeColleagues.map((member) => {
                    const isSelected = groupForm.member_ids.includes(member.id);
                    return (
                      <label
                        key={member.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.4rem 0.6rem',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: isSelected ? 'var(--primary-light)' : 'transparent',
                          cursor: 'pointer',
                          marginBottom: '0.2rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setGroupForm({ ...groupForm, member_ids: [...groupForm.member_ids, member.id] });
                              } else {
                                setGroupForm({ ...groupForm, member_ids: groupForm.member_ids.filter((id) => id !== member.id) });
                              }
                            }}
                          />
                          <span style={{ fontSize: '0.8125rem', fontWeight: '600' }}>
                            {member.displayName}
                          </span>
                          <span
                            style={{
                              fontSize: '0.65rem',
                              padding: '0.1rem 0.35rem',
                              borderRadius: '4px',
                              backgroundColor: member.employment_type === 'INTERN' ? '#e0f2fe' : 'var(--bg-subtle)',
                              color: member.employment_type === 'INTERN' ? '#0369a1' : 'var(--text-muted)',
                            }}
                          >
                            {member.employment_type === 'INTERN' ? 'INTERN' : member.role}
                          </span>
                        </div>
                        <OnlineIndicator isOnline={member.is_online} size="xs" showText={true} />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsNewGroupModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingGroup || !groupForm.title.trim()}
                  className="btn btn-primary"
                >
                  {creatingGroup ? 'Creating Channel...' : '🚀 Create Channel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: DIRECT 1-ON-1 CHAT SELECTOR ================= */}
      {isDirectModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '1.75rem', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                  💬 Start 1:1 Direct Chat
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                  Select an employee, intern, or manager to message privately
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDirectModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="🔍 Search colleague by name, designation, or department..."
                value={directSearch}
                onChange={(e) => setDirectSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  fontSize: '0.85rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                }}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '55vh', overflowY: 'auto' }}>
              {activeColleagues
                .filter((m) => {
                  if (!directSearch.trim()) return true;
                  const q = directSearch.toLowerCase();
                  return (
                    m.displayName?.toLowerCase().includes(q) ||
                    m.designation?.toLowerCase().includes(q) ||
                    m.department?.toLowerCase().includes(q) ||
                    m.email?.toLowerCase().includes(q)
                  );
                })
                .map((member) => (
                  <div
                    key={member.id}
                    onClick={() => {
                      setDirectSearch('');
                      handleStartDirectChat(member);
                    }}
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      backgroundColor: '#ffffff',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--primary-light)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ position: 'relative', width: '38px', height: '38px' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            backgroundColor: member.employment_type === 'INTERN' ? '#e0f2fe' : 'var(--primary-light)',
                            color: member.employment_type === 'INTERN' ? '#0369a1' : 'var(--primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '0.8125rem',
                            overflow: 'hidden',
                          }}
                        >
                          {member.profile_photo ? (
                            <img src={member.profile_photo} alt={member.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            member.displayName.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <span style={{ position: 'absolute', bottom: '-2px', right: '-2px' }}>
                          <OnlineIndicator isOnline={member.is_online} size="xs" />
                        </span>
                      </div>

                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.875rem', color: 'var(--text-main)' }}>
                          {member.displayName}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {member.designation} &bull; {member.department}
                        </div>
                      </div>
                    </div>

                    <OnlineIndicator isOnline={member.is_online} size="xs" showText={true} />
                  </div>
                ))}
              {activeColleagues.filter((m) => {
                if (!directSearch.trim()) return true;
                const q = directSearch.toLowerCase();
                return (
                  m.displayName?.toLowerCase().includes(q) ||
                  m.designation?.toLowerCase().includes(q) ||
                  m.department?.toLowerCase().includes(q) ||
                  m.email?.toLowerCase().includes(q)
                );
              }).length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No colleagues found matching "{directSearch}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: GROUP CHANNEL INFO & MEMBERS ================= */}
      {isGroupInfoOpen && currentConv && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
        >
          <div className="card" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', maxHeight: '85vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                  Channel Details & Roster
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.15rem 0 0 0' }}>
                  {currentConv.title} ({currentConv.category})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGroupInfoOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Description
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                {currentConv.description || 'No description provided for this channel.'}
              </div>
            </div>

            <div style={{ fontSize: '0.8125rem', fontWeight: '700', marginBottom: '0.5rem' }}>
              Participants & Presence ({currentConv.participants?.length || 0})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {(currentConv.participants || []).map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: '0.5rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                    <div style={{ position: 'relative', width: '32px', height: '32px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-light)',
                          color: 'var(--primary)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '700',
                          fontSize: '0.75rem',
                          overflow: 'hidden',
                        }}
                      >
                        {p.profile_photo ? (
                          <img src={p.profile_photo} alt={p.displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          (p.displayName || 'U').slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <span style={{ position: 'absolute', bottom: '-2px', right: '-2px' }}>
                        <OnlineIndicator isOnline={p.is_online} size="xs" />
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: '700' }}>
                        {p.displayName} {p.user_id === user.id && '(You)'}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        {p.designation} &bull; {p.role === 'ADMIN' ? 'Channel Admin' : 'Member'}
                      </div>
                    </div>
                  </div>

                  <OnlineIndicator isOnline={p.is_online} size="xs" showText={true} />
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsGroupInfoOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default ChatPage;
