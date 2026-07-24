import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { CreateIssueRequest } from '../types/issue.types';

const issueFormSchema = z.object({
  taskRecordId: z.string().min(1, 'Please select a task to link this issue to.'),
  description: z.string().min(5, 'Description must be at least 5 characters long.'),
  note: z.string().optional(),
  imageUrl: z.string().optional(),
  severity: z.enum(['CRITICAL', 'MAJOR', 'MINOR', 'OBSERVATION']),
});

export type IssueFormValues = z.infer<typeof issueFormSchema>;

interface UseIssueFormProps {
  onSubmit: (data: CreateIssueRequest) => Promise<void>;
}

export const useIssueForm = ({ onSubmit }: UseIssueFormProps) => {
  const form = useForm<IssueFormValues>({
    resolver: zodResolver(issueFormSchema),
    defaultValues: {
      taskRecordId: '',
      description: '',
      note: '',
      imageUrl: '',
      severity: 'MINOR',
    },
  });

  const handleFormSubmit = async (values: IssueFormValues) => {
    const payload: CreateIssueRequest = {
      taskRecordId: values.taskRecordId,
      description: values.description,
      note: values.note || undefined,
      imageUrl: values.imageUrl || undefined,
      issueDate: new Date().toISOString(),
      severity: values.severity,
    };
    await onSubmit(payload);
  };

  const handleReset = () => {
    form.reset({
      taskRecordId: '',
      description: '',
      note: '',
      imageUrl: '',
      severity: 'MINOR',
    });
  };

  return {
    form,
    handleSubmit: form.handleSubmit(handleFormSubmit),
    handleReset,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
  };
};

export default useIssueForm;
