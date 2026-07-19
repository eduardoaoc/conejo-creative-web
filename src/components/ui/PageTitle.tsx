import { FadeIn } from '@/components/motion/FadeIn';

type PageTitleProps = {
  title: string;
  description?: string;
};

export function PageTitle({ title, description }: PageTitleProps) {
  return (
    <FadeIn>
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-4 text-lg leading-relaxed text-zinc-600">{description}</p>
        ) : null}
      </header>
    </FadeIn>
  );
}
