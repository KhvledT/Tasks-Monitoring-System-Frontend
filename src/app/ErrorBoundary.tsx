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
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-[#f4f4f5] p-6 text-center">
          <div className="max-w-md w-full border border-zinc-800 bg-zinc-900 rounded-xl p-8 shadow-2xl">
            <div className="w-16 h-16 bg-red-950/50 border border-red-800 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Bridge Instrument Error</h1>
            <p className="text-zinc-400 text-sm mb-6">
              A rendering exception occurred on watch. The error message was:
              <br />
              <code className="text-red-400 text-xs mt-2 block bg-black p-2 rounded border border-zinc-800 overflow-x-auto text-left">
                {this.state.error?.message || 'Unknown Exception'}
              </code>
            </p>
            <button
              onClick={this.handleReload}
              className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 rounded-lg font-medium transition text-white"
            >
              Restart Bridge Logbook
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
