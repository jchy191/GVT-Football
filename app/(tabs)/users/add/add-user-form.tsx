'use client';

import Link from 'next/link';
import { createUser } from '../../../lib/actions';
import { useFormState } from 'react-dom';

export default function AddUserForm() {
  const [state, formAction] = useFormState(createUser, '');

  return (
    <form action={formAction}>
      <label className="block mt-6" htmlFor="email">
        Enter new user&apos;s email:
      </label>
      <input className="block" id="email" name="email" />
      <label className="block mt-6" htmlFor="name">
        Select the new user&apos;s role:
      </label>
      <select name="role" id="role" className="block">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <div className="flex justify-start mt-6">
        <Link href={'/users'}>
          <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-primary border border-primary">
            Back
          </button>
        </Link>
        <button
          type="submit"
          className="rounded-md ml-3 bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white hover:text-primary border border-primary"
        >
          Save
        </button>
      </div>
      <p className="text-error mt-2">{state}</p>
    </form>
  );
}
