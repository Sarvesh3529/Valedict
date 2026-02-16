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

type ActionResponse = {
  explanation?: string;
  error?: string;
}

export async function solveDoubt(
  formData: FormData
): Promise<ActionResponse> {
  const validatedFields = schema.safeParse({
    questionText: formData.get('questionText') as string,
    questionImage: formData.get('questionImage') as File,
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.questionImage?.[0] ?? 'Invalid input.',
    };
  }

  const { questionText, questionImage } = validatedFields.data;

  if (!questionText && (!questionImage || questionImage.size === 0)) {
    return { error: 'Please enter a question or upload an image.' };
  }
  
  let imageAsDataUrl: string | undefined = undefined;

  if (questionImage && questionImage.size > 0) {
    const buffer = Buffer.from(await questionImage.arrayBuffer());
    imageAsDataUrl = `data:${questionImage.type};base64,${buffer.toString('base64')}`;
  }
  
  try {
    const result = await aiDoubtSolver({
      questionText,
      questionImage: imageAsDataUrl,
    });
    return { explanation: result.explanation };
  } catch (error) {
    console.error(error);
    return { error: 'An error occurred while getting the explanation. Please try again.' };
  }
}
