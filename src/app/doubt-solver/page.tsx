'use client';

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Sparkles, X } from 'lucide-react';
import { solveDoubt } from './actions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="lg" className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Getting explanation...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Solve my Doubt
        </>
      )}
    </Button>
  );
}

export default function DoubtSolverPage() {
  const [state, formAction] = useActionState(solveDoubt, { explanation: '', error: null });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [questionText, setQuestionText] = useState<string>('');

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
    const fileInput = document.getElementById('questionImage') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-center font-headline text-2xl text-primary">
            AI Doubt Solver
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground">
            Stuck on a problem? Get an instant AI-powered explanation.
          </p>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="questionText">Your Question</Label>
              <Textarea
                id="questionText"
                name="questionText"
                placeholder="e.g., How do I solve for x in 3x - 7 = 5?"
                rows={4}
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionImage">Or Upload an Image</Label>
              <div className="flex items-center space-x-2">
                <Input id="questionImage" name="questionImage" type="file" accept="image/*" onChange={handleImageChange} className="file:text-primary file:font-semibold"/>
              </div>
            </div>

            {imagePreview && (
                <div className="relative w-full max-w-sm mx-auto border p-2 rounded-lg">
                    <Image src={imagePreview} alt="Question preview" width={400} height={300} className="rounded-md w-full h-auto object-contain"/>
                    <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={clearImage}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}
            
            <SubmitButton />
          </form>

          {state.error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state.explanation && (
            <Card className="bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <Sparkles />
                        AI Explanation
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[[rehypeKatex, { output: 'html' }]]}>{state.explanation}</ReactMarkdown>
                    </div>
                </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
