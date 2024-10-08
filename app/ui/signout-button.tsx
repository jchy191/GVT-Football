import { signOut } from '@/auth';

export default function SignOut() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut();
      }}
    >
      <button
        type="submit"
        className="ring-red-700 text-white font-medium bg-red-700 rounded-md ring-1 px-2 py-1 hover:bg-white hover:text-red-700"
      >
        Sign Out
      </button>
    </form>
  );
}
