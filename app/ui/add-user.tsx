'use client';

import Link from 'next/link';
import { createUser } from '../lib/actions';
import { useFormState } from 'react-dom';

export default function AddUser() {
  const [state, formAction] = useFormState(createUser, '');

  return (
    <form action={formAction}>
      <p>{state}</p>
      <label className="block" htmlFor="email">
        Enter new user&apos;s email:
      </label>
      <input className="block" id="email" name="email" />
      <label className="block" htmlFor="name">
        Select the new user&apos;s role:
      </label>
      <select name="role" id="role" className="block">
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
      <Link href={'/users'}>
        <button className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary">
          Back
        </button>
      </Link>
      <button
        type="submit"
        className="rounded-md ml-3 bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary"
      >
        Save
      </button>
    </form>
  );
}
