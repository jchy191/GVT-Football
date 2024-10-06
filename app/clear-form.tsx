'use client';
import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteTable } from './lib/actions';
import { useFormState } from 'react-dom';

export default function ClearForm() {
  const initialState = '';
  const [state, formAction] = useFormState(deleteTable, initialState);
  return (
    <form action={formAction}>
      <button
        type="submit"
        className="rounded-md border p-2 hover:bg-red-200 bg-red-100"
      >
        <TrashIcon className="w-5 text-red-600" />
      </button>
      <p className="text-red-600 text-sm">{state}</p>
    </form>
  );
}
