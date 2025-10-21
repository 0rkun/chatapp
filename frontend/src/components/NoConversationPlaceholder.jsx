import { MessageCircleIcon } from "lucide-react";

const NoConversationPlaceholder = () => {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <div>
          <MessageCircleIcon className="size-10 text-cyan-200 mb-2" />
        </div>
        <h3 className="text-xl font-semibold text-slate-200 mb-2">
          Select a conversation
        </h3>
        <p className="text-slate-400 max-w-md">
          Choose a contact from the sidebar to start chatting or continue a
          previous conversation.
        </p>
      </div>
    </div>
  );
};

export default NoConversationPlaceholder;
