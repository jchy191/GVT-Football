import { signIn } from '@/auth';

export default function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <button
        type="submit"
        className="ring-indigo-700 font-medium text-white bg-indigo-700 rounded-md ring-1 px-2 py-1 hover:bg-white hover:text-indigo-700"
      >
        Sign In With Google
      </button>
    </form>
  );
}
