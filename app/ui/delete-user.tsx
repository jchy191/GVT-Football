'use client';
import { TrashIcon } from '@heroicons/react/24/outline';
import { deleteUser } from '../lib/actions';
import { useFormState } from 'react-dom';

export default function DeleteUser({ id }: Readonly<{ id: string }>) {
  const initialState = '';
  const deleteUserWithId = deleteUser.bind(null, id);
  const [state, formAction] = useFormState(deleteUserWithId, initialState);
  return (
    <form action={formAction} className="flex justify-end">
      <p className="text-red-600 text-sm">{state}</p>
      <button
        type="submit"
        className="rounded-md border p-2 hover:bg-red-200 bg-red-100"
      >
        <TrashIcon className="w-5 text-red-600" />
      </button>
    </form>
  );
}
