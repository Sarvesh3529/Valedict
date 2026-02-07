'use server';

import { aiDoubtSolver } from '@/ai/flows/ai-doubt-solver';
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

const schema = z.object({
  questionText: z.string().optional(),
  questionImage: z
    .instanceof(File)
    .optional()
    .refine(file => !file || file.size <= MAX_FILE_SIZE, `Max image size is 5MB.`)
    .refine(
        file => !file || file.size === 0 || ALLOWED_IMAGE_TYPES.includes(file.type),
        'Only .jpg, .jpeg, .png, and .webp formats are supported.'
    ),
});

type FormState = {
  userQuestion: { text?: string; image?: string } | null;
  explanation: string;
  error: string | null;
}

export async function solveDoubt(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = schema.safeParse({
    questionText: formData.get('questionText') as string,
    questionImage: formData.get('questionImage') as File,
  });

  if (!validatedFields.success) {
    return {
      ...prevState,
      userQuestion: null,
      explanation: '',
      error: validatedFields.error.flatten().fieldErrors.questionImage?.[0] ?? 'Invalid input.',
    };
  }

  const { questionText, questionImage } = validatedFields.data;

  if (!questionText && (!questionImage || questionImage.size === 0)) {
    return { ...prevState, userQuestion: null, explanation: '', error: 'Please enter a question or upload an image.' };
  }
  
  let imageAsDataUrl: string | undefined = undefined;

  if (questionImage && questionImage.size > 0) {
    const buffer = Buffer.from(await questionImage.arrayBuffer());
    imageAsDataUrl = `data:${questionImage.type};base64,${buffer.toString('base64')}`;
  }
  
  const userQuestion = { text: questionText, image: imageAsDataUrl };

  try {
    const result = await aiDoubtSolver({
      questionText,
      questionImage: imageAsDataUrl,
    });
    return { userQuestion, explanation: result.explanation, error: null };
  } catch (error) {
    console.error(error);
    return { userQuestion, explanation: '', error: 'An error occurred while getting the explanation. Please try again.' };
  }
}
