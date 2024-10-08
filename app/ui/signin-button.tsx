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
        className="ring-primary font-medium text-white bg-primary rounded-md ring-1 px-2 py-1 hover:bg-white hover:text-primary"
      >
        Sign In With Google
      </button>
    </form>
  );
}
