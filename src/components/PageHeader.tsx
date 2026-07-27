import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

export default function PageHeader({ title, description, icon: Icon, children }: PageHeaderProps) {
  return (
    <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-start md:justify-between md:space-y-0">
      <div>
        <div className="flex items-center space-x-3">
          {Icon && <Icon className="h-8 w-8 text-primary" />}
          <h1 className="text-4xl font-headline text-foreground">{title}</h1>
        </div>
        {description && <p className="mt-2 text-lg text-muted-foreground">{description}</p>}
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  );
}
