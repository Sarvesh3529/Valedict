'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Paperclip, Send, Sparkles, User, X } from 'lucide-react';
import { solveDoubt } from './actions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AnimatePresence, motion } from 'framer-motion';

// Type definition for a message in the chat
type ChatMessage = {
  id: string;
  role: 'user' | 'ai' | 'error';
  content: React.ReactNode;
};

// --- Components for rendering messages ---

function TypingIndicator() {
    return (
        <div className="flex items-center space-x-2">
            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></span>
        </div>
    )
}

function UserMessage({ content }: { content: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3 justify-end">
            <div className="bg-secondary p-3 rounded-lg max-w-prose">
                {content}
            </div>
            <Avatar className="h-9 w-9">
                <AvatarFallback><User /></AvatarFallback>
            </Avatar>
        </div>
    )
}

function AiMessage({ content }: { content: React.ReactNode }) {
    return (
        <div className="flex items-start gap-3">
            <Avatar className="h-9 w-9 bg-primary/20 text-primary">
                <AvatarFallback><Sparkles /></AvatarFallback>
            </Avatar>
            <div className="bg-primary/10 p-3 rounded-lg max-w-prose">
                {content}
            </div>
        </div>
    )
}

function SubmitButton({ isPending }: { isPending: boolean }) {
  return (
    <Button type="submit" disabled={isPending} size="icon" className="flex-shrink-0">
      {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      <span className="sr-only">Submit</span>
    </Button>
  );
}

// --- Main Page Component ---

export default function DoubtSolverPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
        id: 'welcome-message',
        role: 'ai',
        content: (
            <>
                <p className="font-semibold text-primary mb-1">AI Doubt Solver</p>
                <p>Stuck on a problem? Ask me anything! You can type your question or upload an image.</p>
            </>
        )
    }
  ]);
  const [isPending, setIsPending] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, isPending]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
        setImagePreview(null);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  }

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentQuestionText = formData.get('questionText') as string;
    const currentQuestionImage = formData.get('questionImage') as File;
    
    if (!currentQuestionText && (!currentQuestionImage || currentQuestionImage.size === 0)) {
        setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            role: 'error',
            content: "Please enter a question or upload an image."
        }]);
        return;
    }

    const userMessageContent = (
        <>
            {currentQuestionText && <p className="mb-2">{currentQuestionText}</p>}
            {imagePreview && <Image src={imagePreview} alt="Your question" width={200} height={150} className="rounded-md"/>}
        </>
    );

    // Add user message optimistically
    setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'user',
        content: userMessageContent
    }]);

    setIsPending(true);
    // Clear the input fields immediately
    setQuestionText('');
    clearImage();
    formRef.current?.reset();

    const result = await solveDoubt(formData);
    
    if (result.explanation) {
        setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            role: 'ai',
            content: (
                 <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { output: 'html' }]]}>{result.explanation!}</ReactMarkdown>
                </div>
            )
        }]);
    } else if (result.error) {
        setMessages(prev => [...prev, {
            id: crypto.randomUUID(),
            role: 'error',
            content: result.error
        }]);
    }

    setIsPending(false);
  }

  return (
    <div className="container mx-auto max-w-3xl h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)] flex flex-col p-0 md:p-4">
      <Card className="flex-1 flex flex-col overflow-hidden">
        <CardContent className="flex-1 flex flex-col p-4 md:p-6">
            {/* Chat messages area */}
            <div className="flex-1 space-y-6 overflow-y-auto pr-4">
                <AnimatePresence>
                    {messages.map((message) => (
                         <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                         >
                            {message.role === 'user' && <UserMessage content={message.content} />}
                            {message.role === 'ai' && <AiMessage content={message.content} />}
                            {message.role === 'error' && (
                                <Alert variant="destructive">
                                    <AlertTitle>Error</AlertTitle>
                                    <AlertDescription>{message.content}</AlertDescription>
                                </Alert>
                            )}
                         </motion.div>
                    ))}

                    {isPending && (
                        <motion.div key="typing-indicator" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                             <AiMessage content={<TypingIndicator />} />
                        </motion.div>
                    )}
                </AnimatePresence>
                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="mt-4 pt-4 border-t">
                 <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-2">
                    {imagePreview && (
                        <div className="relative w-32 border p-1 rounded-lg">
                            <Image src={imagePreview} alt="Question preview" width={100} height={75} className="rounded-md w-full h-auto object-contain"/>
                            <Button type="button" variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6" onClick={clearImage}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <Label htmlFor="questionImage" className="cursor-pointer">
                            <Paperclip className="h-6 w-6 text-muted-foreground hover:text-primary transition-colors" />
                            <Input id="questionImage" name="questionImage" type="file" accept="image/*" onChange={handleImageChange} className="hidden" ref={fileInputRef}/>
                        </Label>
                        <Textarea
                            id="questionText"
                            name="questionText"
                            placeholder="e.g., How do I solve for x in 3x - 7 = 5?"
                            rows={1}
                            value={questionText}
                            onChange={(e) => setQuestionText(e.target.value)}
                            className="flex-1 resize-none"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    formRef.current?.requestSubmit();
                                }
                            }}
                        />
                        <SubmitButton isPending={isPending} />
                    </div>
                </form>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
