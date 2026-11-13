export default function Star({ n, size = 40 }) {
  return (
    <span className="star" style={{ width: size, height: size }}>
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="9" y="9" width="22" height="22" />
          <rect x="9" y="9" width="22" height="22" transform="rotate(45 20 20)" />
        </g>
      </svg>
      {n != null && <b>{n}</b>}
    </span>
  );
}
