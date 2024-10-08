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
        className="ring-error text-white font-medium bg-error rounded-md ring-1 px-2 py-1 hover:bg-white hover:text-error"
      >
        Sign Out
      </button>
    </form>
  );
}
