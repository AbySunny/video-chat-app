import { useChannelStateContext } from "stream-chat-react";
import useAuthUser from "../hooks/useAuthUser";
import { useState } from "react";

// Gemini translation API call
const translateWithGemini = async (text, targetLang) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const prompt = `Just translate this to ${targetLang} without any explanation or extra text:\n${text}`;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );
  const data = await response.json();
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Translation unavailable."
  );
};

// Rotating icon component - Theme-aware circular arrows
const CircularArrowsIcon = ({ spinning }) => (
  <img
    src="https://cdn-icons-png.flaticon.com/512/54/54303.png"
    alt="circular arrow"
    width={12}
    height={12}
    className={`circular-arrows-icon transition-all duration-200 ${
      spinning ? "animate-spin" : ""
    }`}
    style={{
      display: "inline-block",
    }}
  />
);

// Add theme-aware styling for the circular arrows icon to match text color exactly
if (!document.getElementById("circular-arrows-theme-style")) {
  const style = document.createElement("style");
  style.id = "circular-arrows-theme-style";
  style.innerHTML = `
    /* Make icon inherit the exact same color as the message text */
    .circular-arrows-icon {
      filter: none !important;
      opacity: 1 !important;
    }
    
    /* Light themes - match text color exactly */
    [data-theme="light"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="cupcake"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="bumblebee"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="emerald"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="corporate"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="retro"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="valentine"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="garden"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="pastel"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="fantasy"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="wireframe"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="cmyk"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="autumn"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="business"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="lemonade"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="winter"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="nord"] .str-chat__message--me .circular-arrows-icon {
      filter: invert(1) brightness(0) saturate(100%) !important;
    }
    
    /* Dark themes - match text color exactly */
    [data-theme="dark"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="forest"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="synthwave"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="halloween"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="aqua"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="lofi"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="black"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="luxury"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="dracula"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="acid"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="night"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="coffee"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="dim"] .str-chat__message--me .circular-arrows-icon,
    [data-theme="sunset"] .str-chat__message--me .circular-arrows-icon {
      filter: invert(0) brightness(1) saturate(100%) !important;
    }
    
    /* For other messages (not sent by current user) */
    [data-theme="light"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="cupcake"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="bumblebee"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="emerald"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="corporate"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="retro"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="valentine"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="garden"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="pastel"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="fantasy"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="wireframe"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="cmyk"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="autumn"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="business"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="lemonade"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="winter"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="nord"] .str-chat__message--other .circular-arrows-icon {
      filter: invert(0) brightness(0) saturate(100%) !important;
    }
    
    [data-theme="dark"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="forest"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="synthwave"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="halloween"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="aqua"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="lofi"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="black"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="luxury"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="dracula"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="acid"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="night"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="coffee"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="dim"] .str-chat__message--other .circular-arrows-icon,
    [data-theme="sunset"] .str-chat__message--other .circular-arrows-icon {
      filter: invert(1) brightness(1) saturate(100%) !important;
    }
  `;
  document.head.appendChild(style);
}

const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const isSameDay = (d1, d2) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

function linkify(text) {
  // Enhanced URL regex to catch more URL patterns including localhost
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.(com|org|net|io|co|dev|localhost)[^\s]*|localhost:[0-9]+[^\s]*)/g;
  
  // Debug: log the text to see what we're working with
  console.log('Linkify text:', text);
  
  return text.split(urlRegex).map((part, i) => {
    if (urlRegex.test(part)) {
      console.log('Found URL:', part);
      
      // Ensure the URL has a protocol
      let href = part;
      if (!part.startsWith('http://') && !part.startsWith('https://')) {
        href = `https://${part}`;
      }
      
      return (
        <a
          key={i}
          href={href}
          className="underline break-all cursor-pointer font-medium hover:opacity-80"
          style={{ color: 'inherit' }}
          onClick={(e) => {
            e.preventDefault(); // Prevent default link behavior
            e.stopPropagation(); // Prevent any parent click handlers
            console.log('Opening URL in current tab:', href);
            
            // Check if it's a video call URL
            if (href.includes('/call/')) {
              // Store the current chat URL to return to after call
              const currentChatUrl = window.location.href;
              sessionStorage.setItem('returnToChat', currentChatUrl);
              
              // Navigate to the call page in the same tab
              window.location.href = href;
            } else {
              // For other URLs, open in new tab
              window.open(href, '_blank');
            }
          }}
        >
          {part}
        </a>
      );
    }
    return part;
  });
}

const CustomMessageList = () => {
  const { messages, members } = useChannelStateContext();
  const { authUser } = useAuthUser();
  const [translations, setTranslations] = useState({}); // {msgId: {translated, showingTranslated}}
  const [loadingId, setLoadingId] = useState(null);

  const getTargetNativeLanguage = (msg) => {
    const otherMember = Object.values(members).find(
      (m) => m.user.id !== authUser._id
    );
    if (!otherMember) return "English";
    return msg.user.id === authUser._id
      ? otherMember.user.nativeLanguage || "English"
      : authUser.nativeLanguage || "English";
  };

  let lastDate = null;

  const handleTranslate = async (msg) => {
    // If already showing translation, toggle back to original
    if (translations[msg.id]?.showingTranslated) {
      setTranslations((prev) => ({
        ...prev,
        [msg.id]: { ...prev[msg.id], showingTranslated: false },
      }));
      return;
    }

    // If translation already exists, just show it
    if (translations[msg.id]?.translated) {
      setTranslations((prev) => ({
        ...prev,
        [msg.id]: { ...prev[msg.id], showingTranslated: true },
      }));
      return;
    }

    // Otherwise, fetch translation
    setLoadingId(msg.id);
    try {
      const targetLang = getTargetNativeLanguage(msg);
      const translated = await translateWithGemini(msg.text, targetLang);
      setTranslations((prev) => ({
        ...prev,
        [msg.id]: { translated, showingTranslated: true },
      }));
    } catch {
      setTranslations((prev) => ({
        ...prev,
        [msg.id]: { translated: "Translation failed.", showingTranslated: true },
      }));
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-2 px-4 py-2 overflow-y-auto h-[60vh] bg-base-100">
      {messages.map((msg, idx) => {
        const isSender = msg.user.id === authUser._id;
        const msgDate = new Date(msg.created_at);
        let showDate = false;

        if (!lastDate || !isSameDay(msgDate, lastDate)) {
          showDate = true;
          lastDate = msgDate;
        }

        const translationState = translations[msg.id];
        const showTranslated = translationState?.showingTranslated;
        const isTranslating = loadingId === msg.id;

        // Show translated message if toggled, otherwise original
        const displayText =
          showTranslated && translationState?.translated
            ? translationState.translated
            : msg.text;

        return (
          <div key={msg.id || idx} className="w-full">
            {showDate && (
              <div className="flex justify-center my-2">
                <span className="bg-base-300 text-xs text-base-content px-3 py-1 rounded-full shadow">
                  {formatDate(msg.created_at)}
                </span>
              </div>
            )}
            <div
              className={`
                flex flex-col max-w-[70%]
                ${isSender ? "self-end items-end ml-auto" : "self-start items-start"}
              `}
            >
              {/* Time above the message */}
              <span className="text-xs text-base-content/60 mb-1">
                {formatTime(msg.created_at)}
              </span>
              {/* Message box with button inside */}
              <div
                className={`
                  flex items-center rounded-lg px-3 py-2
                  ${isSender ? "bg-primary text-primary-content" : "bg-base-200 text-base-content"}
                `}
              >
                <span className="text-sm">
                  {isTranslating
                    ? linkify(msg.text)
                    : linkify(displayText)}
                </span>
                <button
                  className="ml-2 p-1 hover:bg-base-content/10 rounded text-inherit"
                  onClick={() => handleTranslate(msg)}
                  title="Translate"
                  disabled={isTranslating}
                >
                  <CircularArrowsIcon spinning={isTranslating} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CustomMessageList;