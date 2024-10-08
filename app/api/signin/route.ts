import { signIn } from '@/auth';

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  return signIn('google', {
    redirectTo: searchParams.get('callbackUrl') ?? '',
  });
}
