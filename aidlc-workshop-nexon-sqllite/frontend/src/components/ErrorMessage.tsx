interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div data-testid="error-message" style={{ padding: '1rem', textAlign: 'center', color: '#d32f2f' }}>
      <p>{message}</p>
      {onRetry && (
        <button
          data-testid="error-retry-button"
          onClick={onRetry}
          style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', minWidth: 44, minHeight: 44, cursor: 'pointer' }}
        >
          다시 시도
        </button>
      )}
    </div>
  );
}
