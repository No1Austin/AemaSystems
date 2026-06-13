import { useEffect, useRef, useState } from "react";
import { ArrowUp, Trash2 } from "lucide-react";
import "./AemaAI.css";
import { sendMessageToAemaAI } from "../services/aiService";
import PricingModal from "../components/PricingModal";
import Navbar from "../components/Navbar";

const firstQuestion =
  "Hi, I’m AEMA AI — your Business Intelligence Partner. Please be as detailed as possible. What type of business do you run, and what do you want to improve first: website, SEO, automation, sales, or business systems?";

const getInitialMessages = () => {
  const savedMessages = localStorage.getItem("aema_ai_messages");

  if (savedMessages) {
    try {
      return JSON.parse(savedMessages);
    } catch {
      localStorage.removeItem("aema_ai_messages");
    }
  }

  return [
    {
      role: "assistant",
      content: firstQuestion,
    },
  ];
};

export default function AemaAI() {
  const chatEndRef = useRef(null);
  const typingIntervalRef = useRef(null);

  const [messages, setMessages] = useState(getInitialMessages);
  const [input, setInput] = useState("");
  const [showPricing, setShowPricing] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [typingMessage, setTypingMessage] = useState(null);

  const latestBlueprint =
    messages
      .slice()
      .reverse()
      .find((msg) => msg.blueprint)?.blueprint || {};

  const isBusy = isThinking || Boolean(typingMessage);

  const typeAssistantReply = ({ content, blueprint }) => {
    let index = 0;
    const safeContent = content || "I could not generate a response.";

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    setTypingMessage({
      role: "assistant",
      content: "",
      blueprint: null,
    });

    typingIntervalRef.current = setInterval(() => {
      index += 1;

      setTypingMessage({
        role: "assistant",
        content: safeContent.slice(0, index),
        blueprint: null,
      });

      if (index >= safeContent.length) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;

        setTypingMessage(null);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: safeContent,
            blueprint: blueprint || null,
          },
        ]);
      }
    }, 18);
  };

  useEffect(() => {
    localStorage.setItem("aema_ai_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "auto",
    });
  }, [messages, isThinking, typingMessage]);

  useEffect(() => {
    const hideTawkWidget = () => {
      if (window.Tawk_API?.hideWidget) {
        window.Tawk_API.hideWidget();
      }
    };

    hideTawkWidget();

    const interval = setInterval(hideTawkWidget, 500);

    return () => {
      clearInterval(interval);

      if (window.Tawk_API?.showWidget) {
        window.Tawk_API.showWidget();
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);

  const clearChat = () => {
    const confirmed = window.confirm(
      "Do you want to clear and delete this chat? This action cannot be undone."
    );

    if (!confirmed) return;

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

    localStorage.removeItem("aema_ai_messages");
    setInput("");
    setShowPricing(false);
    setIsThinking(false);
    setTypingMessage(null);

    setMessages([
      {
        role: "assistant",
        content: firstQuestion,
      },
    ]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isBusy) return;

    const userMessage = {
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsThinking(true);

    try {
      const result = await sendMessageToAemaAI(updatedMessages);

      setTimeout(() => {
        setIsThinking(false);

        typeAssistantReply({
          content: result?.reply,
          blueprint: result?.blueprint || null,
        });
      }, 900);
    } catch (error) {
      console.error(error);

      setIsThinking(false);

      typeAssistantReply({
        content:
          "Sorry, I could not connect to AEMA AI right now. Please try again.",
        blueprint: null,
      });
    }
  };

  return (
    <main className="aema-ai-page">
      <Navbar />

      <section className="aema-chat-window">
        <div className="chat-header">
          <div className="chat-brand">
            <img src="/aema-logo.png" alt="AEMA AI" className="aema-logo" />

            <p className="brand-tagline">
              Your Business Intelligence Partner
            </p>
          </div>

          <button className="clear-chat-btn" onClick={clearChat} type="button">
            <Trash2 size={16} />
            Clear Chat
          </button>
        </div>

        <div className="chat-body">
          {messages.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              <p>{msg.content}</p>

              {msg.blueprint && (
                <div className="blueprint-card">
                  <h2>AEMA Growth Blueprint</h2>

                  <div className="blueprint-grid">
                    <div>
                      <span>Business</span>
                      <strong>{msg.blueprint.businessType}</strong>
                    </div>

                    <div>
                      <span>Goal</span>
                      <strong>{msg.blueprint.goal}</strong>
                    </div>

                    <div>
                      <span>Lead Source</span>
                      <strong>{msg.blueprint.leadSource}</strong>
                    </div>

                    <div>
                      <span>Website</span>
                      <strong>{msg.blueprint.websiteStatus}</strong>
                    </div>

                    {msg.blueprint.websiteUrl && (
                      <div>
                        <span>Website URL</span>
                        <strong>{msg.blueprint.websiteUrl}</strong>
                      </div>
                    )}

                    <div>
                      <span>Automation</span>
                      <strong>{msg.blueprint.automationNeed}</strong>
                    </div>

                    <div>
                      <span>Growth Potential</span>
                      <strong>{msg.blueprint.growthPotential}</strong>
                    </div>
                  </div>

                  <h3>Recommended Actions</h3>

                  <ul>
                    {msg.blueprint.recommendations?.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>

                  <h3>Recommended AEMA Services</h3>

                  <div className="service-tags">
                    {msg.blueprint.recommendedServices?.map((service, i) => (
                      <span key={i}>{service}</span>
                    ))}
                  </div>

                  <button
                    className="blueprint-cta"
                    onClick={() => setShowPricing(true)}
                    type="button"
                  >
                    Unlock Full Report
                  </button>
                </div>
              )}
            </div>
          ))}

          {isThinking && (
            <div className="chat-message assistant thinking">
              <p>
                AEMA is reasoning<span className="thinking-dots">...</span>
              </p>
            </div>
          )}

          {typingMessage && (
            <div className="chat-message assistant typing">
              <p>{typingMessage.content}</p>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {messages.length <= 1 && !isBusy && (
          <div className="suggestions">
            <button
              onClick={() => setInput("I need more customers for my business")}
              type="button"
            >
              Get More Customers
            </button>

            <button
              onClick={() => setInput("Audit my website and SEO")}
              type="button"
            >
              Audit My Website
            </button>

            <button
              onClick={() => setInput("Find automation ideas for my business")}
              type="button"
            >
              Find Automation Ideas
            </button>

            <button
              onClick={() =>
                window.open(
                  "https://task-manager-app-mern-phi.vercel.app/",
                  "_blank"
                )
              }
              type="button"
            >
              Use AEMA Task Manager
            </button>
          </div>
        )}

        <div className="chat-input-area">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={isBusy ? "AEMA is responding..." : "Message AEMA AI..."}
          />

          <button
            onClick={sendMessage}
            aria-label="Send message"
            type="button"
            disabled={isBusy}
          >
            <ArrowUp size={20} strokeWidth={3} />
          </button>
        </div>
      </section>

      <PricingModal
        open={showPricing}
        onClose={() => setShowPricing(false)}
        profile={latestBlueprint}
      />
    </main>
  );
}