'use client';

import { useEffect, useState, useRef } from 'react';
import { ApolloProvider, useQuery, useMutation, useSubscription } from '@apollo/client';
import { apolloClient } from '@/lib/apollo-client';
import { GET_LAST_PING, TRIGGER_PING, PING_SUBSCRIPTION } from '@/lib/graphql/operations';

interface OperationLog {
  id: string;
  type: 'query' | 'mutation' | 'subscription';
  operation: string;
  timestamp: string;
  data?: string;
}

function PingPage() {
  const [lastPing, setLastPing] = useState<string | null>(null);
  const [operations, setOperations] = useState<OperationLog[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const addOperation = (type: 'query' | 'mutation' | 'subscription', operation: string, data?: string) => {
    const newOperation: OperationLog = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      operation,
      timestamp: new Date().toISOString(),
      data,
    };
    setOperations((prev) => [newOperation, ...prev].slice(0, 50)); // Keep last 50 operations
  };

  // Query: Get last ping on mount
  const { data: queryData } = useQuery(GET_LAST_PING, {
    onCompleted: (data) => {
      if (data?.ping) {
        setLastPing(data.ping);
        addOperation('query', 'GetLastPing', data.ping);
      }
    },
    onError: (error) => {
      addOperation('query', 'GetLastPing', `Error: ${error.message}`);
    },
  });

  // Mutation: Trigger ping
  const [triggerPing] = useMutation(TRIGGER_PING, {
    onCompleted: (data) => {
      if (data?.ping) {
        addOperation('mutation', 'TriggerPing', data.ping);
      }
    },
    onError: (error) => {
      addOperation('mutation', 'TriggerPing', `Error: ${error.message}`);
    },
  });

  // Subscription: Listen to ping updates
  useSubscription(PING_SUBSCRIPTION, {
    onData: ({ data }) => {
      if (data?.data?.ping) {
        setLastPing(data.data.ping);
        addOperation('subscription', 'PingSubscription', data.data.ping);
      }
    },
    onError: (error) => {
      addOperation('subscription', 'PingSubscription', `Error: ${error.message}`);
    },
  });

  // Set up random interval for mutation
  useEffect(() => {
    const scheduleNextPing = () => {
      const randomDelay = Math.floor(Math.random() * 2000) + 1000; // 1-3 seconds
      intervalRef.current = setTimeout(() => {
        triggerPing();
        scheduleNextPing();
      }, randomDelay);
    };

    scheduleNextPing();

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [triggerPing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          GraphQL Ping Monitor
        </h1>

        {/* Current Ping Display */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Last Ping Timestamp
          </h2>
          <div className="text-3xl font-mono text-indigo-600 dark:text-indigo-400">
            {lastPing ? new Date(lastPing).toLocaleString() : 'Waiting for ping...'}
          </div>
        </div>

        {/* Operations Log */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
            GraphQL Operations Log
          </h2>
          <div className="overflow-auto max-h-[600px]">
            {operations.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No operations yet...</p>
            ) : (
              <div className="space-y-2">
                {operations.map((op) => (
                  <div
                    key={op.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            op.type === 'query'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : op.type === 'mutation'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                          }`}
                        >
                          {op.type.toUpperCase()}
                        </span>
                        <span className="font-mono text-sm text-gray-700 dark:text-gray-300">
                          {op.operation}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(op.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {op.data && (
                      <div className="text-sm font-mono text-gray-600 dark:text-gray-400 ml-2">
                        {op.data.startsWith('Error:') ? (
                          <span className="text-red-600 dark:text-red-400">{op.data}</span>
                        ) : (
                          <span>{new Date(op.data).toLocaleString()}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ApolloProvider client={apolloClient}>
      <PingPage />
    </ApolloProvider>
  );
}
