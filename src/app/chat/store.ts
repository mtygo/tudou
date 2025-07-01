import { create } from "zustand";

interface ChatState {
  messages: Array<{
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: Date;
  }>;
  isLoading: boolean;
  addMessage: (content: string, role: "user" | "assistant") => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
}

const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  addMessage: (content, role) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: Date.now().toString(),
          content,
          role,
          timestamp: new Date(),
        },
      ],
    })),
  setLoading: (loading) => set({ isLoading: loading }),
  clearMessages: () => set({ messages: [] }),
  sendMessages: async (info: {
    messages: Array<{ role: string; content: string }>;
  }) => {
    try {
      const res = await fetch(
        "https://dashscope.aliyuncs.com/api/v1/apps/sk-66e0ed43a6094a29bce8bc91f66aa586/completion",
        {
          headers: {
            Authorization: "Bearer $DASHSCOPE_API_KEY",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: info.messages,
            stream: true,
          }),
        }
      );
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  },
}));

export default useChatStore;
