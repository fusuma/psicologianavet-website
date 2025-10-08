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
import { ShineBorder } from '@/registry/magicui/shine-border';

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

  // Bot detection tracking state
  const [formLoadTime] = useState<number>(() => Date.now());
  const [interactionCount, setInteractionCount] = useState<number>(0);
  const [hasFocusEvents, setHasFocusEvents] = useState<boolean>(false);
  const [hasMouseMovement, setHasMouseMovement] = useState<boolean>(false);

  // Derive listName from theme prop
  const listName = theme === 'dark' ? 'tutors' : 'vets';

  // Initialize React Hook Form with Zod resolver
  const form = useForm<SubscriptionPayload>({
    resolver: zodResolver(subscriptionPayloadSchema),
    defaultValues: {
      email: '',
      listName,
      // Honeypot fields (should remain empty)
      website: '',
      phone: '',
      company: '',
      // Temporal validation
      formLoadTime,
      formSubmitTime: 0, // Will be set on submit
      // Behavioral fingerprinting
      interactionCount: 0,
      hasFocusEvents: false,
      hasMouseMovement: false,
    },
  });

  // Track mouse movement (bot detection)
  useEffect(() => {
    const handleMouseMove = () => {
      if (!hasMouseMovement) {
        setHasMouseMovement(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasMouseMovement]);

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

    // Inject temporal and behavioral data before submission
    const enrichedData: SubscriptionPayload = {
      ...data,
      formSubmitTime: Date.now(),
      interactionCount,
      hasFocusEvents,
      hasMouseMovement,
    };

    // Log what we're about to send (for debugging)
    console.log('Submitting subscription data:', {
      ...enrichedData,
      timeTaken: enrichedData.formSubmitTime - enrichedData.formLoadTime,
    });

    try {
      const response = await apiClient.subscribe(enrichedData);

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
    <ShineBorder
      borderRadius={8}
      borderWidth={2}
      duration={14}
      color={['#269A9B', '#1f7d7e', '#269A9B']}
      className="w-full max-w-md mx-auto"
    >
      <div
        className={cn(
          'w-full p-6 rounded-lg',
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
                    className={cn(
                      theme === 'dark'
                        ? 'bg-[#2a2438] text-white border-[#3d3750] placeholder:text-gray-400'
                        : 'bg-[#1f7d7e] text-white border-[#1a6768] placeholder:text-gray-300'
                    )}
                    aria-required="true"
                    {...field}
                    onFocus={() => {
                      setHasFocusEvents(true);
                      setInteractionCount(prev => prev + 1);
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      setInteractionCount(prev => prev + 1);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Honeypot Fields (Bot Protection) - These should remain invisible and empty */}
          <div style={{ position: 'absolute', left: '-9999px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }} aria-hidden="true">
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="Your website"
                  tabIndex={-1}
                  autoComplete="off"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <input
                  type="tel"
                  placeholder="Your phone"
                  tabIndex={-1}
                  autoComplete="off"
                  {...field}
                />
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <input
                  type="text"
                  placeholder="Company name"
                  tabIndex={-1}
                  autoComplete="off"
                  {...field}
                />
              )}
            />
          </div>

          {/* Hidden List Name Field */}
          <FormField
            control={form.control}
            name="listName"
            render={({ field }) => (
              <input type="hidden" {...field} />
            )}
          />

          {/* Hidden tracking fields */}
          <input type="hidden" {...form.register('formLoadTime')} />
          <input type="hidden" {...form.register('formSubmitTime')} />
          <input type="hidden" {...form.register('interactionCount')} />
          <input type="hidden" {...form.register('hasFocusEvents')} />
          <input type="hidden" {...form.register('hasMouseMovement')} />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full font-bold transition-colors',
              theme === 'dark'
                ? 'bg-[#269A9B] hover:bg-[#1f7d7e] text-[#191723] hover:text-[#2a2438]'
                : 'bg-[#191723] hover:bg-[#2a2438] text-[hsl(181,57.28%,37.22%)] hover:text-[hsl(181,57.28%,47.22%)]'
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
    </ShineBorder>
  );
}
