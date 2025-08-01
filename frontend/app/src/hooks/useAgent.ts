import { useState, useCallback, useRef } from 'react';
import { agentService, type ChatRequest, type ChatResponse, type Track } from '@/lib/agent';

interface UseAgentOptions {
  userId: string;
  onTrackRecommendations?: (tracks: Track[]) => void;
  onError?: (error: Error) => void;
}

export interface AgentMessage {
  id: string;
  type: 'user' | 'agent' | 'system' | 'tool';
  content: string;
  tracks?: Track[];
  timestamp: Date;
  isStreaming?: boolean;
  toolName?: string;
  toolDescription?: string;
  toolStatus?: 'start' | 'complete' | 'error';
  toolInfo?: any;
}

export function useAgent({ userId, onTrackRecommendations, onError }: UseAgentOptions) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | undefined>();
  const abortControllerRef = useRef<AbortController | null>(null);

  const addMessage = useCallback((message: Omit<AgentMessage, 'id'>) => {
    const newMessage: AgentMessage = {
      ...message,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage.id;
  }, []);

  const updateMessage = useCallback((id: string, updates: Partial<AgentMessage>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, ...updates } : msg
    ));
  }, []);

  const removeMessage = useCallback((id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const sendMessage = useCallback(async (
    message: string, 
    options: { 
      streaming?: boolean; 
      context?: { mood?: string } 
    } = {}
  ) => {
    if (!message.trim() || isLoading) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Add user message
    const userMessageId = addMessage({
      type: 'user',
      content: message,
      timestamp: new Date(),
    });

    setIsLoading(true);

    try {
      const request: ChatRequest = {
        message: message.trim(),
        user_id: userId,
        session_id: sessionId,
        context: options.context,
      };

      if (options.streaming) {
        // Streaming response - start with thinking state
        const thinkingMessageId = addMessage({
          type: 'system',
          content: 'Thinking',
          timestamp: new Date(),
          isStreaming: true,
        });

        let fullResponse = '';
        let tracks: Track[] = [];
        let agentMessageId: string | null = null;

        try {
          for await (const chunk of agentService.chatStream(request)) {
            if (chunk.type === 'start') {
              // Keep showing thinking state
              updateMessage(thinkingMessageId, { 
                content: 'Thinking' 
              });
            } else if (chunk.type === 'tool_selection') {
              // Show tool selection reasoning
              addMessage({
                type: 'tool',
                content: `Selected tools: ${chunk.tools?.join(', ')} - ${chunk.reasoning}`,
                timestamp: new Date(),
                toolInfo: chunk
              });
            } else if (chunk.type === 'tool_start') {
              // Show tool start
              addMessage({
                type: 'tool',
                content: `${chunk.description}...`,
                timestamp: new Date(),
                toolName: chunk.tool,
                toolDescription: chunk.description,
                toolStatus: 'start'
              });
            } else if (chunk.type === 'tool_complete') {
              // Show tool completion
              const tracksInfo = chunk.tracks_found > 0 ? ` (found ${chunk.tracks_found} tracks)` : '';
              addMessage({
                type: 'tool',
                content: `✓ Completed${tracksInfo}`,
                timestamp: new Date(),
                toolName: chunk.tool,
                toolStatus: 'complete',
                toolInfo: chunk
              });
            } else if (chunk.type === 'tool_error') {
              // Show tool error
              addMessage({
                type: 'tool',
                content: `✗ Error: ${chunk.error}`,
                timestamp: new Date(),
                toolName: chunk.tool,
                toolStatus: 'error',
                toolInfo: chunk
              });
            } else if (chunk.type === 'complete') {
              // Final response - remove thinking and add agent response
              removeMessage(thinkingMessageId);
              
              agentMessageId = addMessage({
                type: 'agent',
                content: chunk.response,
                tracks: chunk.tracks || [],
                timestamp: new Date(),
                isStreaming: false,
              });

              fullResponse = chunk.response;
              tracks = chunk.tracks || [];

              if (chunk.session_id) {
                setSessionId(chunk.session_id);
              }

              if (tracks.length > 0 && onTrackRecommendations) {
                onTrackRecommendations(tracks);
              }
            } else if (chunk.type === 'error') {
              throw new Error(chunk.error);
            }
          }
        } catch (error) {
          updateMessage(agentMessageId, {
            content: 'Sorry, something went wrong. Please try again.',
            isStreaming: false,
          });
          throw error;
        }
      } else {
        // Regular response
        const response = await agentService.chat(request);
        
        addMessage({
          type: 'agent',
          content: response.response,
          tracks: response.tracks,
          timestamp: new Date(),
        });

        if (response.session_id) {
          setSessionId(response.session_id);
        }

        if (response.tracks.length > 0 && onTrackRecommendations) {
          onTrackRecommendations(response.tracks);
        }
      }
    } catch (error) {
      console.error('Agent chat error:', error);
      
      addMessage({
        type: 'agent',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      });

      if (onError) {
        onError(error as Error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, sessionId, isLoading, addMessage, updateMessage, onTrackRecommendations, onError]);

  const submitFeedback = useCallback(async (
    trackId: string, 
    feedbackType: 'like' | 'dislike' | 'skip' | 'play_full',
    feedbackData?: Record<string, any>
  ) => {
    try {
      await agentService.submitFeedback({
        user_id: userId,
        track_id: trackId,
        feedback_type: feedbackType,
        feedback_data: feedbackData,
      });
    } catch (error) {
      console.error('Feedback submission error:', error);
      if (onError) {
        onError(error as Error);
      }
    }
  }, [userId, onError]);

  const analyzePlaylist = useCallback(async (playlistUrl: string) => {
    if (!playlistUrl.trim() || isLoading) return;

    const userMessageId = addMessage({
      type: 'user',
      content: `Analyze this playlist: ${playlistUrl}`,
      timestamp: new Date(),
    });

    setIsLoading(true);

    try {
      const response = await agentService.analyzePlaylist(playlistUrl, userId);
      
      addMessage({
        type: 'agent',
        content: response.analysis,
        tracks: response.tracks,
        timestamp: new Date(),
      });

      if (response.tracks && response.tracks.length > 0 && onTrackRecommendations) {
        onTrackRecommendations(response.tracks);
      }
    } catch (error) {
      console.error('Playlist analysis error:', error);
      
      addMessage({
        type: 'agent',
        content: 'Sorry, I couldn\'t analyze that playlist. Please check the URL and try again.',
        timestamp: new Date(),
      });

      if (onError) {
        onError(error as Error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId, isLoading, addMessage, onTrackRecommendations, onError]);

  const clearConversation = useCallback(() => {
    setMessages([]);
    setSessionId(undefined);
  }, []);

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    submitFeedback,
    analyzePlaylist,
    clearConversation,
    cancelRequest,
  };
}