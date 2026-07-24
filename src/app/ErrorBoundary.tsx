import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Unhandled rendering error caught:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-bg-light text-text-dark p-6 text-center">
          <div className="max-w-md w-full border border-border-subtle bg-white rounded-xl p-8 shadow-sm">
            <div className="w-16 h-16 bg-red-50 border border-red-200 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Bridge Instrument Error</h1>
            <p className="text-text-muted text-sm mb-6">
              A rendering exception occurred on watch. The error message was:
              <br />
              <code className="text-red-700 text-xs mt-2 block bg-zinc-50 p-2 rounded border border-border-subtle overflow-x-auto text-left">
                {this.state.error?.message || 'Unknown Exception'}
              </code>
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="w-full py-2.5 px-4 bg-primary hover:bg-[#003fa3] rounded-lg font-bold transition text-white cursor-pointer active-btn-trigger"
              >
                Restart Bridge Logbook
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="w-full py-2.5 px-4 border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-700 rounded-lg font-bold transition cursor-pointer active-btn-trigger"
              >
                Return to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
