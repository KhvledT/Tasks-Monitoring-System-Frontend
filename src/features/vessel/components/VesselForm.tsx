import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createVesselSchema, type CreateVesselFormValues } from '../schemas/vessel.schema';
import { FormInput } from '../../../shared/components/forms/FormInput';
import { FormSelect } from '../../../shared/components/forms/FormSelect';

interface VesselFormProps {
  onSubmit: (data: CreateVesselFormValues) => void;
  isLoading: boolean;
  errorMsg: string | null;
  onCancel: () => void;
}

export const VesselForm: React.FC<VesselFormProps> = ({
  onSubmit,
  isLoading,
  errorMsg,
  onCancel,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateVesselFormValues>({
    resolver: zodResolver(createVesselSchema) as any,
    defaultValues: {
      name: '',
      type: 'Container Ship',
      grt: undefined,
      dwt: undefined,
    },
  });

  const vesselTypeOptions = [
    { value: 'Container Ship', label: 'Container Ship' },
    { value: 'Oil Tanker', label: 'Oil Tanker' },
    { value: 'LPG', label: 'LPG' },
    { value: 'Bulk Carrier', label: 'Bulk Carrier' },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-red-950/20 border border-red-900/50 rounded-xl text-sm text-red-400">
          {errorMsg}
        </div>
      )}

      <FormInput
        label="Vessel Name"
        type="text"
        error={errors.name?.message}
        disabled={isLoading}
        placeholder="e.g. Pacific Voyager"
        {...register('name')}
      />

      <FormSelect
        label="Vessel Type"
        options={vesselTypeOptions}
        error={errors.type?.message}
        disabled={isLoading}
        {...register('type')}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormInput
          label="Gross Tonnage (GRT)"
          type="number"
          error={errors.grt?.message}
          disabled={isLoading}
          placeholder="e.g. 45000"
          {...register('grt')}
        />

        <FormInput
          label="Deadweight Tonnage (DWT)"
          type="number"
          error={errors.dwt?.message}
          disabled={isLoading}
          placeholder="e.g. 75000"
          {...register('dwt')}
        />
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-zinc-900">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl border border-zinc-800 bg-transparent text-zinc-400 hover:text-zinc-300 font-semibold text-sm active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl border border-sky-500 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-950/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Registering...</span>
            </>
          ) : (
            'Register Vessel'
          )}
        </button>
      </div>
    </form>
  );
};
export default VesselForm;
