import { redirect } from 'next/navigation';

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  if (searchParams.get('error')) {
    redirect(`/?error=${searchParams.get('error')}`);
  }
  redirect('/');
}
