import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div data-testid="error-boundary-fallback" style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>문제가 발생했습니다</h2>
          <p>페이지를 새로고침해 주세요.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
