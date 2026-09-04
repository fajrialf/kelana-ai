"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import AppNav from "../components/AppNav";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { Conversation, Message } from "../models/conversation";
import {
  createConversation,
  getMessages,
  listConversations,
  sendMessage,
  updateConversation,
} from "../services/conversation.service";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// New conversation modal
// ---------------------------------------------------------------------------

interface NewChatModalProps {
  onConfirm: (title: string) => void;
  onClose: () => void;
  loading: boolean;
}

function NewChatModal({ onConfirm, onClose, loading }: NewChatModalProps) {
  const [title, setTitle] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (title.trim()) onConfirm(title.trim());
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl border border-sky-100 bg-white p-6 shadow-2xl">
        <h2 className="mb-1 text-base font-semibold text-slate-900">New chat</h2>
        <p className="mb-4 text-sm text-slate-500">Type your first message — it will also become the chat title.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Plan a trip to Bali"
            className="rounded-xl border border-sky-200 px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !title.trim()}
              className="flex-1 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-sky-200 hover:from-sky-500 hover:to-blue-600 disabled:opacity-60"
            >
              {loading ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChatPage() {
  useAuthGuard();

  // Sidebar state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creatingConv, setCreatingConv] = useState(false);

  // Active conversation state
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);

  // Message input state
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  // Auto-scroll ref
  const bottomRef = useRef<HTMLDivElement>(null);
  // Textarea ref for auto-focus
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ---------------------------------------------------------------------------
  // Load conversations on mount
  // ---------------------------------------------------------------------------

  useEffect(() => {
    loadConversations();
  }, []);

  async function loadConversations() {
    setLoadingConvs(true);
    try {
      const data = await listConversations();
      setConversations(data);
    } catch {
      // silent
    } finally {
      setLoadingConvs(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Select a conversation → load its messages
  // ---------------------------------------------------------------------------

  async function selectConversation(conv: Conversation, focusInput = false) {
    if (activeConv?.id === conv.id) return;
    setActiveConv(conv);
    setMessages([]);
    setSendError(null);
    setLoadingMsgs(true);
    try {
      const data = await getMessages(conv.id);
      setMessages(data);
    } catch {
      // keep messages empty
    } finally {
      setLoadingMsgs(false);
      if (focusInput) {
        // slight delay so the textarea is rendered/enabled
        setTimeout(() => textareaRef.current?.focus(), 50);
      }
    }
  }

  // Auto-scroll whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------------------------------------------------------------------
  // Create new conversation
  // ---------------------------------------------------------------------------

  async function handleCreateConversation(title: string) {
    setCreatingConv(true);
    try {
      const conv = await createConversation(title);
      setConversations((prev) => [conv, ...prev]);
      setShowModal(false);

      // Select the new conversation
      setActiveConv(conv);
      setMessages([]);
      setSendError(null);
      setSending(true);

      // Optimistically show the first message (the title text)
      const optimisticUser: Message = {
        id: -1,
        conversation_id: conv.id,
        role: "user",
        content: title,
        created_at: new Date().toISOString(),
      };
      setMessages([optimisticUser]);

      // Send the title as the first message
      try {
        const result = await sendMessage(conv.id, title);
        setMessages([result.user_message, result.assistant_message]);
      } catch (err) {
        setMessages([]);
        setSendError(err instanceof Error ? err.message : "Failed to send message");
      } finally {
        setSending(false);
        // Focus textarea for follow-up
        setTimeout(() => textareaRef.current?.focus(), 50);
      }
    } catch {
      // keep it simple
    } finally {
      setCreatingConv(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Update conversation title
  // ---------------------------------------------------------------------------

  async function handleUpdateTitle(conversationId: number, newTitle: string) {
    const updated = await updateConversation(conversationId, newTitle);
    // Update in conversations list
    setConversations((prev) =>
      prev.map((c) => (c.id === conversationId ? { ...c, title: updated.title } : c))
    );
    // Update active conversation header if it's the active one
    if (activeConv?.id === conversationId) {
      setActiveConv((prev) => (prev ? { ...prev, title: updated.title } : prev));
    }
  }

  // ---------------------------------------------------------------------------
  // Send a message
  // ---------------------------------------------------------------------------

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!activeConv || !input.trim() || sending) return;

    const text = input.trim();
    setInput("");
    setSendError(null);
    setSending(true);

    // Optimistically add user message
    const optimisticUser: Message = {
      id: -1,
      conversation_id: activeConv.id,
      role: "user",
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimisticUser]);

    try {
      const result = await sendMessage(activeConv.id, text);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== -1),
        result.user_message,
        result.assistant_message,
      ]);
    } catch (err) {
      setMessages((prev) => prev.filter((m) => m.id !== -1));
      setSendError(err instanceof Error ? err.message : "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  // Handle Enter key (Shift+Enter = newline)
  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as React.FormEvent);
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-sky-100 via-white to-blue-50 px-4 py-6 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 flex-1">

        {/* Header */}
        <header className="relative overflow-hidden rounded-2xl border border-sky-100 px-8 py-8 shadow-[0_24px_80px_rgba(14,116,144,0.22)] sm:px-12">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <img src="/assets/bg-cloud-shadow.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="relative flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-sky-200">AI travel assistant</p>
            <h1 className="text-3xl font-bold text-sky-100 sm:text-4xl">Chat</h1>
            <p className="max-w-sm text-sm leading-6 text-sky-100">
              Have a conversation with KelanaAI. Context is remembered within each chat.
            </p>
          </div>
        </header>

        <AppNav active="chat" />

        {/* Main chat layout */}
        <div className="flex flex-1 gap-4 overflow-hidden" style={{ minHeight: "calc(100vh - 320px)" }}>

          {/* ---------------------------------------------------------------- */}
          {/* Sidebar                                                           */}
          {/* ---------------------------------------------------------------- */}
          <aside className="flex w-64 shrink-0 flex-col gap-2 rounded-2xl border border-sky-100 bg-white/90 p-3 shadow-[0_24px_80px_rgba(14,116,144,0.10)] backdrop-blur overflow-hidden">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-3 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-200 hover:from-sky-500 hover:to-blue-600 transition"
            >
              <span className="text-base leading-none">+</span>
              New chat
            </button>

            <div className="mt-1 flex-1 overflow-y-auto">
              {loadingConvs ? (
                <div className="flex flex-col gap-2 animate-pulse px-1 pt-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 rounded-xl bg-slate-100" />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <p className="px-2 pt-4 text-center text-xs text-slate-400">
                  No conversations yet.
                  <br />Start a new chat!
                </p>
              ) : (
                <ul className="flex flex-col gap-1">
                  {conversations.map((conv) => {
                    const isActive = activeConv?.id === conv.id;
                    // Use the live title from activeConv if this is the active conversation
                    const displayTitle = isActive && activeConv ? activeConv.title : conv.title;
                    return (
                      <li key={conv.id}>
                        <div
                          className={`group flex w-full items-center rounded-xl px-3 py-2.5 transition ${
                            isActive
                              ? "bg-sky-50 text-sky-700"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          {/* Clicking the text area selects the conversation */}
                          <button
                            onClick={() => selectConversation(conv)}
                            className="min-w-0 flex-1 text-left"
                          >
                            <p className="truncate text-sm font-medium">{displayTitle}</p>
                            <p className="mt-0.5 text-xs text-slate-400">{formatDate(conv.created_at)}</p>
                          </button>

                          {/* Pencil icon — only visible on hover */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Select the conversation first if not active, then edit
                              if (!isActive) selectConversation(conv);
                              // We rely on the header's InlineTitleEditor; just select the conv
                            }}
                            title="Edit title"
                            aria-label="Edit title"
                            className="ml-1 shrink-0 opacity-0 transition group-hover:opacity-60 hover:!opacity-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 16 16"
                              fill="currentColor"
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            >
                              <path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.609Zm1.414 1.06a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354l-1.086-1.086ZM11.189 6.25 9.75 4.81 3.434 11.127a.25.25 0 0 0-.063.108l-.652 2.278 2.277-.652a.25.25 0 0 0 .108-.063L11.19 6.25Z" />
                            </svg>
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>

          {/* ---------------------------------------------------------------- */}
          {/* Chat panel                                                        */}
          {/* ---------------------------------------------------------------- */}
          <div className="flex flex-1 flex-col rounded-2xl border border-sky-100 bg-white/90 shadow-[0_24px_80px_rgba(14,116,144,0.10)] backdrop-blur overflow-hidden">

            {/* Empty state */}
            {!activeConv && (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
                <span className="text-4xl">💬</span>
                <p className="text-sm font-medium text-slate-500">
                  Select a conversation or start a new chat.
                </p>
              </div>
            )}

            {/* Active conversation */}
            {activeConv && (
              <>
                {/* Conversation header */}
                <div className="flex items-center gap-3 border-b border-sky-100 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800"
                    > {activeConv.title}</p>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                  {loadingMsgs && (
                    <div className="flex flex-col gap-3 animate-pulse">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                          <div className={`h-10 rounded-2xl bg-slate-100 ${i % 2 === 0 ? "w-48" : "w-64"}`} />
                        </div>
                      ))}
                    </div>
                  )}

                  {!loadingMsgs && messages.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-sm text-slate-400">Send a message to start the conversation.</p>
                    </div>
                  )}

                  {!loadingMsgs && messages.map((msg) => (
                    <div
                      key={msg.id === -1 ? `opt-${msg.created_at}` : msg.id}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {/* Assistant avatar */}
                      {msg.role === "assistant" && (
                        <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
                          AI
                        </div>
                      )}

                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                          msg.role === "user"
                            ? "rounded-br-sm bg-sky-600 text-white"
                            : "rounded-bl-sm border border-sky-100 bg-sky-50 text-slate-800"
                        }`}
                      >
                        {msg.role === "assistant" ? (
                          <div className="prose prose-sm prose-slate max-w-none
                            prose-headings:text-slate-900 prose-headings:font-semibold
                            prose-a:text-sky-600 prose-a:no-underline hover:prose-a:underline
                            prose-strong:text-slate-900
                            prose-code:rounded prose-code:bg-white prose-code:px-1 prose-code:py-0.5 prose-code:text-sky-700
                            prose-ul:pl-4 prose-ol:pl-4">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Sending indicator */}
                  {sending && (
                    <div className="flex justify-start">
                      <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-600 text-xs font-bold text-white">
                        AI
                      </div>
                      <div className="rounded-2xl rounded-bl-sm border border-sky-100 bg-sky-50 px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-400 [animation-delay:0ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-400 [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sky-400 [animation-delay:300ms]" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={bottomRef} />
                </div>

                {/* Error */}
                {sendError && (
                  <div className="mx-5 mb-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-700">
                    {sendError}
                  </div>
                )}

                {/* Input */}
                <form
                  onSubmit={handleSend}
                  className="flex items-end gap-3 border-t border-sky-100 px-4 py-3"
                >
                  <textarea
                    ref={textareaRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
                    rows={2}
                    disabled={sending}
                    className="flex-1 resize-none rounded-xl border border-sky-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:opacity-60"
                  />
                  <button
                    type="submit"
                    disabled={sending || !input.trim()}
                    className="shrink-0 rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-sky-200 hover:from-sky-500 hover:to-blue-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 transition"
                  >
                    Send
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      {/* New chat modal */}
      {showModal && (
        <NewChatModal
          onConfirm={handleCreateConversation}
          onClose={() => setShowModal(false)}
          loading={creatingConv}
        />
      )}

      <footer className="mx-auto mt-6 w-full max-w-7xl border-t border-sky-100 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-sky-700">KelanaAI</span>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-400">AI-powered travel planner</span>
          </div>
          <span className="text-xs text-slate-400">© {new Date().getFullYear()} KelanaAI</span>
        </div>
      </footer>
    </main>
  );
}
