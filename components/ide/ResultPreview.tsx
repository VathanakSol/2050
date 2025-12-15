"use client";

import React, { useEffect, useRef } from 'react';

interface ResultPreviewProps {
  htmlCode: string;
  cssCode: string;
  jsCode: string;
  onConsoleLog: (type: 'log' | 'error' | 'warn', message: any[]) => void;
}

export const ResultPreview: React.FC<ResultPreviewProps> = ({
  htmlCode,
  cssCode,
  jsCode,
  onConsoleLog,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const lastCodeRef = useRef<string>('');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.source === 'ide-console') {
        onConsoleLog(event.data.type, event.data.message);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onConsoleLog]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    // Create a hash of the current code to prevent duplicate executions
    const currentCodeHash = `${htmlCode}|${cssCode}|${jsCode}`;
    if (lastCodeRef.current === currentCodeHash) {
      return; // Skip if code hasn't changed
    }
    lastCodeRef.current = currentCodeHash;

    const consoleScript = `
      <script>
        (function() {
          const originalLog = console.log;
          const originalError = console.error;
          const originalWarn = console.warn;

          function sendToParent(type, args) {
            try {
              window.parent.postMessage({
                source: 'ide-console',
                type: type,
                message: args.map(arg => {
                  if (typeof arg === 'object') {
                    try {
                      return JSON.stringify(arg, null, 2);
                    } catch (e) {
                      return '[Circular or Error]';
                    }
                  }
                  return String(arg);
                })
              }, '*');
            } catch (e) {
              // Ignore messaging errors
            }
          }

          console.log = function(...args) {
            originalLog.apply(console, args);
            sendToParent('log', args);
          };

          console.error = function(...args) {
            originalError.apply(console, args);
            sendToParent('error', args);
          };

          console.warn = function(...args) {
            originalWarn.apply(console, args);
            sendToParent('warn', args);
          };
          
          window.onerror = function(message, source, lineno, colno, error) {
             sendToParent('error', [message + ' (' + lineno + ':' + colno + ')']);
          };
        })();
      </script>
    `;

    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${cssCode}</style>
          ${consoleScript}
        </head>
        <body>
          ${htmlCode}
          <script>
            try {
              ${jsCode}
            } catch (err) {
              console.error(err);
            }
          </script>
        </body>
      </html>
    `;

    // Capture current scroll position
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;

    // Update iframe content
    doc.open();
    doc.write(fullHtml);
    doc.close();

    // Restore scroll position immediately and after next paint
    const restoreScroll = () => {
      window.scrollTo(scrollX, scrollY);
    };

    restoreScroll(); // Immediate restore
    requestAnimationFrame(() => {
      restoreScroll(); // After paint
      requestAnimationFrame(restoreScroll); // Double-check after second paint
    });
  }, [htmlCode, cssCode, jsCode]);

  return (
    <iframe
      ref={iframeRef}
      title="Preview"
      className="w-full h-full bg-white border-0 block"
      tabIndex={-1}
    // sandbox="allow-scripts allow-modals"
    />
  );
};
