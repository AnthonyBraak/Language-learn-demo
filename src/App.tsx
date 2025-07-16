import { Chat } from "./components/Chat";
import { History } from "./components/History";

export default function App() {
  return (
    <div>
      <header className="sticky-header">LANGUAGE Practice Chat</header>
      <div className="main-content">
        <History />
        <Chat />
      </div>
    </div>
  );
}
