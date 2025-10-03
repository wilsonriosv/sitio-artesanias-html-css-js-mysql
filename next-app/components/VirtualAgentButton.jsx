"use client";

export default function VirtualAgentButton({ onClick }) {
  return (
    <button
      className="virtual-agent-float"
      id="virtualAgentBtn"
      type="button"
      aria-label="Chatear con agente virtual"
      onClick={onClick}
    >
      <i className="fas fa-robot" aria-hidden="true" />
    </button>
  );
}



