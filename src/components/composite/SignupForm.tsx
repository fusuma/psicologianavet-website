'use client';

import { type ReactElement, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { subscriptionPayloadSchema, type SubscriptionPayload } from '@/shared/schemas';
import { apiClient } from '@/services/apiClient';
import { cn } from '@/lib/utils';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SignupFormProps {
  /**
   * The theme variant to apply ('dark' for Tutors, 'green' for Vets)
   * @default 'dark'
   */
  theme?: 'dark' | 'green';
}

export function SignupForm({ theme = 'dark' }: SignupFormProps): ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Derive listName from theme prop
  const listName = theme === 'dark' ? 'tutors' : 'vets';

  // Initialize React Hook Form with Zod resolver
  const form = useForm<SubscriptionPayload>({
    resolver: zodResolver(subscriptionPayloadSchema),
    defaultValues: {
      email: '',
      listName,
      honeypot: '',
    },
  });

  // Update listName when theme changes
  useEffect(() => {
    form.setValue('listName', listName);
  }, [theme, listName, form]);

  /**
   * Handle form submission
   */
  const onSubmit = async (data: SubscriptionPayload): Promise<void> => {
    setIsLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    // Log what we're about to send
    console.log('Submitting subscription data:', data);

    try {
      const response = await apiClient.subscribe(data);

      // Check if there's an error in the response
      if (response.error) {
        // Log detailed error info for debugging
        console.error('Subscription error:', response.error);

        // Handle specific error codes
        if (response.error.code === 'EMAIL_EXISTS') {
          setErrorMessage('Este e-mail já está cadastrado.');
        } else if (response.error.code === 'VALIDATION_ERROR') {
          setErrorMessage('Por favor, insira um endereço de e-mail válido.');
        } else {
          // Generic error for all other cases
          setErrorMessage('Algo deu errado. Por favor, tente novamente.');
        }
      } else {
        // Success - message varies by theme/audience
        const message = theme === 'dark'
          ? 'Obrigado! Verifique seu e-mail para baixar o diário gratuito.'
          : 'Obrigado! Verifique seu e-mail para acessar o guia gratuito.';
        setSuccessMessage(message);
        form.reset();
      }
    } catch (error: unknown) {
      // Handle unexpected errors
      setErrorMessage('Algo deu errado. Por favor, tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        'w-full max-w-md mx-auto p-6 rounded-lg',
        theme === 'dark' ? 'bg-[#191723] text-white' : 'bg-[#269A9B] text-white'
      )}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Input Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white">E-mail</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    className="bg-white text-gray-900"
                    aria-required="true"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Hidden Honeypot Field (Bot Protection) */}
          <FormField
            control={form.control}
            name="honeypot"
            render={({ field }) => (
              <input
                type="text"
                className="sr-only"
                tabIndex={-1}
                autoComplete="off"
                {...field}
              />
            )}
          />

          {/* Hidden List Name Field */}
          <FormField
            control={form.control}
            name="listName"
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full font-bold',
              theme === 'dark'
                ? 'bg-[#269A9B] hover:bg-[#1f7d7e] text-white'
                : 'bg-[#191723] hover:bg-[#2a2438] text-white'
            )}
          >
            {isLoading
              ? 'Enviando...'
              : theme === 'dark'
              ? 'Baixar Diário Gratuito'
              : 'Baixar Guia Gratuito'}
          </Button>

          {/* Success Message */}
          {successMessage && (
            <div
              role="alert"
              aria-live="polite"
              className="p-3 bg-green-100 text-green-800 rounded-md text-sm"
            >
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div
              role="alert"
              aria-live="polite"
              className="p-3 bg-red-100 text-red-800 rounded-md text-sm"
            >
              {errorMessage}
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
