'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supportSchema, type SupportFormData } from '@/lib/schemas/supportSchema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const SupportForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SupportFormData>({
    resolver: zodResolver(supportSchema),
  });

  const priority = watch('priority');

  const onSubmit = async (data: SupportFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('Support ticket submitted:', data);
      toast.success('Support ticket submitted successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to submit support ticket. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader>
        <CardTitle>Submit a Support Ticket</CardTitle>
        <CardDescription>
          Fill out the form below and our support team will get back to you as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Subject Field */}
          <div className="space-y-2">
            <Label htmlFor="subject" className={cn(errors.subject && 'text-destructive')}>
              Subject <span className="text-destructive">*</span>
            </Label>
            <Input
              id="subject"
              placeholder="Brief description of your issue"
              {...register('subject')}
              className={cn(
                errors.subject && 'border-destructive focus-visible:ring-destructive/20',
              )}
            />
            {errors.subject && <p className="text-destructive text-xs">{errors.subject.message}</p>}
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className={cn(errors.email && 'text-destructive')}>
              Email Address <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              {...register('email')}
              className={cn(errors.email && 'border-destructive focus-visible:ring-destructive/20')}
            />
            {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
          </div>

          {/* Priority Field */}
          <div className="space-y-2">
            <Label htmlFor="priority" className={cn(errors.priority && 'text-destructive')}>
              Priority Level <span className="text-destructive">*</span>
            </Label>
            <Select
              value={priority}
              onValueChange={(value) => setValue('priority', value as 'low' | 'medium' | 'high')}
            >
              <SelectTrigger
                id="priority"
                className={cn(
                  errors.priority && 'border-destructive focus-visible:ring-destructive/20',
                )}
              >
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - General inquiry</SelectItem>
                <SelectItem value="medium">Medium - Issue affecting workflow</SelectItem>
                <SelectItem value="high">High - Critical issue</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && (
              <p className="text-destructive text-xs">{errors.priority.message}</p>
            )}
          </div>

          {/* Message Field */}
          <div className="space-y-2">
            <Label htmlFor="message" className={cn(errors.message && 'text-destructive')}>
              Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Please describe your issue in detail..."
              rows={6}
              {...register('message')}
              className={cn(
                errors.message && 'border-destructive focus-visible:ring-destructive/20',
              )}
            />
            {errors.message && <p className="text-destructive text-xs">{errors.message.message}</p>}
            <p className="text-muted-foreground text-xs">
              Please provide as much detail as possible (20-1000 characters)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={() => reset()} disabled={isSubmitting}>
              Clear Form
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SupportForm;
