import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';

export interface ExtractedIssueData {
  title: string;
  description: string;
  priority: string;
  status: string;
}

interface VoiceIssueCreatorProps {
  onIssueExtracted: (data: ExtractedIssueData) => void;
  onCloseRequest: () => void; 
}

const VoiceIssueCreator: React.FC<VoiceIssueCreatorProps> = ({ onIssueExtracted, onCloseRequest }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const recognitionRef = useRef<any>(null);
  const modalRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece + ' ';
          }
        }

        if (finalTranscript) {
          setTranscript(prev => prev + finalTranscript);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError('Speech recognition error. Please try again.');
        setIsRecording(false);
      };
    } else {
      setError('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
    }
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        }
        onCloseRequest(); 
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isRecording, onCloseRequest]); 

  const startRecording = () => {
    if (recognitionRef.current) {
      setTranscript('');
      setError('');
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      if (transcript.trim()) {
        extractIssueData(transcript);
      } else {
        setError('No speech detected. Please try again.');
      }
    }
  };

  const extractIssueData = async (text: string) => {
    setIsProcessing(true);
    setError('');
    
    try {
      const response = await fetch("http://localhost:8080/api/extract-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transcript: text
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      const extractedData: ExtractedIssueData = {
        title: data.title || text.slice(0, 60),
        description: data.description || text,
        priority: data.priority || 'Medium',
        status: data.status || 'Backlog'
      };
      
      onIssueExtracted(extractedData);
    } catch (error) {
      console.error('AI extraction error:', error);
      setError('Failed to extract issue data. Please try again.');
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="h-screen w-screen fixed flex items-center justify-center z-40" style={{
      background: 'rgba(0, 0, 0, 0.44)',
      backdropFilter: 'blur(2px)',
      WebkitBackdropFilter: 'blur(2px)'
    }}>
      <div 
        ref={modalRef} 
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Voice to Issue</h2>
          <p className="text-sm text-slate-600 mt-1">AI-Powered Issue Creation</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isProcessing}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white shadow-lg`}
          >
            {isRecording ? <Square size={40} /> : <Mic size={40} />}
          </button>
          
          <div className="text-center">
            <p className="text-lg font-semibold text-slate-700">
              {isProcessing 
                ? 'AI is analyzing...' 
                : isRecording 
                  ? 'Recording... Click to stop' 
                  : 'Click to start recording'}
            </p>
            {!isRecording && !isProcessing && (
              <p className="text-sm text-slate-500 mt-2">
                Speak naturally about your issue
              </p>
            )}
          </div>

          {transcript && !isProcessing && (
            <div className="w-full bg-slate-50 rounded-lg p-4 border border-slate-200 max-h-40 overflow-y-auto">
              <h3 className="text-xs font-semibold text-slate-700 mb-2">Transcript:</h3>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{transcript}</p>
            </div>
          )}

          {isProcessing && (
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-600 text-sm">Processing with AI...</span>
            </div>
          )}

          {error && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceIssueCreator;