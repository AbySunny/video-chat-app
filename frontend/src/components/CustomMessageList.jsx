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

// Rotating icon component
const CircularArrowsIcon = ({ spinning }) => (
  <img
    src="https://cdn-icons-png.flaticon.com/512/54/54303.png"
    alt="circular arrow"
    width={12}
    height={12}
    style={{
      display: "inline-block",
      animation: spinning ? "spin-circular-arrow 1s linear infinite" : "none",
    }}
  />
);

// Add keyframes for spin animation (only once)
if (!document.getElementById("spin-circular-arrow-style")) {
  const style = document.createElement("style");
  style.id = "spin-circular-arrow-style";
  style.innerHTML = `
    @keyframes spin-circular-arrow {
      100% { transform: rotate(360deg); }
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
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.split(urlRegex).map((part, i) =>
    urlRegex.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline break-all"
      >
        {part}
      </a>
    ) : (
      part
    )
  );
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
    <div className="flex flex-col gap-2 px-4 py-2 overflow-y-auto h-[60vh]">
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
                <span className="bg-gray-300 text-xs text-gray-700 px-3 py-1 rounded-full shadow">
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
              <span className="text-xs text-gray-400 mb-1">
                {formatTime(msg.created_at)}
              </span>
              {/* Message box with button inside */}
              <div
                className={`
                  flex items-center rounded-lg px-3 py-2
                  ${isSender ? "bg-blue-100" : "bg-gray-100"}
                `}
              >
                <span className="text-sm text-gray-800">
                  {isTranslating
                    ? linkify(msg.text)
                    : linkify(displayText)}
                </span>
                <button
                  className="ml-2 p-1 hover:bg-gray-200 rounded"
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